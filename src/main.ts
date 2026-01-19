import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { AllExceptionsFilter } from "./common/filters/all-exceptions.filter";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix("api", { exclude: ["/", "/admin", "/administrateur"] });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalFilters(new AllExceptionsFilter());

  // Direct use for simplicity as it requires Repository injection,
  // better to use app.get but for now we'll stick to a manual interceptor instance if possible
  // or better, use NestJS dependency injection by registering it in AppModule

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
