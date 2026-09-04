import { ConflictException, Injectable, NotFoundException, UnprocessableEntityException } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import argon2 = require("argon2");
import { PrismaService } from "../database/prisma.service";
import { AuthUser } from "./auth.types";
import { ClassDto, EnrollmentDto, QuestionDto, ReleaseDto, ThemeDto, UserEditDto } from "./operations.dto";

@Injectable()
export class OperationsService {
  constructor(private readonly db: PrismaService) {}
  private async language(actor: AuthUser, id: string) {
    const row = await this.db.language.findFirst({where:{id,schoolId:actor.schoolId,isActive:true}});
    if (!row) throw new NotFoundException("language_not_found");
    return row;
  }
  private async user(actor: AuthUser,id:string) {
    const row=await this.db.user.findFirst({where:{id,schoolId:actor.schoolId}});
    if(!row) throw new NotFoundException("user_not_found");
    return row;
  }
  async workspace(actor: AuthUser) {
    const schoolId=actor.schoolId;
    const [languages,classes,users,profiles,enrollments,bloos,progress,themes]=await Promise.all([
      this.db.language.findMany({where:{schoolId,isActive:true}}),this.db.class.findMany({where:{schoolId},orderBy:{name:"asc"}}),
      this.db.user.findMany({where:{schoolId},select:{id:true,displayName:true,login:true,role:true,isActive:true,mustChangePassword:true,lastLoginAt:true},orderBy:{displayName:"asc"}}),
      this.db.studentProfile.findMany({where:{schoolId}}),this.db.enrollment.findMany({where:{schoolId,status:"Active"}}),this.db.bloo.findMany({where:{schoolId}}),this.db.studentThemeProgress.findMany({where:{schoolId}}),this.db.theme.findMany({where:{schoolId},orderBy:{createdAt:"desc"}}),
    ]);
    const [skills,categories,versions,releases]=await Promise.all([
      this.db.skill.findMany({where:{languageId:{in:languages.map(l=>l.id)}}}),this.db.skillCategory.findMany({where:{languageId:{in:languages.map(l=>l.id)}}}),
      this.db.themeVersion.findMany({where:{themeId:{in:themes.map(t=>t.id)}},orderBy:{versionNumber:"desc"}}),this.db.themeClass.findMany({where:{schoolId}}),
    ]);
    const [links,difficulties]=await Promise.all([this.db.themeQuestion.findMany({where:{themeVersionId:{in:versions.map(v=>v.id)}}}),this.db.themeDifficulty.findMany({where:{themeVersionId:{in:versions.map(v=>v.id)},isEnabled:true},orderBy:{order:"asc"}})]);
    return {languages,classes,skills,categories,enrollments,users:users.map(u=>{const p=profiles.find(p=>p.userId===u.id);return {...u,profileId:p?.id,bloos:bloos.filter(b=>b.studentProfileId===p?.id),progress:progress.filter(g=>g.studentProfileId===p?.id)};}),themes:themes.map(t=>({...t,releases:releases.filter(r=>r.themeId===t.id),versions:versions.filter(v=>v.themeId===t.id).map(v=>({...v,questionVersionIds:links.filter(l=>l.themeVersionId===v.id).map(l=>l.questionVersionId),difficulties:difficulties.filter(d=>d.themeVersionId===v.id).map(d=>d.difficulty)}))}))};
  }
  async saveClass(actor:AuthUser,data:ClassDto,id?:string){
    await this.language(actor,data.languageId);
    if(!data.name.trim() || !data.period.trim()) throw new UnprocessableEntityException("invalid_class");
    if(id){const old=await this.db.class.findFirst({where:{id,schoolId:actor.schoolId}});if(!old)throw new NotFoundException("class_not_found");if(old.languageId!==data.languageId)throw new ConflictException("class_language_immutable");return this.db.class.update({where:{id},data:{...data,name:data.name.trim(),version:{increment:1}}});}
    return this.db.class.create({data:{...data,name:data.name.trim(),schoolId:actor.schoolId}});
  }
  async editUser(actor:AuthUser,id:string,data:UserEditDto){
    const old=await this.user(actor,id);
    if(!data.fullName.trim() || !/^[a-zA-Z0-9._-]{3,80}$/.test(data.login))throw new UnprocessableEntityException("invalid_user");
    if(id===actor.id && !data.isActive)throw new ConflictException("cannot_disable_self");
    const normalizedLogin=data.login.toLocaleLowerCase("pt-BR");
    if(await this.db.user.findFirst({where:{schoolId:actor.schoolId,normalizedLogin,id:{not:id}}}))throw new ConflictException("login_already_exists");
    await this.db.$transaction(async tx=>{
      await tx.user.update({where:{id},data:{displayName:data.fullName.trim(),login:data.login,normalizedLogin,isActive:data.isActive,authVersion:old.isActive!==data.isActive?{increment:1}:undefined}});
      await tx.studentProfile.updateMany({where:{userId:id},data:{fullName:data.fullName.trim()}});
      await tx.auditLog.create({data:{schoolId:actor.schoolId,actorUserId:actor.id,action:"user.updated",entityType:"User",entityId:id}});
    });return {saved:true};
  }
  async resetPassword(actor:AuthUser,id:string,password:string){
    const target=await this.user(actor,id);
    if(id===actor.id)throw new ConflictException("use_change_password");
    if(password.length<(target.role==="Admin"?12:8)||password.toLowerCase()===target.login.toLowerCase()||["12345678","password","senha123","qwerty123"].includes(password.toLowerCase()))throw new UnprocessableEntityException("weak_password");
    const passwordHash=await argon2.hash(password,{type:argon2.argon2id});
    await this.db.$transaction([
      this.db.user.update({where:{id},data:{passwordHash,mustChangePassword:true,authVersion:{increment:1}}}),
      this.db.refreshToken.updateMany({where:{userId:id,revokedAt:null},data:{revokedAt:new Date(),revocationReason:"admin_password_reset"}}),
      this.db.auditLog.create({data:{schoolId:actor.schoolId,actorUserId:actor.id,action:"user.password_reset",entityType:"User",entityId:id}}),
    ]);return {changed:true};
  }
  async enroll(actor:AuthUser,data:EnrollmentDto){
    const target=await this.user(actor,data.userId);
    if(target.role!=="Student")throw new UnprocessableEntityException("student_required");
    const group=await this.db.class.findFirst({where:{id:data.classId,schoolId:actor.schoolId}});
    const profile=await this.db.studentProfile.findUnique({where:{userId:target.id}});
    if(!group||!profile)throw new NotFoundException("enrollment_target_not_found");
    if(data.active&&(!group.isActive||!target.isActive))throw new ConflictException("inactive_class_or_student");
    return this.db.$transaction(async tx=>{
      if(!data.active){await tx.enrollment.updateMany({where:{studentProfileId:profile.id,classId:group.id,status:"Active"},data:{status:"Paused",activeKey:null,endedAt:new Date()}});return {saved:true};}
      await tx.enrollment.upsert({where:{activeKey:`${profile.id}:${group.id}`},update:{},create:{schoolId:actor.schoolId,studentProfileId:profile.id,classId:group.id,activeKey:`${profile.id}:${group.id}`}});
      await tx.bloo.upsert({where:{studentProfileId_languageId:{studentProfileId:profile.id,languageId:group.languageId}},update:{},create:{schoolId:actor.schoolId,studentProfileId:profile.id,languageId:group.languageId}});
      return {saved:true};
    });
  }
  async questions(actor:AuthUser){
    const questions=await this.db.question.findMany({where:{schoolId:actor.schoolId},orderBy:{createdAt:"desc"}});
    const versions=await this.db.questionVersion.findMany({where:{questionId:{in:questions.map(q=>q.id)}},orderBy:{versionNumber:"desc"}});
    const options=await this.db.questionOption.findMany({where:{questionVersionId:{in:versions.map(v=>v.id)}},orderBy:{order:"asc"}});
    return questions.map(q=>({...q,versions:versions.filter(v=>v.questionId===q.id).map(v=>({...v,options:options.filter(o=>o.questionVersionId===v.id)}))}));
  }
  async saveQuestion(actor:AuthUser,data:QuestionDto,id?:string){
    await this.language(actor,data.languageId);
    const skill=await this.db.skill.findFirst({where:{id:data.skillId,languageId:data.languageId,isActive:true}});
    if(!skill||!data.prompt.trim()||!data.explanation.trim()||data.options.some(o=>!o.text.trim())||data.options.filter(o=>o.isCorrect).length!==1)throw new UnprocessableEntityException("invalid_question");
    if(id){const old=await this.db.question.findFirst({where:{id,schoolId:actor.schoolId,languageId:data.languageId}});if(!old)throw new NotFoundException("question_not_found");}
    return this.db.$transaction(async tx=>{
      const question=id?await tx.question.findUniqueOrThrow({where:{id}}):await tx.question.create({data:{schoolId:actor.schoolId,languageId:data.languageId,code:`Q-${randomUUID()}`,createdByUserId:actor.id}});
      const last=await tx.questionVersion.findFirst({where:{questionId:question.id},orderBy:{versionNumber:"desc"}});
      const version=await tx.questionVersion.create({data:{questionId:question.id,versionNumber:(last?.versionNumber??0)+1,skillId:skill.id,skillCategoryId:skill.skillCategoryId,type:data.type,difficulty:data.difficulty,prompt:data.prompt.trim(),explanation:data.explanation.trim(),status:data.publish?"Published":"Draft",publishedAt:data.publish?new Date():null,createdByUserId:actor.id}});
      if(data.publish)await tx.questionVersion.updateMany({where:{questionId:question.id,id:{not:version.id},status:"Published"},data:{status:"Archived",archivedAt:new Date()}});
      await tx.questionOption.createMany({data:data.options.map((o,order)=>({questionVersionId:version.id,text:o.text.trim(),isCorrect:o.isCorrect,order}))});
      return version;
    });
  }
  async saveTheme(actor:AuthUser,data:ThemeDto,id?:string){
    await this.language(actor,data.languageId);
    const questions=await this.db.question.findMany({where:{schoolId:actor.schoolId,languageId:data.languageId,isActive:true}});
    const versions=await this.db.questionVersion.findMany({where:{id:{in:data.questionVersionIds},questionId:{in:questions.map(q=>q.id)},status:"Published"}});
    if(versions.length!==data.questionVersionIds.length)throw new UnprocessableEntityException("select_published_questions");
    if(data.publish&&data.difficulties.some(d=>versions.filter(v=>v.difficulty===d).length<5))throw new UnprocessableEntityException("five_questions_per_level_required");
    if(id){const old=await this.db.theme.findFirst({where:{id,schoolId:actor.schoolId,languageId:data.languageId}});if(!old)throw new NotFoundException("theme_not_found");
      if(old.currentPublishedVersionId && await this.db.themeClass.count({where:{themeId:id}})){
        const previous=await this.db.themeDifficulty.findMany({where:{themeVersionId:old.currentPublishedVersionId,isEnabled:true}});
        if(previous.map(d=>d.difficulty).sort().join()!==[...data.difficulties].sort().join())throw new ConflictException("released_theme_levels_immutable");
      }
    }
    return this.db.$transaction(async tx=>{
      const theme=id?await tx.theme.findUniqueOrThrow({where:{id}}):await tx.theme.create({data:{schoolId:actor.schoolId,languageId:data.languageId,code:`THEME-${randomUUID()}`,createdByUserId:actor.id}});
      const last=await tx.themeVersion.findFirst({where:{themeId:theme.id},orderBy:{versionNumber:"desc"}});
      const version=await tx.themeVersion.create({data:{themeId:theme.id,versionNumber:(last?.versionNumber??0)+1,title:data.title.trim(),description:data.description.trim(),status:data.publish?"Published":"Draft",publishedAt:data.publish?new Date():null,createdByUserId:actor.id}});
      if(data.publish)await tx.themeVersion.updateMany({where:{themeId:theme.id,id:{not:version.id},status:"Published"},data:{status:"Archived",archivedAt:new Date()}});
      const order=["Easy","Medium","Hard","VeryHard"];
      await tx.themeDifficulty.createMany({data:data.difficulties.map(d=>({themeVersionId:version.id,difficulty:d,order:order.indexOf(d),questionsPerSession:5}))});
      if(versions.length)await tx.themeQuestion.createMany({data:versions.map((v,order)=>({themeVersionId:version.id,questionVersionId:v.id,order}))});
      const skills=[...new Set(versions.map(v=>v.skillId))];
      if(skills.length)await tx.themeSkill.createMany({data:skills.map((skillId,i)=>({themeVersionId:version.id,skillId,isPrimary:i===0}))});
      if(data.publish)await tx.theme.update({where:{id:theme.id},data:{currentPublishedVersionId:version.id,status:"Active",version:{increment:1}}});
      return version;
    });
  }
  async release(actor:AuthUser,themeId:string,data:ReleaseDto){
    const theme=await this.db.theme.findFirst({where:{id:themeId,schoolId:actor.schoolId}});
    const group=await this.db.class.findFirst({where:{id:data.classId,schoolId:actor.schoolId}});
    if(!theme?.currentPublishedVersionId||!group||group.languageId!==theme.languageId)throw new UnprocessableEntityException("published_theme_and_matching_class_required");
    if(data.active&&(!group.isActive||theme.status!=="Active"))throw new ConflictException("inactive_class_or_theme");
    const releaseAt=data.releaseAt?new Date(data.releaseAt):null;
    if(releaseAt&&isNaN(releaseAt.getTime()))throw new UnprocessableEntityException("invalid_release_date");
    const values={themeVersionId:theme.currentPublishedVersionId,isActive:data.active,releaseAt,releaseMode:releaseAt?"Scheduled" as const:"Immediate" as const};
    return this.db.themeClass.upsert({where:{themeId_classId:{themeId,classId:group.id}},update:values,create:{schoolId:actor.schoolId,themeId,classId:group.id,...values}});
  }
  async status(actor:AuthUser,kind:"themes"|"questions",id:string,active:boolean){
    if(kind==="themes"){if(!await this.db.theme.findFirst({where:{id,schoolId:actor.schoolId}}))throw new NotFoundException();await this.db.theme.update({where:{id},data:{status:active?"Active":"Closed"}});}
    else {if(!await this.db.question.findFirst({where:{id,schoolId:actor.schoolId}}))throw new NotFoundException();await this.db.question.update({where:{id},data:{isActive:active}});}
    return {saved:true};
  }
}
