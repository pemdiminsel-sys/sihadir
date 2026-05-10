import { IsNotEmpty, IsNumber, IsString, IsOptional, IsUUID } from 'class-validator';

export class SubmitAttendanceDto {
  @IsUUID()
  eventId: string;

  @IsUUID()
  @IsOptional()
  participantId?: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  participantType?: string;

  @IsString()
  @IsOptional()
  identityNumber?: string;

  @IsString()
  @IsOptional()
  position?: string;

  @IsString()
  @IsOptional()
  institution?: string;

  @IsNumber()
  @IsOptional()
  latitude?: number;

  @IsNumber()
  @IsOptional()
  longitude?: number;

  @IsString()
  @IsOptional()
  selfieUrl?: string;

  @IsString()
  @IsOptional()
  signatureUrl?: string;

  @IsString()
  @IsOptional()
  deviceInfo?: string;

  @IsString()
  @IsOptional()
  qrToken?: string;
}
