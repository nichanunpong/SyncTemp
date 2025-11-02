import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DailyForecast } from '../models/types';
import { UnitsService } from '../services/units.service';
import { CardComponent } from './ui/card.component';

const weatherCodeToIcon: Record<number, string> = {
  0: '☀️',
  1: '🌤️',
  2: '⛅',
  3: '☁️',
  45: '🌫️',
  48: '🌫️',
  51: '🌦️',
  61: '🌧️',
  71: '🌨️',
  95: '⛈️',
};

@Component({
  selector: 'app-daily-forecast-list',
  standalone: true,
  imports: [CommonModule, CardComponent],
  template: `
    <app-card className="p-6 bg-gradient-card backdrop-blur-sm border-primary/20 shadow-soft">
      <h3 class="text-xl font-bold text-card-foreground mb-4">7-Day Forecast</h3>

      <div class="space-y-3">
        @for (day of daily; track $index) {
        <div
          class="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
        >
          <div class="flex items-center space-x-4 flex-1">
            <div class="text-3xl">
              {{ getWeatherIcon(day.weatherCode) }}
            </div>
            <div class="flex-1">
              <div class="font-medium text-card-foreground">
                {{ formatDate(day.date) }}
              </div>
              @if (day.precipitationSum > 0) {
              <div class="flex items-center text-sm text-muted-foreground">
                <svg class="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                  ></path>
                </svg>
                {{ day.precipitationSum.toFixed(1) }} mm
              </div>
              }
            </div>
          </div>

          <div class="flex items-center space-x-4">
            <div class="text-right">
              <div class="text-lg font-semibold text-card-foreground">
                {{ unitsService.convertTemp(day.tempMax) }}{{ unitsService.tempUnit }}
              </div>
              <div class="text-sm text-muted-foreground">
                {{ unitsService.convertTemp(day.tempMin) }}{{ unitsService.tempUnit }}
              </div>
            </div>
          </div>
        </div>
        }
      </div>
    </app-card>
  `,
  styles: [],
})
export class DailyForecastListComponent {
  @Input() daily!: DailyForecast[];

  constructor(public unitsService: UnitsService) {}

  getWeatherIcon(code: number): string {
    return weatherCodeToIcon[code] || '☀️';
  }

  formatDate(date: Date): string {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    }
  }
}
