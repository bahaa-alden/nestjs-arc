import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport';

@Injectable()
export class PublicStrategy extends PassportStrategy(Strategy, 'public') {
  validate(...args: any[]): unknown {
    throw new Error('Method not implemented.' + args);
  }
  override authenticate(): void {
    this.success({ [Symbol.for('isPublic')]: true });
  }
}
