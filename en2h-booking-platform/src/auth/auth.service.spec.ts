import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

// Mock bcrypt module
jest.mock('bcrypt');

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: Partial<Record<keyof UsersService, jest.Mock>>;
  let jwtService: Partial<Record<keyof JwtService, jest.Mock>>;

  const mockUser = {
    id: 'user-uuid-1',
    email: 'test@example.com',
    password: 'hashed-password',
    name: 'Test User',
    createdAt: new Date(),
  };

  beforeEach(async () => {
    usersService = {
      findByEmail: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
    };

    jwtService = {
      sign: jest.fn(),
      verify: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ─── REGISTER ────────────────────────────────────────────

  describe('register', () => {
    it('should register a new user successfully', async () => {
      usersService.findByEmail!.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-password');
      usersService.create!.mockResolvedValue(mockUser);

      const result = await authService.register({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      });

      expect(result.message).toBe('Account created successfully');
      expect(result.user).not.toHaveProperty('password');
      expect(result.user.email).toBe('test@example.com');
      expect(usersService.findByEmail).toHaveBeenCalledWith('test@example.com');
      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
    });

    it('should throw ConflictException if email already exists', async () => {
      usersService.findByEmail!.mockResolvedValue(mockUser);

      await expect(
        authService.register({
          email: 'test@example.com',
          password: 'password123',
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  // ─── LOGIN ───────────────────────────────────────────────

  describe('login', () => {
    it('should return tokens and user info on valid credentials', async () => {
      usersService.findByEmail!.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      jwtService.sign!
        .mockReturnValueOnce('access-token')
        .mockReturnValueOnce('refresh-token');

      const result = await authService.login({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(result.access_token).toBe('access-token');
      expect(result.refresh_token).toBe('refresh-token');
      expect(result.user.email).toBe('test@example.com');
      expect(usersService.findByEmail).toHaveBeenCalledWith('test@example.com', true);
    });

    it('should throw UnauthorizedException if user not found', async () => {
      usersService.findByEmail!.mockResolvedValue(null);

      await expect(
        authService.login({ email: 'no@user.com', password: 'pass' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password is wrong', async () => {
      usersService.findByEmail!.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        authService.login({ email: 'test@example.com', password: 'wrong' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  // ─── REFRESH ─────────────────────────────────────────────

  describe('refresh', () => {
    it('should return new tokens on valid refresh token', async () => {
      jwtService.verify!.mockReturnValue({ sub: 'user-uuid-1', email: 'test@example.com' });
      usersService.findById!.mockResolvedValue(mockUser);
      jwtService.sign!
        .mockReturnValueOnce('new-access-token')
        .mockReturnValueOnce('new-refresh-token');

      const result = await authService.refresh('valid-refresh-token');

      expect(result.access_token).toBe('new-access-token');
      expect(result.refresh_token).toBe('new-refresh-token');
    });

    it('should throw UnauthorizedException if refresh token is invalid', async () => {
      jwtService.verify!.mockImplementation(() => {
        throw new Error('invalid');
      });

      await expect(authService.refresh('bad-token')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException if user no longer exists', async () => {
      jwtService.verify!.mockReturnValue({ sub: 'deleted-user', email: 'gone@user.com' });
      usersService.findById!.mockResolvedValue(null);

      await expect(authService.refresh('orphan-token')).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
