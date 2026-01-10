import { Module } from '@nestjs/common';
import { ApiResponseService } from './services/api-response.service';
import { AllExceptionsFilter } from './filters/all-exceptions.filter';

/**
 * Common Module
 * Fournit les services et filtres partagés dans toute l'application
 * 
 * Exports:
 * - ApiResponseService: Standardise les réponses API
 * - AllExceptionsFilter: Gère les erreurs globalement
 */
@Module({
  providers: [ApiResponseService, AllExceptionsFilter],
  exports: [ApiResponseService, AllExceptionsFilter],
})
export class CommonModule {}
