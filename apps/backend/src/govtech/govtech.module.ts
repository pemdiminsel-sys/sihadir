import { Module } from '@nestjs/common';
import { GovTechService } from './govtech.service';
import { GovTechController } from './govtech.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [GovTechService],
  controllers: [GovTechController],
  exports: [GovTechService],
})
export class GovTechModule {}
