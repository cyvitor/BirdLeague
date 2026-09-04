import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { LearningController } from "./learning.controller";
import { LearningService } from "./learning.service";
import { JourneyController } from "./journey.controller";
import { JourneyService } from "./journey.service";

@Module({ imports: [AuthModule], controllers: [JourneyController], providers: [JourneyService] })
export class LearningModule {}
