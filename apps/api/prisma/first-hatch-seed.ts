import { Difficulty, PrismaClient, QuestionType } from "@prisma/client";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
export async function seedFirstHatch(db:PrismaClient,schoolId:string,languageId:string,adminId:string){
 const rows=readFileSync(resolve(process.cwd(),"../../docs/BANCO_DE_PERGUNTAS_INICIAL.md"),"utf8").split(/\r?\n/).filter(l=>/^\| BL-EN-\d{3} \|/.test(l)).map(l=>l.split("|").slice(1,-1).map(c=>c.trim()));
 const firstRows=rows.filter(c=>c[1]==="FirstHatch");
 if(rows.length!==100||firstRows.length!==24)throw new Error("Question bank must contain 100 questions and 24 FirstHatch questions");
 const template=await db.trainingTemplate.upsert({where:{schoolId_code:{schoolId,code:"FIRST_HATCH_EN"}},update:{},create:{schoolId,languageId,code:"FIRST_HATCH_EN",type:"FirstHatch",totalQuestions:6}});
 for(const c of rows){
  const category=await db.skillCategory.upsert({where:{languageId_code:{languageId,code:c[3].toUpperCase()}},update:{},create:{languageId,code:c[3].toUpperCase(),name:c[3]}});
  const code=c[4].toUpperCase().replace(/[^A-Z0-9]+/g,"_");
  const skill=await db.skill.upsert({where:{languageId_code:{languageId,code}},update:{},create:{languageId,code,name:c[4],skillCategoryId:category.id}});
  const q=await db.question.upsert({where:{schoolId_code:{schoolId,code:c[0]}},update:{},create:{schoolId,languageId,code:c[0],createdByUserId:adminId}});
  const v=await db.questionVersion.upsert({where:{questionId_versionNumber:{questionId:q.id,versionNumber:1}},update:{},create:{questionId:q.id,versionNumber:1,skillId:skill.id,skillCategoryId:category.id,difficulty:c[5] as Difficulty,type:c[6] as QuestionType,prompt:c[7],explanation:c[13],status:"Published",publishedAt:new Date(),createdByUserId:adminId}});
  for(let order=0;order<4;order++)await db.questionOption.upsert({where:{questionVersionId_order:{questionVersionId:v.id,order}},update:{},create:{questionVersionId:v.id,order,text:c[8+order],isCorrect:order===c[12].charCodeAt(0)-65}});
  if(c[1]==="FirstHatch")await db.trainingTemplateQuestion.upsert({where:{trainingTemplateId_questionVersionId:{trainingTemplateId:template.id,questionVersionId:v.id}},update:{},create:{trainingTemplateId:template.id,questionVersionId:v.id}});
 }
}
