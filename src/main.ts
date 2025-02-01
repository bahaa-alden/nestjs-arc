import { ClassSerializerInterceptor } from '@nestjs/common';
import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { ExpressAdapter } from '@nestjs/platform-express';
import { useContainer } from 'class-validator';
import compression from 'compression';
import helmet from 'helmet';
import morgan from 'morgan';
import { Logger as PinoLogger } from 'nestjs-pino';
import { initializeTransactionalContext } from 'typeorm-transactional';

import { AppModule } from './app.module.ts';
import { MainValidationPipe } from './common//pipes/main-validation.pipe.ts';
import { HttpExceptionFilter } from './common/filters/bad-request.filter.ts';
import { QueryFailedFilter } from './common/filters/query-failed.filter.ts';
import { TranslationInterceptor } from './common/interceptors/translation-interceptor.service.ts';
import { setupSwagger } from './setup-swagger.ts';
import { ApiConfigService } from './shared/services/api-config.service.ts';
import { TranslationService } from './shared/services/translation.service.ts';
import { SharedModule } from './shared/shared.module.ts';

export async function bootstrap(): Promise<NestExpressApplication> {
  initializeTransactionalContext();
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(),
    { cors: true },
  );

  // logger
  app.useLogger(app.get(PinoLogger));

  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.enable('trust proxy'); // only if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
  app.use(helmet());
  // app.setGlobalPrefix('/api'); use api as global prefix if you don't have subdomain
  app.use(compression());
  app.use(morgan('combined'));
  app.enableVersioning();

  const reflector = app.get(Reflector);

  const httpAdapter = app.get(HttpAdapterHost);

  app.useGlobalFilters(
    new HttpExceptionFilter(httpAdapter),
    new QueryFailedFilter(reflector),
  );

  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(reflector),
    new TranslationInterceptor(
      app.select(SharedModule).get(TranslationService),
    ),
  );

  app.useGlobalPipes(new MainValidationPipe());

  const configService = app.select(SharedModule).get(ApiConfigService);

  // only start nats if it is enabled
  if (configService.natsEnabled) {
    const natsConfig = configService.natsConfig;
    app.connectMicroservice({
      transport: Transport.NATS,
      options: {
        url: `nats://${natsConfig.host}:${natsConfig.port}`,
        queue: 'main_service',
        retryAttempts: 5,
        retryDelay: 3000,
      },
    });

    await app.startAllMicroservices();
  }

  if (configService.documentationEnabled) {
    setupSwagger(app);
  }

  // Starts listening for shutdown hooks
  if (!configService.isDevelopment) {
    app.enableShutdownHooks();
  }

  const port = configService.appConfig.port;
  await app.listen(port);

  console.info(`server running on ${await app.getUrl()}`);
  console.info(
    `Documentation: http://localhost:${process.env.PORT}/documentation`,
  );

  return app;
}

void bootstrap();
