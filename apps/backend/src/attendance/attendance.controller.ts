import { Controller, Post, Body, Get } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { SubmitAttendanceDto } from './dto/attendance.dto';

@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post()
  submit(@Body() dto: SubmitAttendanceDto) {
    return this.attendanceService.submit(dto);
  }

  @Get('test')
  test() {
    return { status: 'Attendance API is working!' };
  }
}
