import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    // Log the exception details: log errors with stack trace for 500+, warnings without stack trace for 4xx (except /favicon.ico)
    if (status >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(
        `HTTP Status: ${status} | Method: ${request.method} | URL: ${request.url}`,
        exception instanceof Error ? exception.stack : JSON.stringify(exception),
      );
    } else if (request.url !== '/favicon.ico') {
      const logMessage =
        typeof message === 'object' && message !== null
          ? (message as any).message || JSON.stringify(message)
          : message;
      this.logger.warn(
        `HTTP Status: ${status} | Method: ${request.method} | URL: ${request.url} | Message: ${logMessage}`,
      );
    }

    // Format error payload uniformly
    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message:
        typeof message === 'object' && message !== null
          ? (message as any).message || (message as any).error || message
          : message,
      error:
        exception instanceof Error ? exception.name : 'InternalServerError',
    };

    response.status(status).json(errorResponse);
  }
}
