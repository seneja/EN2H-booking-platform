import { IsEmail, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateBookingDto {
  @IsString()
  @IsNotEmpty()
  customerName: string;

  @IsEmail()
  customerEmail: string;

  @IsString()
  @IsNotEmpty()
  customerPhone: string;

  @IsUUID()
  serviceId: string;

  @IsString()
  @IsNotEmpty()
  bookingDate: string; // YYYY-MM-DD

  @IsString()
  @IsNotEmpty()
  bookingTime: string; // HH:MM

  @IsOptional()
  @IsString()
  notes?: string;
}
