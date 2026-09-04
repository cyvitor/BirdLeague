import { ApiProperty } from "@nestjs/swagger";
import { Difficulty } from "@prisma/client";
import { Type } from "class-transformer";
import { IsArray, IsEnum, IsUUID, ValidateNested } from "class-validator";

export class StartGreetingsSessionDto {
  @ApiProperty({ enum: Difficulty }) @IsEnum(Difficulty) difficulty: Difficulty;
}

export class TrainingAnswerDto {
  @ApiProperty() @IsUUID() questionId: string;
  @ApiProperty() @IsUUID() selectedOptionId: string;
}

export class CompleteGreetingsSessionDto {
  @ApiProperty({ type: [TrainingAnswerDto] }) @IsArray() @ValidateNested({ each: true }) @Type(() => TrainingAnswerDto) answers: TrainingAnswerDto[];
}
