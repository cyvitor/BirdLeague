import { Body, Controller, Get, Param, Post, Put, Req, UseGuards } from "@nestjs/common";
import { AdminGuard, AuthGuard, AuthRequest } from "./auth.guard";
import { OperationsService } from "./operations.service";
import { ClassDto, EnrollmentDto, QuestionDto, ReleaseDto, ResetPasswordDto, StatusDto, ThemeDto, UserEditDto } from "./operations.dto";
@Controller("admin") @UseGuards(AuthGuard,AdminGuard)
export class OperationsController {
 constructor(private readonly ops:OperationsService){}
 @Get("workspace") workspace(@Req() r:AuthRequest){return this.ops.workspace(r.user!);}
 @Post("classes") createClass(@Req() r:AuthRequest,@Body() d:ClassDto){return this.ops.saveClass(r.user!,d);}
 @Put("classes/:id") editClass(@Req() r:AuthRequest,@Param("id") id:string,@Body() d:ClassDto){return this.ops.saveClass(r.user!,d,id);}
 @Put("users/:id") editUser(@Req() r:AuthRequest,@Param("id") id:string,@Body() d:UserEditDto){return this.ops.editUser(r.user!,id,d);}
 @Post("users/:id/password") password(@Req() r:AuthRequest,@Param("id") id:string,@Body() d:ResetPasswordDto){return this.ops.resetPassword(r.user!,id,d.password);}
 @Post("enrollments") enroll(@Req() r:AuthRequest,@Body() d:EnrollmentDto){return this.ops.enroll(r.user!,d);}
 @Get("questions") questions(@Req() r:AuthRequest){return this.ops.questions(r.user!);}
 @Post("questions") createQuestion(@Req() r:AuthRequest,@Body() d:QuestionDto){return this.ops.saveQuestion(r.user!,d);}
 @Put("questions/:id") editQuestion(@Req() r:AuthRequest,@Param("id") id:string,@Body() d:QuestionDto){return this.ops.saveQuestion(r.user!,d,id);}
 @Post("questions/:id/status") questionStatus(@Req() r:AuthRequest,@Param("id") id:string,@Body() d:StatusDto){return this.ops.status(r.user!,"questions",id,d.active);}
 @Post("themes") createTheme(@Req() r:AuthRequest,@Body() d:ThemeDto){return this.ops.saveTheme(r.user!,d);}
 @Put("themes/:id") editTheme(@Req() r:AuthRequest,@Param("id") id:string,@Body() d:ThemeDto){return this.ops.saveTheme(r.user!,d,id);}
 @Post("themes/:id/releases") release(@Req() r:AuthRequest,@Param("id") id:string,@Body() d:ReleaseDto){return this.ops.release(r.user!,id,d);}
 @Post("themes/:id/status") themeStatus(@Req() r:AuthRequest,@Param("id") id:string,@Body() d:StatusDto){return this.ops.status(r.user!,"themes",id,d.active);}
}
