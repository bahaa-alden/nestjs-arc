import path from 'node:path';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { ThrottlerOptions } from '@nestjs/throttler';
import type { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { default as parse } from 'parse-duration';

import { AppEnv } from '../../common/constants/app.enum.ts';
import { UserSubscriber } from '../../entity-subscribers/user-subscriber.ts';
import { SnakeNamingStrategy } from '../../snake-naming.strategy.ts';

@Injectable()
export class ApiConfigService {
  constructor(private configService: ConfigService) {}

  get isDevelopment(): boolean {
    return this.nodeEnv === AppEnv.development;
  }

  get isProduction(): boolean {
    return this.nodeEnv === AppEnv.production;
  }

  get isTest(): boolean {
    return this.nodeEnv === AppEnv.test;
  }

  private getNumber(key: string): number {
    const value = this.get(key);

    try {
      return Number(value);
    } catch {
      throw new Error(`${key} environment variable is not a number`);
    }
  }

  private getDuration(
    key: string,
    format?: Parameters<typeof parse>[1],
  ): number {
    const value = this.getString(key);
    const duration = parse(value, format);

    if (duration === null) {
      throw new Error(`${key} environment variable is not a valid duration`);
    }

    return duration;
  }

  private getBoolean(key: string): boolean {
    const value = this.get(key);

    try {
      return Boolean(JSON.parse(value));
    } catch {
      throw new Error(`${key} env var is not a boolean`);
    }
  }

  private getString(key: string): string {
    const value = this.get(key);

    return value.replaceAll(String.raw`\n`, '\n');
  }

  get nodeEnv(): AppEnv {
    return this.getString('NODE_ENV') as AppEnv;
  }

  get fallbackLanguage(): string {
    return this.getString('FALLBACK_LANGUAGE');
  }

  get throttlerConfigs(): ThrottlerOptions {
    return {
      ttl: this.getDuration('THROTTLER_TTL', 'second'),
      limit: this.getNumber('THROTTLER_LIMIT'),
      // storage: new ThrottlerStorageRedisService(new Redis(this.redis)),
    };
  }

  get postgresConfig(): TypeOrmModuleOptions {
    const entities = [
      path.join(`${import.meta.dirname}/../../modules/**/*.entity{.ts,.js}`),
      path.join(
        `${import.meta.dirname}/../../modules/**/*.view-entity{.ts,.js}`,
      ),
    ];
    const migrations = [
      path.join(`${import.meta.dirname}/../../database/migrations/*{.ts,.js}`),
    ];

    return {
      entities,
      migrations,
      keepConnectionAlive: !this.isTest,
      dropSchema: this.isTest,
      type: 'postgres',
      name: 'default',
      host: this.getString('DB_HOST'),
      port: this.getNumber('DB_PORT'),
      username: this.getString('DB_USERNAME'),
      password: this.getString('DB_PASSWORD'),
      database: this.getString('DB_DATABASE'),
      subscribers: [UserSubscriber],
      migrationsRun: true,
      logging: this.getBoolean('ENABLE_ORM_LOGS'),
      namingStrategy: new SnakeNamingStrategy(),
    };
  }

  get awsS3Config() {
    return {
      bucketRegion: this.getString('AWS_S3_BUCKET_REGION'),
      bucketApiVersion: this.getString('AWS_S3_API_VERSION'),
      bucketName: this.getString('AWS_S3_BUCKET_NAME'),
      accessId: this.getString('AWS_S3_ACCESS_KEY_ID'),
      secretId: this.getString('AWS_S3_SECRET_ACCESS_KEY'),
    };
  }

  get cloudinaryConfig() {
    return {
      cloud_name: this.getString('CLOUDINARY_CLOUD_NAME'),
      api_key: this.getString('CLOUDINARY_API_KEY'),
      api_secret: this.getString('CLOUDINARY_API_SECRET'),
    };
  }

  get documentationEnabled(): boolean {
    return this.getBoolean('ENABLE_DOCUMENTATION');
  }

  get natsEnabled(): boolean {
    return this.getBoolean('NATS_ENABLED');
  }

  get natsConfig() {
    return {
      host: this.getString('NATS_HOST'),
      port: this.getNumber('NATS_PORT'),
    };
  }

  get authConfig() {
    return {
      authSecret: this.getString('JWT_AUTH_SECRET'),
      jwtExpirationTime: this.getString('JWT_AUTH_EXPIRES'),
      refreshSecret: this.getString('JWT_REFRESH_SECRET'),
      refreshExpires: this.getString('JWT_REFRESH_EXPIRES'),
      confirmEmailSecret: this.getString('JWT_CONFIRM_EMAIL_SECRET'),
      confirmEmailExpires: this.getString('JWT_CONFIRM_EMAIL_EXPIRES'),
      forgotSecret: this.getString('JWT_FORGOT_SECRET'),
      forgetExpires: this.getString('JWT_FORGOT_EXPIRES'),
    };
  }

  get mailConfig() {
    return {
      host: this.getString('MAIL_HOST'),
      port: this.getNumber('MAIL_PORT'),
      ignoreTLS: this.getBoolean('MAIL_IGNORE_TLS'),
      secure: this.getBoolean('MAIL_SECURE'),
      requireTLS: this.getBoolean('MAIL_REQUIRE_TLS'),
      auth: {
        user: this.getString('MAIL_USER'),
        pass: this.getString('MAIL_PASSWORD'),
      },
      defaultName: this.getString('MAIL_DEFAULT_NAME'),
      defaultEmail: this.getString('MAIL_DEFAULT_EMAIL'),
      isLive: this.getBoolean('MAIL_LIVE'),
    };
  }

  get redisConfig() {
    return {
      url: this.getString('REDIS_URL'),
    };
  }

  get appConfig() {
    return {
      name: this.getString('APP_NAME'),
      port: this.getString('PORT'),
      frontendDomain: this.getString('FRONTEND_DOMAIN'),
      workingDirectory: process.env.PWD ?? process.cwd(),
      timezone: this.getString('APP_TIMEZONE'),
    };
  }

  get debugConfig() {
    return {
      debugEnable: this.getBoolean('DEBUG_ENABLE'),
      debugLevel: this.getString('DEBUG_LEVEL'),
    };
  }

  private get(key: string): string {
    const value = this.configService.get<string>(key);

    if (value == null) {
      throw new Error(`${key} environment variable does not set`); // probably we should call process.exit() too to avoid locking the service
    }

    return value;
  }
}
