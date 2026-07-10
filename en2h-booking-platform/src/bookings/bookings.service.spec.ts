import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookingsService } from './bookings.service';
import { Booking, BookingStatus } from './booking.entity';
import { Service } from '../services/service.entity';
import { NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';

describe('BookingsService', () => {
  let service: BookingsService;
  let bookingsRepository: Repository<Booking>;
  let servicesRepository: Repository<Service>;

  const mockServiceEntity: Service = {
    id: 'service-uuid',
    title: 'Therapy Session',
    description: 'Muscle massage',
    duration: 30,
    price: 50.00,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockBookingEntity: Booking = {
    id: 'booking-uuid',
    customerName: 'Alice Smith',
    customerEmail: 'alice@example.com',
    customerPhone: '1112223333',
    serviceId: 'service-uuid',
    service: mockServiceEntity,
    bookingDate: '2026-12-31',
    bookingTime: '10:00',
    status: BookingStatus.PENDING,
    notes: 'Leg focus',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingsService,
        {
          provide: getRepositoryToken(Booking),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Service),
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<BookingsService>(BookingsService);
    bookingsRepository = module.get<Repository<Booking>>(getRepositoryToken(Booking));
    servicesRepository = module.get<Repository<Service>>(getRepositoryToken(Service));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should successfully create a booking', async () => {
      const dto: CreateBookingDto = {
        customerName: 'Alice Smith',
        customerEmail: 'alice@example.com',
        customerPhone: '1112223333',
        serviceId: 'service-uuid',
        bookingDate: '2026-12-31', // future date
        bookingTime: '10:00',
        notes: 'Leg focus',
      };

      jest.spyOn(servicesRepository, 'findOne').mockResolvedValue(mockServiceEntity);
      jest.spyOn(bookingsRepository, 'findOne').mockResolvedValue(null); // No duplicate
      jest.spyOn(bookingsRepository, 'create').mockReturnValue(mockBookingEntity);
      jest.spyOn(bookingsRepository, 'save').mockResolvedValue(mockBookingEntity);
      
      // Spy on findOne to return the populated booking relation
      jest.spyOn(service, 'findOne').mockResolvedValue(mockBookingEntity);

      const result = await service.create(dto);
      expect(result).toEqual(mockBookingEntity);
      expect(servicesRepository.findOne).toHaveBeenCalledWith({ where: { id: dto.serviceId } });
    });

    it('should throw NotFoundException if service does not exist', async () => {
      const dto: CreateBookingDto = {
        customerName: 'Alice Smith',
        customerEmail: 'alice@example.com',
        customerPhone: '1112223333',
        serviceId: 'non-existent-uuid',
        bookingDate: '2026-12-31',
        bookingTime: '10:00',
      };

      jest.spyOn(servicesRepository, 'findOne').mockResolvedValue(null);

      await expect(service.create(dto)).rejects.toThrow(NotFoundException);
    });

    it('should throw ConflictException if duplicate slot booking exists', async () => {
      const dto: CreateBookingDto = {
        customerName: 'Alice Smith',
        customerEmail: 'alice@example.com',
        customerPhone: '1112223333',
        serviceId: 'service-uuid',
        bookingDate: '2026-12-31',
        bookingTime: '10:00',
      };

      jest.spyOn(servicesRepository, 'findOne').mockResolvedValue(mockServiceEntity);
      // Mock existing booking returning duplicate
      jest.spyOn(bookingsRepository, 'findOne').mockResolvedValue(mockBookingEntity);

      await expect(service.create(dto)).rejects.toThrow(ConflictException);
    });

    it('should throw BadRequestException if booking date is in the past', async () => {
      const dto: CreateBookingDto = {
        customerName: 'Alice Smith',
        customerEmail: 'alice@example.com',
        customerPhone: '1112223333',
        serviceId: 'service-uuid',
        bookingDate: '2020-01-01', // past date
        bookingTime: '10:00',
      };

      jest.spyOn(servicesRepository, 'findOne').mockResolvedValue(mockServiceEntity);
      jest.spyOn(bookingsRepository, 'findOne').mockResolvedValue(null);

      await expect(service.create(dto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('updateStatus', () => {
    it('should throw BadRequestException when trying to complete a cancelled booking', async () => {
      const cancelledBooking: Booking = {
        ...mockBookingEntity,
        status: BookingStatus.CANCELLED,
      };

      jest.spyOn(service, 'findOne').mockResolvedValue(cancelledBooking);

      await expect(
        service.updateStatus('booking-uuid', { status: BookingStatus.COMPLETED }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should successfully update status', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockBookingEntity);
      jest.spyOn(bookingsRepository, 'save').mockResolvedValue({
        ...mockBookingEntity,
        status: BookingStatus.CONFIRMED,
      });

      const result = await service.updateStatus('booking-uuid', { status: BookingStatus.CONFIRMED });
      expect(result.status).toEqual(BookingStatus.CONFIRMED);
    });
  });
});
