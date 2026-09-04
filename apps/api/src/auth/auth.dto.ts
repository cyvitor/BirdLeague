import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsUUID, IsString, Length, MaxLength, MinLength } from "class-validator";

export class LoginDto {
  @ApiProperty() @IsString() @IsNotEmpty() @MaxLength(80) login: string;
  @ApiProperty() @IsString() @IsNotEmpty() @MaxLength(128) password: string;
}

export class ChangePasswordDto {
  @ApiProperty() @IsString() @IsNotEmpty() @MaxLength(128) currentPassword: string;
  @ApiProperty() @IsString() @MinLength(8) @MaxLength(128) newPassword: string;
}

export class CreateStudentDto {
  @IsOptional() @IsUUID() classId?: string;
  @ApiProperty() @IsString() @IsNotEmpty() @MaxLength(160) fullName: string;
  @ApiProperty() @IsString() @IsNotEmpty() @MaxLength(80) login: string;
  @ApiProperty() @IsString() @MinLength(8) @MaxLength(128) password: string;
}

export class CreateAdminDto {
  @ApiProperty() @IsString() @IsNotEmpty() @MaxLength(160) fullName: string;
  @ApiProperty() @IsString() @IsNotEmpty() @MaxLength(80) login: string;
  @ApiProperty() @IsString() @Length(12, 128) password: string;
}
