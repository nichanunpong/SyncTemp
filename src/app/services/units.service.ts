import { Injectable, signal } from '@angular/core';

export type Units = 'metric' | 'imperial';

@Injectable({
  providedIn: 'root',
})
export class UnitsService {
  units = signal<Units>('metric');

  constructor() {
    const stored = localStorage.getItem('weather-units') as Units | null;
    if (stored) {
      this.units.set(stored);
    }
  }

  toggleUnits(): void {
    const newUnits = this.units() === 'metric' ? 'imperial' : 'metric';
    this.units.set(newUnits);
    localStorage.setItem('weather-units', newUnits);
  }

  convertTemp(celsius: number): number {
    return this.units() === 'imperial' ? Math.round((celsius * 9) / 5 + 32) : celsius;
  }

  convertSpeed(kmh: number): number {
    return this.units() === 'imperial' ? Math.round(kmh * 0.621371) : kmh;
  }

  get tempUnit(): string {
    return this.units() === 'metric' ? '°C' : '°F';
  }

  get speedUnit(): string {
    return this.units() === 'metric' ? 'km/h' : 'mph';
  }
}
