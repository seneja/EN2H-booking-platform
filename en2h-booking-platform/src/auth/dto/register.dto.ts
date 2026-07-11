import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength, Matches } from 'class-validator';

export class RegisterDto {
    @IsNotEmpty({ message: 'Email is required' })
    @IsEmail({}, { message: 'Must be a valid email address' })
    @MaxLength(255, { message: 'Email cannot exceed 255 characters' })
    email: string;

    @IsNotEmpty({ message: 'Password is required' })
    @IsString()
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    @MaxLength(50, { message: 'Password cannot exceed 50 characters' })
    @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{6,}$/, {
        message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    })
    password: string;

    @IsNotEmpty({ message: 'Name is required' })
    @IsString()
    @MinLength(2, { message: 'Name must be at least 2 characters long' })
    @MaxLength(100, { message: 'Name cannot exceed 100 characters' })
    name: string;
}