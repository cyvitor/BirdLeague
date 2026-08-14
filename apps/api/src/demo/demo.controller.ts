import { Body, Controller, Get, Headers, Param, Patch, Post } from "@nestjs/common";
import { ApiHeader, ApiTags } from "@nestjs/swagger";
import { AnswerDto, LoginDto, NameBlooDto, ThemeSessionDto } from "./demo.dto";
import { DemoService } from "./demo.service";

@ApiTags("MVP demo")
@Controller()
export class DemoController {
  constructor(private readonly demo: DemoService) {}
  @Post("auth/login") login(@Body() body: LoginDto) { return this.demo.login(body.login); }
  @Get("auth/me") me() { return { id: "student-demo", displayName: "Lia", role: "Student", mustChangePassword: false }; }
  @Get("student/home") home() { return this.demo.home(); }
  @Get("student/bloo") bloo() { return this.demo.home().bloo; }
  @Patch("student/bloo/name") @ApiHeader({ name: "Idempotency-Key", required: true }) name(@Body() body: NameBlooDto, @Headers("idempotency-key") _key: string) { return this.demo.nameBloo(body.name); }
  @Post("student/first-hatch/sessions") @ApiHeader({ name: "Idempotency-Key", required: true }) first() { return this.demo.startFirst(); }
  @Post("student/themes/greetings/sessions") theme(@Body() body: ThemeSessionDto) { return this.demo.startTheme(body.difficulty); }
  @Post("student/training-sessions/:id/answers") answer(@Param("id") id: string, @Body() body: AnswerDto) { return this.demo.answer(id, body.questionId, body.selectedOption); }
  @Post("student/training-sessions/:id/complete") complete(@Param("id") id: string) { return this.demo.complete(id); }
  @Get("student/progress") progress() { return this.demo.progress(); }
  @Get("admin/classes") classes() { return { items: [{ id: "starter-am", name: "Starter — Manhã", levelLabel: "Starter", period: "2026.2", students: 18, isActive: true }], page: 1, pageSize: 20, totalItems: 1, totalPages: 1 }; }
  @Get("admin/students") students() { return { items: [{ id: "student-demo", fullName: "Lia Martins", login: "lia.martins", status: "Greetings: Easy" }], page: 1, pageSize: 20, totalItems: 1, totalPages: 1 }; }
  @Get("admin/themes") themes() { return { items: [{ id: "greetings", code: "GREETINGS", title: "Greetings", version: 1, status: "Active" }], page: 1, pageSize: 20, totalItems: 1, totalPages: 1 }; }
}
