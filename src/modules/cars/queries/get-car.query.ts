import type { ICommand } from '@nestjs/cqrs';

export class GetCarQuery implements ICommand {
  constructor(
    public readonly userId: Uuid,
) {}
}
