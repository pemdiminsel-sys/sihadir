import { IsNotEmpty, IsNumber, IsString, IsOptional, IsUUID } from 'class-validator';

export class SubmitAttendanceDto {
  @IsUUID()
  eventId: string;

  @IsUUID()
  participantId: string;

  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;

  @IsString()
  @IsOptional()
  selfieUrl?: string;

  @IsString()
  @IsOptional()
  deviceInfo?: string;

  @IsString()
  qrToken: string;
}
