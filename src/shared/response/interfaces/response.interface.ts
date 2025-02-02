import type { HttpStatus } from '@nestjs/common';

export interface IResponseCustomProperty {
  statusCode?: number;
  message?: string;
  httpStatus?: HttpStatus;
}

// metadata
export interface IResponseMetadata {
  customProperty?: IResponseCustomProperty;
  [key: string]: any;
}
// response
export interface IResponse<T = void> {
  _metadata?: IResponseMetadata;
  data?: T;
}
