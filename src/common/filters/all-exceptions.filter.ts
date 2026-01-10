import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';

/**
 * Global Exception Filter
 * Standardise toutes les réponses d'erreur au format Laravel compatible
 * 
 * Convertit:
 * - HttpException → { success: false, error: "message", status: 400 }
 * - BadRequestException → { success: false, error: "message", status: 400 }
 * - NotFoundException → { success: false, error: "message", status: 404 }
 * - Etc.
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let error = null;

    // Gérer les HttpExceptions de NestJS
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      // Extraire le message
      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object') {
        message =
          (exceptionResponse as any).message ||
          (exceptionResponse as any).error ||
          'An error occurred';
        error = (exceptionResponse as any).error;
      }
    } else if (exception instanceof Error) {
      // Gérer les erreurs JavaScript standard
      message = exception.message;
      this.logger.error(exception.stack);
    } else {
      // Fallback pour les exceptions inattendues
      message = String(exception);
      this.logger.error(exception);
    }

    // Format de réponse standardisé (compatible Laravel)
    const errorResponse = {
      success: false,
      error: message,
      status,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    // Log l'erreur
    this.logger.error(
      `[${request.method}] ${request.url} - ${status} - ${message}`
    );

    // Retourner la réponse
    response.status(status).json(errorResponse);
  }
}
