import { Difficulty, QuestionType } from "@prisma/client";
import { Type } from "class-transformer";
import { ArrayMaxSize, ArrayMinSize, ArrayUnique, IsArray, IsBoolean, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, IsUUID, Length, Max, MaxLength, Min, ValidateNested } from "class-validator";

export class ClassDto {
  @IsString() @Length(1,120) name: string;
  @IsUUID() languageId: string;
  @IsString() @MaxLength(40) levelLabel: string;
  @IsString() @Length(1,60) period: string;
  @IsBoolean() isActive: boolean;
}
export class UserEditDto {
  @IsString() @Length(1,120) fullName: string;
  @IsString() @Length(3,80) login: string;
  @IsBoolean() isActive: boolean;
}
export class ResetPasswordDto {
  @IsString() @Length(8,128) password: string;
}
export class EnrollmentDto {
  @IsUUID() userId: string;
  @IsUUID() classId: string;
  @IsBoolean() active: boolean;
}
export class OptionDto {
  @IsString() @Length(1,300) text: string;
  @IsBoolean() isCorrect: boolean;
}
export class QuestionDto {
  @IsUUID() languageId: string;
  @IsUUID() skillId: string;
  @IsEnum(Difficulty) difficulty: Difficulty;
  @IsEnum(QuestionType) type: QuestionType;
  @IsString() @Length(1,600) prompt: string;
  @IsString() @Length(1,600) explanation: string;
  @IsArray() @ArrayMinSize(2) @ArrayMaxSize(8) @ValidateNested({each:true}) @Type(()=>OptionDto) options: OptionDto[];
  @IsBoolean() publish: boolean;
}
export class ThemeDto {
  @IsUUID() languageId: string;
  @IsString() @Length(1,120) title: string;
  @IsString() @Length(1,800) description: string;
  @IsArray() @ArrayMinSize(1) @ArrayMaxSize(4) @ArrayUnique() @IsEnum(Difficulty,{each:true}) difficulties: Difficulty[];
  @IsArray() @ArrayMaxSize(500) @ArrayUnique() @IsUUID(undefined,{each:true}) questionVersionIds: string[];
  @IsBoolean() publish: boolean;
}
export class ReleaseDto {
  @IsUUID() classId: string;
  @IsBoolean() active: boolean;
  @IsOptional() @IsString() @MaxLength(40) releaseAt?: string;
}
export class StatusDto { @IsBoolean() active: boolean; }
