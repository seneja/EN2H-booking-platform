import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking, BookingStatus } from '../bookings/booking.entity';
import { Service } from '../services/service.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Booking)
    private bookingsRepository: Repository<Booking>,
    @InjectRepository(Service)
    private servicesRepository: Repository<Service>,
  ) {}

  async getStats() {
    const [totalServices, totalBookings, pendingAppointments, completedAppointments] = await Promise.all([
      this.servicesRepository.count(),
      this.bookingsRepository.count(),
      this.bookingsRepository.count({ where: { status: BookingStatus.PENDING } }),
      this.bookingsRepository.count({ where: { status: BookingStatus.COMPLETED } }),
    ]);

    return {
      totalServices,
      totalBookings,
      pendingAppointments,
      completedAppointments,
    };
  }
}
