import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { OpdService } from './opd.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/constants';

@Controller('opd')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OpdController {
  constructor(private readonly opdService: OpdService) {}

  @Post()
  @Roles(Role.SUPER_ADMIN)
  create(@Body() createOpdDto: any) {
    return this.opdService.create(createOpdDto);
  }

  @Get()
  findAll() {
    return this.opdService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.opdService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.SUPER_ADMIN)
  update(@Param('id') id: string, @Body() updateOpdDto: any) {
    return this.opdService.update(id, updateOpdDto);
  }

  @Delete(':id')
  @Roles(Role.SUPER_ADMIN)
  remove(@Param('id') id: string) {
    return this.opdService.remove(id);
  }
}
