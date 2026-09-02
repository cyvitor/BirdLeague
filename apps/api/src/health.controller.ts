import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { PrismaService } from "./database/prisma.service";

@ApiTags("health")
@Controller("health")
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}
  @Get() async status() {
    const bootstrapPasswordPending = await this.prisma.user.count({ where: { role: "Admin", mustChangePassword: true, isActive: true } }).then(count => count > 0).catch(() => true);
    return { status: "ok", service: "birdleague-api", utc: new Date().toISOString(), bootstrapPasswordPending };
  }
}
