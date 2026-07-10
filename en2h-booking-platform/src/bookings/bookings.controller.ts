import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingStatusDto } from './dto/update-booking-status.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('bookings')
export class BookingsController {
  constructor(private bookingsService: BookingsService) {}

  @Post() // Public route for booking appointments
  create(@Body() dto: CreateBookingDto) {
    return this.bookingsService.create(dto);
  }

  @Get() // Protected route to get all bookings
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  findAll() {
    return this.bookingsService.findAll();
  }

  @Get(':id') // Protected route to get booking details
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  findOne(@Param('id') id: string) {
    return this.bookingsService.findOne(id);
  }

  @Patch(':id/status') // Protected route to update booking status/cancel
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateBookingStatusDto,
  ) {
    return this.bookingsService.updateStatus(id, dto);
  }
}
