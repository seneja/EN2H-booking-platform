import { IsString, IsNumber, IsOptional, IsBoolean, Min } from 'class-validator';

export class CreateServiceDto {
    @IsString()
    title: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsNumber()
    @Min(1)
    duration: number;

    @IsNumber()
    @Min(0)
    price: number;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}