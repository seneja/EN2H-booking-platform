import { IsEnum } from 'class-validator';
import { BookingStatus } from '../booking.entity';

export class UpdateBookingStatusDto {
  @IsEnum(BookingStatus, {
    message: 'status must be one of: pending, confirmed, cancelled, completed',
  })
  status: BookingStatus;
}
