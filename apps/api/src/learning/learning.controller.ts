import { Body, Controller, Get, Param, Post, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { AuthGuard, AuthRequest, StudentGuard } from "../auth/auth.guard";
import { CompleteGreetingsSessionDto, StartGreetingsSessionDto } from "./learning.dto";
import { LearningService } from "./learning.service";

@ApiTags("Student learning")
@ApiBearerAuth()
@Controller("student/greetings")
@UseGuards(AuthGuard, StudentGuard)
export class LearningController {
  constructor(private readonly learning: LearningService) {}

  @Get() state(@Req() request: AuthRequest) { return this.learning.getGreetings(request.user!); }
  @Post("sessions") start(@Req() request: AuthRequest, @Body() body: StartGreetingsSessionDto) { return this.learning.startGreetings(request.user!, body.difficulty); }
  @Post("sessions/:id/complete") complete(@Req() request: AuthRequest, @Param("id") id: string, @Body() body: CompleteGreetingsSessionDto) { return this.learning.completeGreetings(request.user!, id, body.answers); }
}
