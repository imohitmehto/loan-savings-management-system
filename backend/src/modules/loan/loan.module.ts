import { Module } from "@nestjs/common";
import { PrismaModule } from "src/infrastructure/database/prisma.module";

@Module({
  imports: [PrismaModule],
  providers: [],
  exports: [],
})
export class LoanModule {}
