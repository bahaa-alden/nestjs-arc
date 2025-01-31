import type { HttpStatus } from '@nestjs/common';
import type { ApiParamOptions, ApiQueryOptions } from '@nestjs/swagger';
import type { ClassConstructor } from 'class-transformer';

import type { RoleType } from '../../constants/role-type';
import type { ENUM_DOC_REQUEST_BODY_TYPE } from '../enums/doc.enum';

export interface IDocOptions {
  summary?: string;
  operation?: string;
  deprecated?: boolean;
  description?: string;
}

export interface IDocOfOptions<T = any> {
  statusCode?: number;
  messagePath: string;
  dto?: ClassConstructor<T>;
}

export interface IDocDefaultOptions<T = any> extends IDocOfOptions<T> {
  httpStatus: HttpStatus;
}

export interface IDocAuthOptions {
  jwtAccessToken?: boolean;
  jwtRefreshToken?: boolean;
  xApiKey?: boolean;
  google?: boolean;
  apple?: boolean;
  public?: boolean;
  roles?: RoleType[];
}

export interface IDocRequestOptions<T = any> {
  params?: ApiParamOptions[];
  queries?: ApiQueryOptions[];
  bodyType?: ENUM_DOC_REQUEST_BODY_TYPE;
  dto?: ClassConstructor<T>;
}

export type IDocRequestFileOptions = Omit<IDocRequestOptions, 'bodyType'>;

export interface IDocGuardOptions {
  policy?: boolean;
  role?: boolean;
}

export interface IDocResponseOptions<T = any> {
  statusCode?: number;
  httpStatus?: HttpStatus;
  dto?: ClassConstructor<T>;
}
