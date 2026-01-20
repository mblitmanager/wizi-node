import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { AllExceptionsFilter } from "./common/filters/all-exceptions.filter";
import { NoCacheInterceptor } from "./common/interceptors/no-cache.interceptor";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Disable ETags to prevent 304 Not Modified responses
  const expressApp = app.getHttpAdapter().getInstance();
  expressApp.set("etag", false);

  app.useGlobalInterceptors(new NoCacheInterceptor());

  app.setGlobalPrefix("api", { exclude: ["/", "/admin", "/administrateur"] });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalFilters(new AllExceptionsFilter());

  const config = new DocumentBuilder()
    .setTitle("Wizi-Learn API")
    .setDescription("L'API pour le clone Node.js de Wizi-Learn")
    .setVersion("1.0")
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/docs", app, document);

  app.enableCors();

  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
// Force restart - Verify Media Module
