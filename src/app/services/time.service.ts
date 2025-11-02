import { Injectable } from '@angular/core';
import { WorldTime } from '../models/types';

const TIME_API_BASE = 'https://worldtimeapi.org/api';

@Injectable({
  providedIn: 'root',
})
export class TimeService {
  async getTimeByTimezone(timezone: string): Promise<WorldTime> {
    const encodedTz = encodeURIComponent(timezone);
    const response = await fetch(`${TIME_API_BASE}/timezone/${encodedTz}`);

    if (!response.ok) throw new Error('Failed to fetch time data');

    const data = await response.json();

    return {
      datetime: data.datetime,
      timezone: data.timezone,
      utcOffset: data.utc_offset,
    };
  }

  async getTimeByCoordinates(latitude: number, longitude: number): Promise<WorldTime> {
    // Fallback: use IP-based or return current time with manual offset calculation
    // WorldTimeAPI doesn't support coordinates directly, so we'll use browser time
    const now = new Date();
    return {
      datetime: now.toISOString(),
      timezone: 'Local',
      utcOffset: this.formatOffset(now.getTimezoneOffset()),
    };
  }

  private formatOffset(minutes: number): string {
    const hours = Math.floor(Math.abs(minutes) / 60);
    const mins = Math.abs(minutes) % 60;
    const sign = minutes <= 0 ? '+' : '-';
    return `${sign}${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
  }
}
