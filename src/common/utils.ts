/* eslint-disable n/no-unsupported-features/es-syntax */
import { BadRequestException, ConflictException } from '@nestjs/common';

type NewType<TResult> = TResult;

export function getVariableName<TResult>(
  getVar: () => NewType<TResult>,
): string | undefined {
  const m = /\(\)=>(.*)/.exec(
    getVar.toString().replaceAll(/(\r\n|\n|\r|\s)/gm, ''),
  );

  if (!m) {
    throw new Error(
      "The function does not contain a statement matching 'return variableName;'",
    );
  }

  const fullMemberName = m[1]!;

  const memberParts = fullMemberName.split('.');

  return memberParts.at(-1);
}

export const needRecord = <T>(
  record?: T | null,
  err = new BadRequestException(),
): T => {
  if (!record) {
    throw err;
  }

  return record;
};

export const existRecord = <T>(
  record?: T | null,
  err = new ConflictException('Already exists'),
) => {
  if (record) {
    throw err;
  }

  return record;
};
