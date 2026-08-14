import { ApiProperty } from "@nestjs/swagger";
import { IsIn, IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from "class-validator";

export class LoginDto { @ApiProperty() @IsString() @IsNotEmpty() login: string; @ApiProperty() @IsString() @IsNotEmpty() password: string; }
export class AnswerDto { @ApiProperty() @IsString() questionId: string; @ApiProperty() @IsInt() @Min(0) @Max(3) selectedOption: number; }
export class NameBlooDto { @ApiProperty({ required: false }) @IsOptional() @IsString() name?: string; }
export class ThemeSessionDto { @ApiProperty({ enum: ["Easy","Medium","Hard","VeryHard"] }) @IsIn(["Easy","Medium","Hard","VeryHard"]) difficulty: "Easy"|"Medium"|"Hard"|"VeryHard"; }
