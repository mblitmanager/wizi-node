import { ApiResponse, PaginatedResponse } from '../interfaces/api-response.interface';
export declare class ApiResponseService {
    success<T>(data?: T, message?: string): ApiResponse<T>;
    error(message: string | string[], statusCode?: number): ApiResponse;
    list<T>(data: T[], message?: string): T[];
    paginated<T>(data: T[], total: number, currentPage?: number, perPage?: number): PaginatedResponse<T>;
    transform<T>(laravelResponse: any): T;
    file(url: string, filename?: string): ApiResponse;
    token(token: string): ApiResponse;
    user<T extends any>(user: T): T;
}
