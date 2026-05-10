import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { EventsService } from './events.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/constants';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN_OPD)
  create(@Body() createEventDto: any) {
    return this.eventsService.create(createEventDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  findAll(@Req() req: any) {
    return this.eventsService.findAll(req.user);
  }

  @Get(':id')
  // Publicly accessible for attendance page
  findOne(@Param('id') id: string) {
    return this.eventsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN_OPD)
  update(@Param('id') id: string, @Body() updateEventDto: any) {
    return this.eventsService.update(id, updateEventDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  remove(@Param('id') id: string) {
    return this.eventsService.remove(id);
  }

  @Post(':id/generate-qr')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN_OPD, Role.PANITIA)
  generateQR(@Param('id') id: string) {
    return this.eventsService.generateDynamicQR(id);
  }
}
