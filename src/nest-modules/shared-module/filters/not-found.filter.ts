import { NotFoundError } from '@core/shared/domain/errors/not-found-erros';
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';

@Catch(NotFoundError)
export class NotFoundFilter<T> implements ExceptionFilter {
  catch(exception: NotFoundError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response:Response = ctx.getResponse();
    response.status(404).json({
      statusCode: 404,
      error: 'Not Found',
      message: exception.message
    })
  }
}
