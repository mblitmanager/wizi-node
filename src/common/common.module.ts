import { Module } from "@nestjs/common";
import { ApiResponseService } from "./services/api-response.service";
import { AllExceptionsFilter } from "./filters/all-exceptions.filter";
import { S3StorageService } from "./services/s3-storage.service";

import { DocsController, DocsLdController } from "./docs.controller";

/**
 * Common Module
 * Fournit les services et filtres partagés dans toute l'application
 *
 * Exports:
 * - ApiResponseService: Standardise les réponses API
 * - AllExceptionsFilter: Gère les erreurs globalement
 * - S3StorageService: Gère le stockage S3/MinIO
 */
@Module({
  providers: [ApiResponseService, AllExceptionsFilter, S3StorageService],
  controllers: [DocsController, DocsLdController],
  exports: [ApiResponseService, AllExceptionsFilter, S3StorageService],
})
export class CommonModule {}
