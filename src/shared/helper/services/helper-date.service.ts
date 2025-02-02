import { Injectable } from '@nestjs/common';
import type { DateObjectUnits } from 'luxon';
import { DateTime, Duration } from 'luxon';

import { HelperDateDayOf } from '../../../common/constants/helper.enum.ts';
import { ApiConfigService } from '../../services/api-config.service.ts';
import { IHelperDateCreateOptions } from '../interfaces/helper.interface.ts';
import { IHelperDateService } from '../interfaces/helper-date-service.interface.ts';

@Injectable()
export class HelperDateService implements IHelperDateService {
  private readonly defTz: string;

  constructor(private readonly configService: ApiConfigService) {
    this.defTz = this.configService.appConfig.timezone;
  }

  calculateAge(dateOfBirth: Date, fromYear?: number): Duration {
    const dateTime = DateTime.now()
      .setZone(this.defTz)
      .plus({
        day: 1,
      })
      .set({
        hour: 0,
        minute: 0,
        second: 0,
        millisecond: 0,
      });
    const dateTimeDob = DateTime.fromJSDate(dateOfBirth)
      .setZone(this.defTz)
      .set({
        hour: 0,
        minute: 0,
        second: 0,
        millisecond: 0,
      });

    if (fromYear) {
      dateTime.set({
        year: fromYear,
      });
    }

    return dateTime.diff(dateTimeDob);
  }

  checkIso(date: string): boolean {
    return DateTime.fromISO(date).setZone(this.defTz).isValid;
  }

  checkTimestamp(timestamp: number): boolean {
    return DateTime.fromMillis(timestamp).setZone(this.defTz).isValid;
  }

  getZone(date: Date): string {
    return DateTime.fromJSDate(date).setZone(this.defTz).zone.name;
  }

  getZoneOffset(date: Date): string {
    return DateTime.fromJSDate(date).setZone(this.defTz).offsetNameShort!;
  }

  getTimestamp(date: Date): number {
    return DateTime.fromJSDate(date).setZone(this.defTz).toMillis();
  }

  formatToRFC2822(date: Date): string {
    return DateTime.fromJSDate(date).setZone(this.defTz).toRFC2822()!;
  }

  formatToIso(date: Date): string {
    return DateTime.fromJSDate(date).setZone(this.defTz).toISO()!;
  }

  formatToIsoDate(date: Date): string {
    return DateTime.fromJSDate(date).setZone(this.defTz).toISODate()!;
  }

  formatToIsoTime(date: Date): string {
    return DateTime.fromJSDate(date).setZone(this.defTz).toISOTime()!;
  }

  create(date?: Date, options?: IHelperDateCreateOptions): Date {
    const mDate = date
      ? DateTime.fromJSDate(date).setZone(this.defTz)
      : DateTime.now().setZone(this.defTz);

    if (options?.dayOf && options.dayOf === HelperDateDayOf.START) {
      mDate.startOf('day');
    } else if (options?.dayOf && options.dayOf === HelperDateDayOf.END) {
      mDate.endOf('day');
    }

    return mDate.toJSDate();
  }

  createInstance(date?: Date): DateTime {
    return date ? DateTime.fromJSDate(date) : DateTime.now();
  }

  createFromIso(iso: string, options?: IHelperDateCreateOptions): Date {
    const date = DateTime.fromISO(iso).setZone(this.defTz);

    if (options?.dayOf && options.dayOf === HelperDateDayOf.START) {
      date.startOf('day');
    } else if (options?.dayOf && options.dayOf === HelperDateDayOf.END) {
      date.endOf('day');
    }

    return date.toJSDate();
  }

  createFromTimestamp(
    timestamp?: number,
    options?: IHelperDateCreateOptions,
  ): Date {
    const date = timestamp
      ? DateTime.fromMillis(timestamp).setZone(this.defTz)
      : DateTime.now().setZone(this.defTz);

    if (options?.dayOf && options.dayOf === HelperDateDayOf.START) {
      date.startOf('day');
    } else if (options?.dayOf && options.dayOf === HelperDateDayOf.END) {
      date.endOf('day');
    }

    return date.toJSDate();
  }

  set(date: Date, units: DateObjectUnits): Date {
    return DateTime.fromJSDate(date).setZone(this.defTz).set(units).toJSDate();
  }

  forward(date: Date, duration: Duration): Date {
    return DateTime.fromJSDate(date)
      .setZone(this.defTz)
      .plus(duration)
      .toJSDate();
  }

  backward(date: Date, duration: Duration): Date {
    return DateTime.fromJSDate(date)
      .setZone(this.defTz)
      .minus(duration)
      .toJSDate();
  }
}
