import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PrismaService } from "../database/prisma.service";
import { AdminController } from "./admin.controller";
import { AuthController } from "./auth.controller";
import { AdminGuard, AuthGuard } from "./auth.guard";
import { AuthService } from "./auth.service";

@Module({
  imports: [JwtModule.registerAsync({ inject: [ConfigService], useFactory: (config: ConfigService) => ({ secret: config.get<string>("JWT_SECRET") ?? "development-only-change-me-please", signOptions: { expiresIn: "10m", issuer: "birdleague", audience: "birdleague-web" } }) })],
  controllers: [AuthController, AdminController],
  providers: [PrismaService, AuthService, AuthGuard, AdminGuard],
  exports: [PrismaService],
})
export class AuthModule {}
