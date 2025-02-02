/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable canonical/id-match */

/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Inject,
  Injectable,
  mixin,
  PipeTransform,
  Scope,
  Type,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';

import type { IRequestApp } from '../../shared/request/interfaces/request.interface.ts';

export function PaginationSearchPipe(
  availableSearch: string[] = [],
): Type<PipeTransform> {
  @Injectable({ scope: Scope.REQUEST })
  class MixinPaginationSearchPipe implements PipeTransform {
    constructor(@Inject(REQUEST) protected readonly request: IRequestApp) {}

    async transform(value: Record<string, any>): Promise<Record<string, any>> {
      if (availableSearch.length === 0 || !value.q) {
        this.addToRequestInstance(value.q, availableSearch);

        return value;
      }

      this.addToRequestInstance(value.q, availableSearch);

      return {
        ...value,
        _availableSearch: availableSearch,
      };
    }

    addToRequestInstance(q: string, availableSearch: string[]): void {
      this.request.__pagination = {
        ...this.request.query,
        q,
        availableSearch,
      };
    }
  }

  return mixin(MixinPaginationSearchPipe);
}
