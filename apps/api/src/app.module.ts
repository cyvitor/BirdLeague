import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { HealthController } from "./health.controller";
import { DemoModule } from "./demo/demo.module";

@Module({ imports: [ConfigModule.forRoot({ isGlobal: true }), DemoModule], controllers: [HealthController] })
export class AppModule {}
