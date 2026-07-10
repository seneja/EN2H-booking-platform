import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Service } from './service.entity';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service)
    private servicesRepository: Repository<Service>,
  ) {}

  async create(dto: CreateServiceDto): Promise<Service> {
    const service = this.servicesRepository.create(dto);
    return this.servicesRepository.save(service);
  }

  async findAll(): Promise<Service[]> {
    return this.servicesRepository.find();
  }

  async findOne(id: string): Promise<Service> {
    const service = await this.servicesRepository.findOne({ where: { id } });
    if (!service) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }
    return service;
  }

  async update(id: string, dto: UpdateServiceDto): Promise<Service> {
    const service = await this.findOne(id); // throws if not found
    Object.assign(service, dto);
    return this.servicesRepository.save(service);
  }

  async remove(id: string): Promise<{ message: string }> {
    const service = await this.findOne(id); // throws if not found
    await this.servicesRepository.remove(service);
    return { message: 'Service deleted successfully' };
  }
}
