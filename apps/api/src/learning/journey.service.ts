import { ConflictException, Injectable, NotFoundException, UnprocessableEntityException } from "@nestjs/common";
import { Difficulty, Prisma } from "@prisma/client";
import { randomInt } from "node:crypto";
import { PrismaService } from "../database/prisma.service";
import { AuthUser } from "../auth/auth.types";
import { AnswerDto, StartTrainingDto } from "./journey.dto";
type Tx=Prisma.TransactionClient;
const ordered:Difficulty[]=["Easy","Medium","Hard","VeryHard"];
@Injectable()
export class JourneyService {
 constructor(private readonly db:PrismaService){}
 private async context(user:AuthUser){
  const student=await this.db.studentProfile.findFirst({where:{userId:user.id,schoolId:user.schoolId}});
  const language=await this.db.language.findFirst({where:{schoolId:user.schoolId,code:"en",isActive:true}});
  if(!student||!language)throw new NotFoundException("student_or_language_not_found");
  const bloo=await this.db.bloo.upsert({where:{studentProfileId_languageId:{studentProfileId:student.id,languageId:language.id}},update:{},create:{schoolId:user.schoolId,studentProfileId:student.id,languageId:language.id}});
  return {student,language,bloo};
 }
 private async locked<T>(studentId:string,work:(tx:Tx)=>Promise<T>):Promise<T>{
  return this.db.$transaction(async tx=>{await tx.$queryRaw`SELECT id FROM StudentProfile WHERE id=${studentId} FOR UPDATE`;return work(tx);},{maxWait:10000,timeout:20000,isolationLevel:Prisma.TransactionIsolationLevel.ReadCommitted});
 }
 private async releases(tx:Tx,schoolId:string,studentId:string,languageId:string){
  const enrollments=await tx.enrollment.findMany({where:{schoolId,studentProfileId:studentId,status:"Active"}});
  const classes=await tx.class.findMany({where:{id:{in:enrollments.map(e=>e.classId)},schoolId,languageId,isActive:true}});
  const links=await tx.themeClass.findMany({where:{schoolId,classId:{in:classes.map(c=>c.id)},isActive:true,OR:[{releaseAt:null},{releaseAt:{lte:new Date()}}]}});
  const themes=await tx.theme.findMany({where:{id:{in:links.map(l=>l.themeId)},schoolId,languageId,status:"Active"}});
  const versions=await tx.themeVersion.findMany({where:{id:{in:links.map(l=>l.themeVersionId)},status:"Published"},orderBy:{versionNumber:"desc"}});
  return {classes,available:themes.flatMap(t=>{const version=versions.find(v=>v.themeId===t.id);return version?[{...t,version}]:[];})};
 }
 async home(user:AuthUser){
  const {student,language,bloo}=await this.context(user);
  const {classes,available}=await this.releases(this.db,user.schoolId,student.id,language.id);
  const progress=await this.db.studentThemeProgress.findMany({where:{studentProfileId:student.id,blooId:bloo.id}});
  const difficulties=await this.db.studentThemeDifficultyProgress.findMany({where:{studentThemeProgressId:{in:progress.map(p=>p.id)}}});
  const enabled=await this.db.themeDifficulty.findMany({where:{themeVersionId:{in:available.map(t=>t.version.id)},isEnabled:true},orderBy:{order:"asc"}});
  const unlocked=await this.db.studentAchievement.findMany({where:{studentProfileId:student.id,blooId:bloo.id}});
  const achievements=await this.db.achievement.findMany({where:{id:{in:unlocked.map(a=>a.achievementId)}}});
  const sessions=await this.db.trainingSession.findMany({where:{studentProfileId:student.id,status:"InProgress"}});
  return {bloo:{name:bloo.name,stage:bloo.stage,xp:bloo.xp},classes:classes.map(c=>c.name),achievements:achievements.map(a=>a.code),themes:available.map(t=>{
   const p=progress.find(p=>p.themeId===t.id);let priorDone=true;
   return {id:t.id,title:t.version.title,description:t.version.description,levels:enabled.filter(e=>e.themeVersionId===t.version.id).map(e=>{
    const d=difficulties.find(d=>d.studentThemeProgressId===p?.id&&d.difficulty===e.difficulty);const completed=(d?.sessionsCompleted??0)>0;
    const status=completed?"Completed":priorDone?"Available":"Locked";priorDone=priorDone&&completed;
    return {difficulty:e.difficulty,status,sessionsCompleted:d?.sessionsCompleted??0,bestCorrectAnswers:d?.bestCorrectAnswers??0};
   })};
  }),pending:sessions.map(s=>({id:s.id,type:s.type,themeId:s.themeId,difficulty:s.difficulty}))};
 }
 async start(user:AuthUser,input:StartTrainingDto){
  const ctx=await this.context(user);
  return this.locked(ctx.student.id,async tx=>{
   const {classes,available}=await this.releases(tx,user.schoolId,ctx.student.id,ctx.language.id);
   const first=input.type==="FirstHatch";
   const bloo=await tx.bloo.findUniqueOrThrow({where:{id:ctx.bloo.id}});
   const key=first?`${bloo.id}:first`:`${bloo.id}:${input.themeId}:${input.difficulty}`;
   // Resume uses pinned content, even if a class or release was disabled meanwhile.
   const existing=await tx.trainingSession.findUnique({where:{activeSessionKey:key}});
   if(existing)return this.snapshot(tx,existing.id);
   if(!classes.length)throw new ConflictException("active_enrollment_required");
   if(first&&bloo.stage==="Hatchling")throw new ConflictException("already_hatched");
   if(!first&&bloo.stage!=="Hatchling")throw new ConflictException("first_hatch_required");
   const theme=available.find(t=>t.id===input.themeId);
   let versionIds:string[]=[],templateId:string|undefined;
   if(first){
    const template=await tx.trainingTemplate.findFirst({where:{schoolId:user.schoolId,languageId:ctx.language.id,code:"FIRST_HATCH_EN",isActive:true}});
    if(!template)throw new NotFoundException("first_hatch_not_published");templateId=template.id;
    versionIds=(await tx.trainingTemplateQuestion.findMany({where:{trainingTemplateId:template.id}})).map(q=>q.questionVersionId);
   }else{
    if(!theme||!input.difficulty)throw new ConflictException("theme_not_released");
    const enabled=await tx.themeDifficulty.findMany({where:{themeVersionId:theme.version.id,isEnabled:true},orderBy:{order:"asc"}});
    const index=enabled.findIndex(e=>e.difficulty===input.difficulty);if(index<0)throw new ConflictException("difficulty_locked");
    const progress=await tx.studentThemeProgress.upsert({where:{studentProfileId_blooId_themeId:{studentProfileId:ctx.student.id,blooId:bloo.id,themeId:theme.id}},update:{},create:{schoolId:user.schoolId,studentProfileId:ctx.student.id,blooId:bloo.id,themeId:theme.id,currentDifficulty:enabled[0].difficulty}});
    for(const prior of enabled.slice(0,index)){if(!await tx.studentThemeDifficultyProgress.findFirst({where:{studentThemeProgressId:progress.id,difficulty:prior.difficulty,sessionsCompleted:{gt:0}}}))throw new ConflictException("difficulty_locked");}
    await tx.studentThemeProgress.update({where:{id:progress.id},data:{status:progress.status==="Completed"?"Completed":"InProgress",startedAt:progress.startedAt??new Date()}});
    versionIds=(await tx.themeQuestion.findMany({where:{themeVersionId:theme.version.id}})).map(q=>q.questionVersionId);
   }
   const versions=await tx.questionVersion.findMany({where:{id:{in:versionIds},...(!first?{difficulty:input.difficulty}:{})}});
   const pastSessions=await tx.trainingSession.findMany({where:{studentProfileId:ctx.student.id}});
   const past=await tx.trainingQuestion.findMany({where:{trainingSessionId:{in:pastSessions.map(s=>s.id)}}});
   const answers=await tx.trainingAnswer.findMany({where:{trainingQuestionId:{in:past.map(p=>p.id)}}});
   const rank=(id:string)=>{const seen=past.filter(p=>p.questionVersionId===id);if(!seen.length)return 0;return answers.some(a=>!a.isCorrect&&seen.some(p=>p.id===a.trainingQuestionId))?1:2+seen.length;};
   const pool=versions.map(v=>({v,rank:rank(v.id),tie:randomInt(1000000)})).sort((a,b)=>a.rank-b.rank||a.tie-b.tie).map(x=>x.v);
   const selected=first?[...pool.filter(v=>v.difficulty==="Easy").slice(0,4),...pool.filter(v=>v.difficulty==="Medium").slice(0,2)]:pool.slice(0,5);
   if(selected.length!==(first?6:5))throw new ConflictException("insufficient_questions");
   const session=await tx.trainingSession.create({data:{schoolId:user.schoolId,studentProfileId:ctx.student.id,blooId:bloo.id,languageId:ctx.language.id,type:input.type,trainingTemplateId:templateId,themeId:first?null:theme!.id,themeVersionId:first?null:theme!.version.id,difficulty:first?null:input.difficulty,activeSessionKey:key,totalQuestions:selected.length}});
   await tx.trainingQuestion.createMany({data:selected.map((v,order)=>({trainingSessionId:session.id,questionId:v.questionId,questionVersionId:v.id,order}))});
   if(!first)await this.unlock(tx,ctx,["FIRST_THEME"]);
   return this.snapshot(tx,session.id);
  });
 }
 private async snapshot(tx:Tx,id:string){
  const session=await tx.trainingSession.findUniqueOrThrow({where:{id}});
  const rows=await tx.trainingQuestion.findMany({where:{trainingSessionId:id},orderBy:{order:"asc"}});
  const versions=await tx.questionVersion.findMany({where:{id:{in:rows.map(r=>r.questionVersionId)}}});
  const options=await tx.questionOption.findMany({where:{questionVersionId:{in:versions.map(v=>v.id)}},orderBy:{order:"asc"}});
  const answers=await tx.trainingAnswer.findMany({where:{trainingSessionId:id}});
  const theme=session.themeVersionId?await tx.themeVersion.findUnique({where:{id:session.themeVersionId}}):null;
  return {id,type:session.type,title:theme?.title??"Nascimento",difficulty:session.difficulty,questions:rows.map(row=>{const v=versions.find(v=>v.id===row.questionVersionId)!;const a=answers.find(a=>a.trainingQuestionId===row.id);return {id:row.id,prompt:v.prompt,options:options.filter(o=>o.questionVersionId===v.id).map(o=>({id:o.id,text:o.text})),feedback:a?{selectedOptionId:a.selectedOptionId,isCorrect:a.isCorrect,correctOptionId:options.find(o=>o.questionVersionId===v.id&&o.isCorrect)!.id,explanation:v.explanation}:null};})};
 }
 async resume(user:AuthUser,id:string){const ctx=await this.context(user);const session=await this.db.trainingSession.findFirst({where:{id,studentProfileId:ctx.student.id,status:"InProgress"}});if(!session)throw new NotFoundException();return this.db.$transaction(tx=>this.snapshot(tx,id));}
 async answer(user:AuthUser,id:string,input:AnswerDto){
  const ctx=await this.context(user);
  return this.locked(ctx.student.id,async tx=>{
   const session=await tx.trainingSession.findFirst({where:{id,studentProfileId:ctx.student.id}});if(!session)throw new NotFoundException();
   const question=await tx.trainingQuestion.findFirst({where:{id:input.questionId,trainingSessionId:id}});if(!question)throw new NotFoundException();
   const existing=await tx.trainingAnswer.findUnique({where:{trainingQuestionId:question.id}});
   if(!existing){
    if(session.status!=="InProgress")throw new ConflictException("session_completed");
    const option=await tx.questionOption.findFirst({where:{id:input.selectedOptionId,questionVersionId:question.questionVersionId}});if(!option)throw new UnprocessableEntityException("invalid_option");
    await tx.trainingAnswer.create({data:{trainingSessionId:id,trainingQuestionId:question.id,selectedOptionId:option.id,isCorrect:option.isCorrect}});
    await tx.trainingQuestion.update({where:{id:question.id},data:{answeredAt:new Date()}});
    await tx.trainingSession.update({where:{id},data:{lastActivityAt:new Date()}});
   }
   const snapshot=await this.snapshot(tx,id);return snapshot.questions.find(q=>q.id===question.id)!.feedback;
  });
 }
 async complete(user:AuthUser,id:string){
  const ctx=await this.context(user);
  return this.locked(ctx.student.id,async tx=>{
   const s=await tx.trainingSession.findFirst({where:{id,studentProfileId:ctx.student.id}});if(!s)throw new NotFoundException();
   if(s.status==="Completed")return {xp:s.totalXP,correct:s.correctAnswers,total:s.totalQuestions,hatched:s.type==="FirstHatch",newlyUnlocked:[]};
   const answers=await tx.trainingAnswer.findMany({where:{trainingSessionId:id}});
   if(answers.length!==s.totalQuestions)throw new ConflictException("answer_all_questions");
   const correct=answers.filter(a=>a.isCorrect).length;let xp=0;const codes:string[]=[];let completedTheme:{id:string;versionId:string}|undefined;
   if(s.type==="FirstHatch"){
    const bloo=await tx.bloo.findUniqueOrThrow({where:{id:s.blooId}});xp=bloo.stage==="Egg"?60+correct*5:0;
    await tx.bloo.update({where:{id:s.blooId},data:{stage:"Hatchling",hatchedAt:bloo.hatchedAt??new Date()}});codes.push("NEW_HATCHLING","FIRST_LESSON");
   }else{
    const theme=await tx.theme.findUniqueOrThrow({where:{id:s.themeId!}});
    const enabled=await tx.themeDifficulty.findMany({where:{themeVersionId:s.themeVersionId!,isEnabled:true},orderBy:{order:"asc"}});
    const p=await tx.studentThemeProgress.findUniqueOrThrow({where:{studentProfileId_blooId_themeId:{studentProfileId:ctx.student.id,blooId:s.blooId,themeId:theme.id}}});
    const old=await tx.studentThemeDifficultyProgress.findUnique({where:{studentThemeProgressId_difficulty:{studentThemeProgressId:p.id,difficulty:s.difficulty!}}});
    xp=old?.sessionsCompleted?0:25+correct*5;
    const values={status:"Completed" as const,sessionsCompleted:(old?.sessionsCompleted??0)+1,bestCorrectAnswers:Math.max(old?.bestCorrectAnswers??0,correct),bestAccuracy:Math.max(Number(old?.bestAccuracy??0),correct/s.totalQuestions),firstCompletedAt:old?.firstCompletedAt??new Date(),lastCompletedAt:new Date(),lastThemeVersionId:s.themeVersionId};
    await tx.studentThemeDifficultyProgress.upsert({where:{studentThemeProgressId_difficulty:{studentThemeProgressId:p.id,difficulty:s.difficulty!}},update:values,create:{studentThemeProgressId:p.id,difficulty:s.difficulty!,...values}});
    const done=await tx.studentThemeDifficultyProgress.findMany({where:{studentThemeProgressId:p.id,sessionsCompleted:{gt:0}}});
    const next=enabled.find(e=>!done.some(d=>d.difficulty===e.difficulty));
    if(next)await tx.studentThemeDifficultyProgress.upsert({where:{studentThemeProgressId_difficulty:{studentThemeProgressId:p.id,difficulty:next.difficulty}},update:{status:"Available"},create:{studentThemeProgressId:p.id,difficulty:next.difficulty,status:"Available"}});
    await tx.studentThemeProgress.update({where:{id:p.id},data:{status:next?"InProgress":"Completed",currentDifficulty:next?.difficulty??s.difficulty!,completedAt:next?null:(p.completedAt??new Date())}});
    if(s.difficulty===enabled[0]?.difficulty)codes.push("THEME_EXPLORER");
    completedTheme={id:theme.id,versionId:s.themeVersionId!};
   }
   await tx.trainingSession.update({where:{id},data:{status:"Completed",activeSessionKey:null,completedAt:new Date(),lastActivityAt:new Date(),correctAnswers:correct,totalXP:xp,baseXP:xp?(s.type==="FirstHatch"?60:25):0,bonusXP:xp?correct*5:0}});
   if(xp){await tx.bloo.update({where:{id:s.blooId},data:{xp:{increment:xp}}});await tx.progressEvent.create({data:{schoolId:user.schoolId,studentProfileId:ctx.student.id,blooId:s.blooId,type:"TRAINING_COMPLETED",xp,sourceId:id,sourceType:"TrainingSession",idempotencyKey:`training:${id}`}});}
   const mastery=await this.mastery(tx,ctx);
   if(mastery.some(m=>m.attempts>=5&&m.distinctSessions>=2))codes.push("BLOO_IS_LEARNING");
   if(mastery.some(m=>m.status==="Mastered"))codes.push("SKILL_LEARNED");
   if(completedTheme)codes.push(...await this.themeAchievementCodes(tx,ctx,completedTheme.id,completedTheme.versionId,mastery));
   const newlyUnlocked=await this.unlock(tx,ctx,codes);
   return {xp,correct,total:s.totalQuestions,hatched:s.type==="FirstHatch",newlyUnlocked};
  });
 }
 private async mastery(tx:Tx,ctx:Awaited<ReturnType<JourneyService["context"]>>){
  const sessions=await tx.trainingSession.findMany({where:{studentProfileId:ctx.student.id,status:"Completed",languageId:ctx.language.id}});
  const questions=await tx.trainingQuestion.findMany({where:{trainingSessionId:{in:sessions.map(s=>s.id)}}});
  const versions=await tx.questionVersion.findMany({where:{id:{in:questions.map(q=>q.questionVersionId)}}});
  const answers=await tx.trainingAnswer.findMany({where:{trainingSessionId:{in:sessions.map(s=>s.id)}}});
  const result=[];
  for(const skillId of new Set(versions.map(v=>v.skillId))){
   const relevant=questions.filter(q=>versions.find(v=>v.id===q.questionVersionId)?.skillId===skillId);
   const rows=answers.filter(a=>relevant.some(q=>q.id===a.trainingQuestionId));const attempts=rows.length,correctAnswers=rows.filter(a=>a.isCorrect).length,distinctSessions=new Set(rows.map(a=>a.trainingSessionId)).size;
   const score=attempts?correctAnswers/attempts:0,status=attempts>=5&&distinctSessions>=2&&score>=.8?"Mastered" as const:"Practicing" as const;
   const values={attempts,correctAnswers,distinctSessions,masteryScore:score,status,lastPracticedAt:new Date()};
   await tx.skillMastery.upsert({where:{studentProfileId_skillId:{studentProfileId:ctx.student.id,skillId}},update:values,create:{schoolId:ctx.student.schoolId,studentProfileId:ctx.student.id,languageId:ctx.language.id,skillId,...values}});result.push({skillId,...values});
  }return result;
 }
 private async themeAchievementCodes(tx:Tx,ctx:Awaited<ReturnType<JourneyService["context"]>>,themeId:string,themeVersionId:string,mastery:Awaited<ReturnType<JourneyService["mastery"]>>){
  const theme=await tx.theme.findUniqueOrThrow({where:{id:themeId}});
  const progress=await tx.studentThemeProgress.findUniqueOrThrow({where:{studentProfileId_blooId_themeId:{studentProfileId:ctx.student.id,blooId:ctx.bloo.id,themeId}}});
  const completed=await tx.studentThemeDifficultyProgress.findMany({where:{studentThemeProgressId:progress.id,sessionsCompleted:{gt:0}}});
  const completedDifficulties=new Set(completed.map(item=>item.difficulty));
  const themeSkills=await tx.themeSkill.findMany({where:{themeVersionId}});
  const skills=await tx.skill.findMany({where:{id:{in:themeSkills.map(item=>item.skillId)}}});
  const skillByCode=new Map(skills.map(skill=>[skill.code,skill.id]));
  const achievements=await tx.achievement.findMany({where:{languageId:ctx.language.id,isActive:true}});
  const codes:string[]=[];
  for(const achievement of achievements){
   const rule=achievement.requirementJson as unknown as Record<string,unknown>;
   if(rule.themeCode!==theme.code)continue;
   const required=Array.isArray(rule.requiredDifficulties)?rule.requiredDifficulties.filter((item):item is string=>typeof item==="string"):[];
   const hasRequired=required.every(difficulty=>completedDifficulties.has(difficulty as Difficulty));
   if(achievement.requirementType==="ThemeDifficultyCompleted"&&required.length&&hasRequired)codes.push(achievement.code);
   if(achievement.requirementType==="ThemeMastered"&&required.length&&hasRequired){
    const threshold=typeof rule.minimumAdvancedAccuracy==="number"?rule.minimumAdvancedAccuracy:0;
    const advancedOk=!threshold||completed.some(item=>(item.difficulty==="Hard"||item.difficulty==="VeryHard")&&Number(item.bestAccuracy)>=threshold);
    if(progress.status==="Completed"&&advancedOk)codes.push(achievement.code);
   }
   if(achievement.requirementType==="ThemeSkillsMastered"&&Array.isArray(rule.skillCodes)){
    const requiredSkillIds=rule.skillCodes.filter((item):item is string=>typeof item==="string").map(code=>skillByCode.get(code));
    if(requiredSkillIds.length&&requiredSkillIds.every(skillId=>skillId&&mastery.some(item=>item.skillId===skillId&&item.status==="Mastered")))codes.push(achievement.code);
   }
   if(achievement.requirementType==="CategoryMastered"&&typeof rule.skillCode==="string"){
    const skillId=skillByCode.get(rule.skillCode);const threshold=typeof rule.minimumAccuracy==="number"?rule.minimumAccuracy:0;
    if(progress.status==="Completed"&&skillId&&mastery.some(item=>item.skillId===skillId&&item.status==="Mastered"&&Number(item.masteryScore)>=threshold))codes.push(achievement.code);
   }
  }
  return codes;
 }
 private async unlock(tx:Tx,ctx:Awaited<ReturnType<JourneyService["context"]>>,codes:string[]){
  const achievements=await tx.achievement.findMany({where:{languageId:ctx.language.id,code:{in:codes},isActive:true}});const unlocked=[];
  for(const a of achievements){const where={studentProfileId:ctx.student.id,blooId:ctx.bloo.id,achievementId:a.id};if(!await tx.studentAchievement.findUnique({where:{studentProfileId_blooId_achievementId:where}})){await tx.studentAchievement.create({data:where});unlocked.push(a.code);}}return unlocked;
 }
 async name(user:AuthUser,name:string){const ctx=await this.context(user);await this.db.bloo.update({where:{id:ctx.bloo.id},data:{name:name.trim(),hasCustomName:name.trim()!=="Bloo"}});return {saved:true};}
}
