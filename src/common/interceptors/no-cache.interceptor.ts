import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable()
export class NoCacheInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const response = context.switchToHttp().getResponse();

    // Set headers to disable caching
    response.setHeader(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, max-age=0"
    );
    response.setHeader("Pragma", "no-cache");
    response.setHeader("Expires", "0");

    return next.handle().pipe(
      map((data) => {
        return data;
      })
    );
  }
}
