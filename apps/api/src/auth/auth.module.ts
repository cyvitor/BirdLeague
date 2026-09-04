import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PrismaService } from "../database/prisma.service";
import { AdminController } from "./admin.controller";
import { AuthController } from "./auth.controller";
import { AdminGuard, AuthGuard, StudentGuard } from "./auth.guard";
import { AuthService } from "./auth.service";
import { OperationsService } from "./operations.service";
import { OperationsController } from "./operations.controller";

@Module({
  imports: [JwtModule.registerAsync({ inject: [ConfigService], useFactory: (config: ConfigService) => ({ secret: config.get<string>("JWT_SECRET") ?? "development-only-change-me-please", signOptions: { expiresIn: "10m", issuer: "birdleague", audience: "birdleague-web" } }) })],
  controllers: [AuthController, AdminController, OperationsController],
  providers: [PrismaService, AuthService, AuthGuard, AdminGuard, StudentGuard, OperationsService],
  exports: [PrismaService, JwtModule, AuthGuard, StudentGuard],
})
export class AuthModule {}
