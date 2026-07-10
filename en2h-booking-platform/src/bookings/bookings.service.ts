import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking, BookingStatus } from './booking.entity';
import { Service } from '../services/service.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingStatusDto } from './dto/update-booking-status.dto';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private bookingsRepository: Repository<Booking>,
    @InjectRepository(Service)
    private servicesRepository: Repository<Service>,
  ) {}

  async create(dto: CreateBookingDto): Promise<Booking> {
    // 1. A booking must belong to an existing service
    const serviceExists = await this.servicesRepository.findOne({
      where: { id: dto.serviceId },
    });
    if (!serviceExists) {
      throw new NotFoundException(`Service with ID ${dto.serviceId} does not exist`);
    }

    // 2. Booking dates cannot be in the past (timezone-safe check)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dateParts = dto.bookingDate.split('-').map(Number);
    if (dateParts.length !== 3 || dateParts.some(isNaN)) {
      throw new BadRequestException('Invalid booking date format. Use YYYY-MM-DD');
    }
    const [year, month, day] = dateParts;
    const bookingDateObj = new Date(year, month - 1, day);

    if (bookingDateObj < today) {
      throw new BadRequestException('Booking date cannot be in the past');
    }

    const booking = this.bookingsRepository.create({
      ...dto,
      status: BookingStatus.PENDING,
    });
    
    const saved = await this.bookingsRepository.save(booking);
    // Load the service relation to return the full entity
    return this.findOne(saved.id);
  }

  async findAll(): Promise<Booking[]> {
    return this.bookingsRepository.find({
      relations: { service: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Booking> {
    const booking = await this.bookingsRepository.findOne({
      where: { id },
      relations: { service: true },
    });
    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }
    return booking;
  }

  async updateStatus(id: string, dto: UpdateBookingStatusDto): Promise<Booking> {
    const booking = await this.findOne(id); // throws NotFound if not exists

    // 3. Cancelled bookings cannot be marked as completed
    if (booking.status === BookingStatus.CANCELLED && dto.status === BookingStatus.COMPLETED) {
      throw new BadRequestException('Cancelled bookings cannot be marked as completed');
    }

    booking.status = dto.status;
    return this.bookingsRepository.save(booking);
  }

  async cancel(id: string): Promise<Booking> {
    return this.updateStatus(id, { status: BookingStatus.CANCELLED });
  }
}
