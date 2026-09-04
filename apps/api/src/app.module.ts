import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { HealthController } from "./health.controller";
import { AuthModule } from "./auth/auth.module";
import { LearningModule } from "./learning/learning.module";

@Module({ imports: [ConfigModule.forRoot({ isGlobal: true }), AuthModule, LearningModule], controllers: [HealthController] })
export class AppModule {}
