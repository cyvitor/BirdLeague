import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { AdminGuard, AuthGuard, AuthRequest } from "./auth.guard";
import { CreateStudentDto } from "./auth.dto";
import { AuthService } from "./auth.service";

@ApiTags("Administration")
@ApiBearerAuth()
@Controller("admin")
@UseGuards(AuthGuard, AdminGuard)
export class AdminController {
  constructor(private readonly auth: AuthService) {}
  @Get("students") students(@Req() request: AuthRequest) { return this.auth.listStudents(request.user!); }
  @Post("students") createStudent(@Req() request: AuthRequest, @Body() body: CreateStudentDto) { return this.auth.createStudent(request.user!, body.fullName, body.login, body.password); }
}
