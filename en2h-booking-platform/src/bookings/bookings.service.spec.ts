import { Test, TestingModule } from '@nestjs/testing';
import { BookingsService } from './bookings.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Booking, BookingStatus } from './booking.entity';
import { Service } from '../services/service.entity';
import { NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';

describe('BookingsService', () => {
  let bookingsService: BookingsService;

  const mockService: Service = {
    id: 'service-uuid-1',
    title: 'General Checkup',
    description: 'Full body health checkup',
    duration: 30,
    price: 1500,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockBooking: Booking = {
    id: 'booking-uuid-1',
    customerName: 'John Doe',
    customerEmail: 'john@example.com',
    customerPhone: '0771234567',
    serviceId: 'service-uuid-1',
    service: mockService,
    bookingDate: '2027-12-25',
    bookingTime: '10:00',
    status: BookingStatus.PENDING,
    notes: 'First visit',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockBookingsRepo = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  const mockServicesRepo = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingsService,
        { provide: getRepositoryToken(Booking), useValue: mockBookingsRepo },
        { provide: getRepositoryToken(Service), useValue: mockServicesRepo },
      ],
    }).compile();

    bookingsService = module.get<BookingsService>(BookingsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ─── CREATE BOOKING ──────────────────────────────────────

  describe('create', () => {
    const createDto = {
      customerName: 'John Doe',
      customerEmail: 'john@example.com',
      customerPhone: '0771234567',
      serviceId: 'service-uuid-1',
      bookingDate: '2027-12-25',
      bookingTime: '10:00',
      notes: 'First visit',
    };

    it('should create a booking successfully', async () => {
      mockServicesRepo.findOne.mockResolvedValue(mockService);
      mockBookingsRepo.findOne
        .mockResolvedValueOnce(null) // no duplicate
        .mockResolvedValueOnce(mockBooking); // findOne after save
      mockBookingsRepo.create.mockReturnValue(mockBooking);
      mockBookingsRepo.save.mockResolvedValue(mockBooking);

      const result = await bookingsService.create(createDto);

      expect(result.customerName).toBe('John Doe');
      expect(result.status).toBe(BookingStatus.PENDING);
      expect(mockServicesRepo.findOne).toHaveBeenCalledWith({
        where: { id: 'service-uuid-1' },
      });
    });

    it('should throw NotFoundException if service does not exist', async () => {
      mockServicesRepo.findOne.mockResolvedValue(null);

      await expect(bookingsService.create(createDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ConflictException for duplicate booking (same service, date, time)', async () => {
      mockServicesRepo.findOne.mockResolvedValue(mockService);
      mockBookingsRepo.findOne.mockResolvedValueOnce(mockBooking); // duplicate found

      await expect(bookingsService.create(createDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should throw BadRequestException if booking date is in the past', async () => {
      const pastDto = { ...createDto, bookingDate: '2020-01-01' };
      mockServicesRepo.findOne.mockResolvedValue(mockService);
      mockBookingsRepo.findOne.mockResolvedValueOnce(null); // no duplicate

      await expect(bookingsService.create(pastDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  // ─── FIND ONE ────────────────────────────────────────────

  describe('findOne', () => {
    it('should return a booking by ID', async () => {
      mockBookingsRepo.findOne.mockResolvedValue(mockBooking);

      const result = await bookingsService.findOne('booking-uuid-1');

      expect(result).toEqual(mockBooking);
      expect(mockBookingsRepo.findOne).toHaveBeenCalledWith({
        where: { id: 'booking-uuid-1' },
        relations: { service: true },
      });
    });

    it('should throw NotFoundException if booking does not exist', async () => {
      mockBookingsRepo.findOne.mockResolvedValue(null);

      await expect(bookingsService.findOne('bad-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  // ─── FIND ALL (pagination, search, filter) ───────────────

  describe('findAll', () => {
    it('should return paginated bookings', async () => {
      const mockQb = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([[mockBooking], 1]),
      };
      mockBookingsRepo.createQueryBuilder.mockReturnValue(mockQb);

      const result = await bookingsService.findAll({ page: 1, limit: 10 });

      expect(result.data).toEqual([mockBooking]);
      expect(result.total).toBe(1);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
    });

    it('should apply status filter when provided', async () => {
      const mockQb = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
      };
      mockBookingsRepo.createQueryBuilder.mockReturnValue(mockQb);

      await bookingsService.findAll({ status: BookingStatus.CONFIRMED });

      expect(mockQb.andWhere).toHaveBeenCalledWith(
        'booking.status = :status',
        { status: BookingStatus.CONFIRMED },
      );
    });

    it('should apply search filter when provided', async () => {
      const mockQb = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
      };
      mockBookingsRepo.createQueryBuilder.mockReturnValue(mockQb);

      await bookingsService.findAll({ search: 'John' });

      expect(mockQb.andWhere).toHaveBeenCalledWith(
        '(LOWER(booking.customerName) LIKE :search OR LOWER(booking.customerEmail) LIKE :search OR LOWER(booking.customerPhone) LIKE :search)',
        { search: '%john%' },
      );
    });
  });

  // ─── UPDATE STATUS ───────────────────────────────────────

  describe('updateStatus', () => {
    it('should update booking status successfully', async () => {
      const pendingBooking = { ...mockBooking, status: BookingStatus.PENDING };
      const confirmedBooking = { ...mockBooking, status: BookingStatus.CONFIRMED };
      mockBookingsRepo.findOne.mockResolvedValue(pendingBooking);
      mockBookingsRepo.save.mockResolvedValue(confirmedBooking);

      const result = await bookingsService.updateStatus('booking-uuid-1', {
        status: BookingStatus.CONFIRMED,
      });

      expect(result.status).toBe(BookingStatus.CONFIRMED);
    });

    it('should throw BadRequestException when marking cancelled booking as completed', async () => {
      const cancelledBooking = { ...mockBooking, status: BookingStatus.CANCELLED };
      mockBookingsRepo.findOne.mockResolvedValue(cancelledBooking);

      await expect(
        bookingsService.updateStatus('booking-uuid-1', {
          status: BookingStatus.COMPLETED,
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException if booking does not exist', async () => {
      mockBookingsRepo.findOne.mockResolvedValue(null);

      await expect(
        bookingsService.updateStatus('bad-id', { status: BookingStatus.CONFIRMED }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  // ─── CANCEL ──────────────────────────────────────────────

  describe('cancel', () => {
    it('should cancel a booking', async () => {
      const pendingBooking = { ...mockBooking, status: BookingStatus.PENDING };
      const cancelledBooking = { ...mockBooking, status: BookingStatus.CANCELLED };
      mockBookingsRepo.findOne.mockResolvedValue(pendingBooking);
      mockBookingsRepo.save.mockResolvedValue(cancelledBooking);

      const result = await bookingsService.cancel('booking-uuid-1');

      expect(result.status).toBe(BookingStatus.CANCELLED);
    });
  });
});
