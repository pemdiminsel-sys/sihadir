import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { AuditLogsController } from './audit.controller';
import { AuditService } from './audit.service';

@Module({
  providers: [UsersService, AuditService],
  controllers: [UsersController, AuditLogsController],
  exports: [UsersService],
})
export class UsersModule {}
