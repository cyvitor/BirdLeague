import { Body, Controller, Get, Param, Post, Put, Req, UseGuards } from "@nestjs/common";
import { AuthGuard, AuthRequest, StudentGuard } from "../auth/auth.guard";
import { AnswerDto, NameDto, StartTrainingDto } from "./journey.dto";
import { JourneyService } from "./journey.service";
@Controller("student") @UseGuards(AuthGuard,StudentGuard)
export class JourneyController {
 constructor(private readonly journey:JourneyService){}
 @Get("journey") home(@Req() r:AuthRequest){return this.journey.home(r.user!);}
 @Post("training") start(@Req() r:AuthRequest,@Body() d:StartTrainingDto){return this.journey.start(r.user!,d);}
 @Get("training/:id") resume(@Req() r:AuthRequest,@Param("id") id:string){return this.journey.resume(r.user!,id);}
 @Post("training/:id/answers") answer(@Req() r:AuthRequest,@Param("id") id:string,@Body() d:AnswerDto){return this.journey.answer(r.user!,id,d);}
 @Post("training/:id/complete") complete(@Req() r:AuthRequest,@Param("id") id:string){return this.journey.complete(r.user!,id);}
 @Put("bloo/name") name(@Req() r:AuthRequest,@Body() d:NameDto){return this.journey.name(r.user!,d.name);}
}
