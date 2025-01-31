/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiExtraModels,
  ApiHeaders,
  ApiOperation,
  ApiParam,
  ApiProduces,
  ApiQuery,
  ApiResponse,
  getSchemaPath,
} from '@nestjs/swagger';

import { ResponseDto } from '../../../shared/response/dtos/response.dto.ts';
import { ENUM_APP_STATUS_CODE_ERROR } from '../../constants/app.status-code.enum.ts';
import { LanguageCode } from '../../constants/language-code.ts';
import { RequestStatusCodeError } from '../../constants/request-status-code.enum.ts';
import { ENUM_DOC_REQUEST_BODY_TYPE } from '../enums/doc.enum.ts';
import type {
  IDocDefaultOptions,
  IDocGuardOptions,
  IDocOfOptions,
  IDocOptions,
  IDocRequestFileOptions,
  IDocRequestOptions,
  IDocResponseOptions,
} from '../interfaces/doc.interface';

export function DocDefault<T>(options: IDocDefaultOptions<T>): MethodDecorator {
  const docs = [];
  const schema: Record<string, any> = {
    allOf: [{ $ref: getSchemaPath(ResponseDto) }],
    properties: {
      message: {
        example: options.messagePath,
      },
      statusCode: {
        type: 'number',
        example: options.statusCode,
      },
    },
  };

  if (options.dto) {
    docs.push(ApiExtraModels(options.dto as any));
    schema.properties = {
      ...schema.properties,
      data: {
        $ref: getSchemaPath(options.dto as any),
      },
    };
  }

  return applyDecorators(
    ApiExtraModels(ResponseDto),
    ApiResponse({
      description: options.httpStatus.toString(),
      status: options.httpStatus,
      schema,
    }),
    ...docs,
  );
}

export function DocOneOf(
  httpStatus: HttpStatus,
  ...documents: IDocOfOptions[]
): MethodDecorator {
  const docs = [];
  const oneOf = [];

  for (const doc of documents) {
    const oneOfSchema: Record<string, any> = {
      allOf: [{ $ref: getSchemaPath(ResponseDto) }],
      properties: {
        message: {
          example: doc.messagePath,
        },
        statusCode: {
          type: 'number',
          example: doc.statusCode ?? HttpStatus.OK,
        },
      },
    };

    if (doc.dto) {
      docs.push(ApiExtraModels(doc.dto));
      oneOfSchema.properties = {
        ...oneOfSchema.properties,
        data: {
          $ref: getSchemaPath(doc.dto),
        },
      };
    }

    oneOf.push(oneOfSchema);
  }

  return applyDecorators(
    ApiExtraModels(ResponseDto),
    ApiResponse({
      description: httpStatus.toString(),
      status: httpStatus,
      schema: {
        oneOf,
      },
    }),
    ...docs,
  );
}

export function DocAnyOf(
  httpStatus: HttpStatus,
  ...documents: IDocOfOptions[]
): MethodDecorator {
  const docs = [];
  const anyOf = [];

  for (const doc of documents) {
    const anyOfSchema: Record<string, any> = {
      allOf: [{ $ref: getSchemaPath(ResponseDto) }],
      properties: {
        message: {
          example: doc.messagePath,
        },
        statusCode: {
          type: 'number',
          example: doc.statusCode ?? HttpStatus.OK,
        },
      },
    };

    if (doc.dto) {
      docs.push(ApiExtraModels(doc.dto));
      anyOfSchema.properties = {
        ...anyOfSchema.properties,
        data: {
          $ref: getSchemaPath(doc.dto),
        },
      };
    }

    anyOf.push(anyOfSchema);
  }

  return applyDecorators(
    ApiExtraModels(ResponseDto),
    ApiResponse({
      description: httpStatus.toString(),
      status: httpStatus,
      schema: {
        anyOf,
      },
    }),
    ...docs,
  );
}

export function DocAllOf(
  httpStatus: HttpStatus,
  ...documents: IDocOfOptions[]
): MethodDecorator {
  const docs = [];
  const allOf = [];

  for (const doc of documents) {
    const allOfSchema: Record<string, any> = {
      allOf: [{ $ref: getSchemaPath(ResponseDto) }],
      properties: {
        message: {
          example: doc.messagePath,
        },
        statusCode: {
          type: 'number',
          example: doc.statusCode ?? HttpStatus.OK,
        },
      },
    };

    if (doc.dto) {
      docs.push(ApiExtraModels(doc.dto));
      allOfSchema.properties = {
        ...allOfSchema.properties,
        data: {
          $ref: getSchemaPath(doc.dto),
        },
      };
    }

    allOf.push(allOfSchema);
  }

  return applyDecorators(
    ApiExtraModels(ResponseDto),
    ApiResponse({
      description: httpStatus.toString(),
      status: httpStatus,
      schema: {
        allOf,
      },
    }),
    ...docs,
  );
}

export function Doc(options?: IDocOptions): MethodDecorator {
  return applyDecorators(
    ApiOperation({
      summary: options?.summary,
      deprecated: options?.deprecated,
      description: options?.description,
      operationId: options?.operation,
    }),
    ApiHeaders([
      {
        name: 'x-custom-lang',
        description: 'Custom language header',
        required: false,
        schema: {
          default: LanguageCode.en,
          example: LanguageCode.en,
          type: 'string',
        },
      },
    ]),
    DocDefault({
      httpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
      messagePath: 'http.serverError.internalServerError',
      statusCode: ENUM_APP_STATUS_CODE_ERROR.UNKNOWN,
    }),
    DocDefault({
      httpStatus: HttpStatus.REQUEST_TIMEOUT,
      messagePath: 'http.serverError.requestTimeout',
      statusCode: RequestStatusCodeError.TIMEOUT,
    }),
  );
}

export function DocRequest(options?: IDocRequestOptions) {
  const docs: Array<ClassDecorator | MethodDecorator> = [];

  switch (options?.bodyType) {
    case ENUM_DOC_REQUEST_BODY_TYPE.FORM_DATA: {
      docs.push(ApiConsumes('multipart/form-data'));

      break;
    }

    case ENUM_DOC_REQUEST_BODY_TYPE.TEXT: {
      docs.push(ApiConsumes('text/plain'));

      break;
    }

    case ENUM_DOC_REQUEST_BODY_TYPE.JSON: {
      docs.push(ApiConsumes('application/json'));

      break;
    }
    // No default
  }

  if (options?.bodyType) {
    docs.push(
      DocDefault({
        httpStatus: HttpStatus.UNPROCESSABLE_ENTITY,
        statusCode: RequestStatusCodeError.VALIDATION,
        messagePath: 'request.validation',
      }),
    );
  }

  if (options?.params) {
    const params: MethodDecorator[] = options.params.map((param) =>
      ApiParam(param),
    );
    docs.push(...params);
  }

  if (options?.queries) {
    const queries: MethodDecorator[] = options.queries.map((query) =>
      ApiQuery(query),
    );
    docs.push(...queries);
  }

  if (options?.dto) {
    docs.push(ApiBody({ type: options.dto }));
  }

  return applyDecorators(...docs);
}

export function DocRequestFile(options?: IDocRequestFileOptions) {
  const docs: Array<ClassDecorator | MethodDecorator> = [];

  if (options?.params) {
    const params: MethodDecorator[] = options.params.map((param) =>
      ApiParam(param),
    );
    docs.push(...params);
  }

  if (options?.queries) {
    const queries: MethodDecorator[] = options.queries.map((query) =>
      ApiQuery(query),
    );
    docs.push(...queries);
  }

  if (options?.dto) {
    docs.push(ApiBody({ type: options.dto }));
  }

  return applyDecorators(ApiConsumes('multipart/form-data'), ...docs);
}

export function DocGuard(options?: IDocGuardOptions) {
  const oneOfForbidden: IDocOfOptions[] = [];

  if (options?.role) {
    oneOfForbidden.push({
      messagePath: 'policy.error.roleForbidden',
    });
  }

  if (options?.policy) {
    oneOfForbidden.push({
      messagePath: 'policy.error.abilityForbidden',
    });
  }

  return applyDecorators(DocOneOf(HttpStatus.FORBIDDEN, ...oneOfForbidden));
}

export function DocResponse<T = void>(
  messagePath: string,
  options?: IDocResponseOptions<T>,
): MethodDecorator {
  const docs: IDocDefaultOptions = {
    httpStatus: options?.httpStatus ?? HttpStatus.OK,
    messagePath,
    statusCode: options?.statusCode ?? options?.httpStatus ?? HttpStatus.OK,
  };

  if (options?.dto) {
    docs.dto = options.dto;
  }

  return applyDecorators(ApiProduces('application/json'), DocDefault(docs));
}

export function DocErrorGroup(docs: MethodDecorator[]) {
  return applyDecorators(...docs);
}
