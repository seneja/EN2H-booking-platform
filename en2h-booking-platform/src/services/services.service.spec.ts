import { Test, TestingModule } from '@nestjs/testing';
import { ServicesService } from './services.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Service } from './service.entity';
import { NotFoundException } from '@nestjs/common';

describe('ServicesService', () => {
  let servicesService: ServicesService;

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

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServicesService,
        { provide: getRepositoryToken(Service), useValue: mockRepository },
      ],
    }).compile();

    servicesService = module.get<ServicesService>(ServicesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ─── CREATE ──────────────────────────────────────────────

  describe('create', () => {
    it('should create and return a new service', async () => {
      const dto = { title: 'General Checkup', description: 'Full body health checkup', duration: 30, price: 1500 };
      mockRepository.create.mockReturnValue(mockService);
      mockRepository.save.mockResolvedValue(mockService);

      const result = await servicesService.create(dto);

      expect(mockRepository.create).toHaveBeenCalledWith(dto);
      expect(mockRepository.save).toHaveBeenCalledWith(mockService);
      expect(result.title).toBe('General Checkup');
    });
  });

  // ─── FIND ALL ────────────────────────────────────────────

  describe('findAll', () => {
    it('should return an array of services', async () => {
      mockRepository.find.mockResolvedValue([mockService]);

      const result = await servicesService.findAll();

      expect(result).toEqual([mockService]);
      expect(mockRepository.find).toHaveBeenCalled();
    });
  });

  // ─── FIND ONE ────────────────────────────────────────────

  describe('findOne', () => {
    it('should return a service by ID', async () => {
      mockRepository.findOne.mockResolvedValue(mockService);

      const result = await servicesService.findOne('service-uuid-1');

      expect(result).toEqual(mockService);
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 'service-uuid-1' } });
    });

    it('should throw NotFoundException if service does not exist', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(servicesService.findOne('bad-id')).rejects.toThrow(NotFoundException);
    });
  });

  // ─── UPDATE ──────────────────────────────────────────────

  describe('update', () => {
    it('should update and return the service', async () => {
      const updatedService = { ...mockService, title: 'Premium Checkup' };
      mockRepository.findOne.mockResolvedValue({ ...mockService });
      mockRepository.save.mockResolvedValue(updatedService);

      const result = await servicesService.update('service-uuid-1', { title: 'Premium Checkup' });

      expect(result.title).toBe('Premium Checkup');
    });

    it('should throw NotFoundException if service does not exist', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(
        servicesService.update('bad-id', { title: 'Nope' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  // ─── REMOVE ──────────────────────────────────────────────

  describe('remove', () => {
    it('should remove the service and return success message', async () => {
      mockRepository.findOne.mockResolvedValue(mockService);
      mockRepository.remove.mockResolvedValue(mockService);

      const result = await servicesService.remove('service-uuid-1');

      expect(result).toEqual({ message: 'Service deleted successfully' });
      expect(mockRepository.remove).toHaveBeenCalledWith(mockService);
    });

    it('should throw NotFoundException if service does not exist', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(servicesService.remove('bad-id')).rejects.toThrow(NotFoundException);
    });
  });
});
