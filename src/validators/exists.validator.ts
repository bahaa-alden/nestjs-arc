import { Injectable } from '@nestjs/common';
import type {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraintInterface,
} from 'class-validator';
import { registerDecorator, ValidatorConstraint } from 'class-validator';
import type { EntityTarget, ObjectLiteral } from 'typeorm';
import { DataSource } from 'typeorm';

@ValidatorConstraint({ name: 'isExist', async: true })
@Injectable()
export class IsExistConstraint implements ValidatorConstraintInterface {
  constructor(private dataSource: DataSource) {}

  async validate(value: string, args: ValidationArguments) {
    const [entityClass] = args.constraints as [EntityTarget<ObjectLiteral>];

    const entity = await this.dataSource.getRepository(entityClass).findOne({
      where: {
        [args.property]: value,
      },
      withDeleted: true,
    });

    return entity ? true : false;
  }

  defaultMessage(args: ValidationArguments): string {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const [entityClass] = args.constraints;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
    const entity = entityClass.name ?? 'Entity';

    return `the selected ${args.property}  does not exist in ${entity} entity`;
  }
}

export function IsExist<E>(
  entity: EntityTarget<E>,
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [entity],
      validator: IsExistConstraint,
    });
  } as PropertyDecorator;
}
