import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { AuthGuard, AuthRequest } from "./auth.guard";
import { ChangePasswordDto, LoginDto } from "./auth.dto";
import { AuthService } from "./auth.service";

@ApiTags("Authentication")
@Controller("auth")
export class AuthController {
  constructor(private readonly auth: AuthService) {}
  @Post("login") login(@Body() body: LoginDto, @Req() request: AuthRequest) { return this.auth.login(body.login, body.password, request.ip ?? "unknown"); }
  @Get("me") @UseGuards(AuthGuard) @ApiBearerAuth() me(@Req() request: AuthRequest) { return request.user; }
  @Post("change-password") @UseGuards(AuthGuard) @ApiBearerAuth() changePassword(@Req() request: AuthRequest, @Body() body: ChangePasswordDto) { return this.auth.changePassword(request.user!, body.currentPassword, body.newPassword); }
}
