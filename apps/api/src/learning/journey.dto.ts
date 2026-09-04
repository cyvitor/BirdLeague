import { Difficulty } from "@prisma/client";
import { IsEnum, IsIn, IsOptional, IsString, IsUUID, Length, Matches } from "class-validator";
export class StartTrainingDto {
 @IsIn(["FirstHatch","ThemeMission"]) type:"FirstHatch"|"ThemeMission";
 @IsOptional() @IsUUID() themeId?:string;
 @IsOptional() @IsEnum(Difficulty) difficulty?:Difficulty;
}
export class AnswerDto { @IsUUID() questionId:string; @IsUUID() selectedOptionId:string; }
export class NameDto { @IsString() @Length(2,20) @Matches(/^(?!\d+$)[\p{L}\d][\p{L}\d '\-]+$/u) name:string; }
