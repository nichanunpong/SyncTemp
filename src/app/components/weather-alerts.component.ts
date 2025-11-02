import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CurrentWeather } from '../models/types';

interface Alert {
  icon: string;
  message: string;
  type: 'warning' | 'info';
}

@Component({
  selector: 'app-weather-alerts',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (alerts.length > 0) {
    <div class="space-y-2 animate-fade-in">
      @for (alert of alerts; track $index) {
      <div [class]="getAlertClasses(alert.type)" class="p-4 rounded-lg border">
        <div class="flex items-center gap-2">
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            ></path>
          </svg>
          <span>{{ alert.icon }}</span>
          <span>{{ alert.message }}</span>
        </div>
      </div>
      }
    </div>
    }
  `,
  styles: [],
})
export class WeatherAlertsComponent {
  @Input() weather!: CurrentWeather;

  get alerts(): Alert[] {
    const alerts: Alert[] = [];

    if (this.weather.temperature < 0) {
      alerts.push({
        icon: '🌡️',
        message: `Freezing conditions: ${this.weather.temperature}°C`,
        type: 'warning',
      });
    }

    if (this.weather.temperature > 35) {
      alerts.push({
        icon: '🌡️',
        message: `Extreme heat warning: ${this.weather.temperature}°C`,
        type: 'warning',
      });
    }

    if (this.weather.windSpeed > 60) {
      alerts.push({
        icon: '💨',
        message: `Strong wind warning: ${this.weather.windSpeed} km/h`,
        type: 'warning',
      });
    }

    if (this.weather.humidity > 90) {
      alerts.push({
        icon: '💧',
        message: `Very high humidity: ${this.weather.humidity}%`,
        type: 'info',
      });
    }

    return alerts;
  }

  getAlertClasses(type: 'warning' | 'info'): string {
    return type === 'warning'
      ? 'bg-destructive/10 border-destructive text-destructive-foreground'
      : 'bg-primary/10 border-primary text-primary-foreground';
  }
}
