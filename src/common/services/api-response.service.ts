import { Injectable } from '@nestjs/common';
import { ApiResponse, PaginatedResponse, ListResponse } from '../interfaces/api-response.interface';

/**
 * Service pour formater les réponses API
 * Assure la parité Node.js = Laravel
 * 
 * Patterns supportés:
 * 1. Simple data: { data: {...} }
 * 2. Success message: { success: true }
 * 3. Error: { success: false, error: 'message' }
 * 4. List: [{ id: 1, ... }]
 * 5. Paginated: { data: [...], pagination: {...} }
 */
@Injectable()
export class ApiResponseService {
  /**
   * Format succès avec données
   * Ex: return this.apiResponse.success(user)
   */
  success<T>(data?: T, message?: string): ApiResponse<T> {
    if (data === undefined) {
      return { success: true };
    }

    // Si c'est un tableau, on retourne directement
    if (Array.isArray(data)) {
      return data as any;
    }

    // Si c'est un objet avec pagination
    if (data && typeof data === 'object' && 'pagination' in data) {
      return data as any;
    }

    // Si c'est un objet simple
    return data as any;
  }

  /**
   * Format erreur
   * Ex: return this.apiResponse.error('Erreur', 400)
   */
  error(message: string | string[], statusCode: number = 400): ApiResponse {
    return {
      success: false,
      error: message,
      status: statusCode
    };
  }

  /**
   * Format liste/tableau
   * Ex: return this.apiResponse.list(formations)
   */
  list<T>(data: T[], message?: string): T[] {
    return data;
  }

  /**
   * Format pagé
   * Ex: return this.apiResponse.paginated(items, total, page, perPage)
   */
  paginated<T>(
    data: T[],
    total: number,
    currentPage: number = 1,
    perPage: number = 15
  ): PaginatedResponse<T> {
    return {
      data,
      pagination: {
        total,
        count: data.length,
        per_page: perPage,
        current_page: currentPage,
        total_pages: Math.ceil(total / perPage)
      }
    };
  }

  /**
   * Transformer une réponse Laravel en format Node.js
   * Utile pour la migration progressive
   */
  transform<T>(laravelResponse: any): T {
    // Si c'est déjà un tableau
    if (Array.isArray(laravelResponse)) {
      return laravelResponse as T;
    }

    // Si c'est un objet avec 'data'
    if (laravelResponse?.data) {
      return laravelResponse.data;
    }

    // Sinon retourner tel quel
    return laravelResponse as T;
  }

  /**
   * Format pour les fichiers/images
   * Ex: return this.apiResponse.file(url)
   */
  file(url: string, filename?: string): ApiResponse {
    return {
      success: true,
      data: { image: url, filename }
    } as any;
  }

  /**
   * Format pour les tokens
   * Ex: return this.apiResponse.token(jwtToken)
   */
  token(token: string): ApiResponse {
    return { token } as any;
  }

  /**
   * Format pour les données utilisateur
   * Ex: return this.apiResponse.user(user)
   */
  user<T extends any>(user: T): T {
    return user;
  }
}
