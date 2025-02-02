import { Query } from '@nestjs/common';

import { PaginationSearchPipe } from '../pipes/pagination-search.pipe.ts';

export interface IPaginationQueryOptions {
  availableSearch?: string[];
}

export function PaginationQuery(
  options?: IPaginationQueryOptions,
): ParameterDecorator {
  return Query(PaginationSearchPipe(options?.availableSearch));
}
