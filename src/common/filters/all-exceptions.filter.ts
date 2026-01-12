import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from "@nestjs/common";

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

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    let status =
      exception.status ||
      exception.statusCode ||
      HttpStatus.INTERNAL_SERVER_ERROR;
    let errorResponse: any = {
      success: false,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse: any = exception.getResponse();

      if (typeof exceptionResponse === "string") {
        errorResponse.error = exceptionResponse;
      } else {
        // If it's already an object (like our ForbiddenException payload)
        // merge it into errorResponse or replace it
        errorResponse = {
          ...errorResponse,
          ...exceptionResponse,
        };
      }
    } else if (exception instanceof Error) {
      errorResponse.error = exception.message;
      if (process.env.NODE_ENV !== "production") {
        errorResponse.stack = exception.stack;
      }
      this.logger.error(exception.stack);
    } else {
      errorResponse.error = String(exception);
      this.logger.error(exception);
    }

    // Special case for Laravel standard "Unauthenticated" instead of Nest "Unauthorized"
    if (
      status === HttpStatus.UNAUTHORIZED &&
      errorResponse.error === "Unauthorized"
    ) {
      errorResponse.error = "Unauthenticated";
      errorResponse.message = "You are not authenticated.";
    }

    // Ensure status is always correct in the response root if success is present
    errorResponse.status = status;

    // Log the error
    const isNoisy404 =
      status === HttpStatus.NOT_FOUND &&
      (request.url.includes("favicon.ico") ||
        request.url.includes("robots.txt"));

    if (!isNoisy404) {
      this.logger.error(
        `[${request.method}] ${request.url} - ${status} - ${errorResponse.error || errorResponse.message || "Unknown Error"}`
      );
    }

    response.status(status).json(errorResponse);
  }
}
