import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CurrentWeather } from '../models/types';
import { UnitsService } from '../services/units.service';
import { CardComponent } from './ui/card.component';

@Component({
  selector: 'app-current-weather-card',
  standalone: true,
  imports: [CommonModule, CardComponent],
  template: `
    <app-card className="p-6 bg-gradient-card backdrop-blur-sm border-primary/20 shadow-glow h-full flex flex-col">
      <div class="text-center space-y-4 flex-1 flex flex-col">
        <h2 class="text-2xl font-bold text-card-foreground">{{ cityName }}</h2>

        <div class="py-6">
          <div class="text-7xl mb-4 animate-fade-in">{{ weather.icon }}</div>
          <div class="text-6xl font-bold text-primary mb-2">
            {{ unitsService.convertTemp(weather.temperature) }}{{ unitsService.tempUnit }}
          </div>
          <div class="text-xl text-muted-foreground">{{ weather.condition }}</div>
        </div>

        <div class="grid grid-cols-3 gap-4 pt-4 border-t border-border/50">
          <div class="flex flex-col items-center space-y-1">
            <svg class="h-5 w-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              ></path>
            </svg>
            <div class="text-sm text-muted-foreground">Feels like</div>
            <div class="text-lg font-semibold text-card-foreground">
              {{ unitsService.convertTemp(weather.feelsLike) }}{{ unitsService.tempUnit }}
            </div>
          </div>

          <div class="flex flex-col items-center space-y-1">
            <svg class="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
              ></path>
            </svg>
            <div class="text-sm text-muted-foreground">Humidity</div>
            <div class="text-lg font-semibold text-card-foreground">{{ weather.humidity }}%</div>
          </div>

          <div class="flex flex-col items-center space-y-1">
            <svg
              class="h-5 w-5 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
              ></path>
            </svg>
            <div class="text-sm text-muted-foreground">Wind</div>
            <div class="text-lg font-semibold text-card-foreground">
              {{ unitsService.convertSpeed(weather.windSpeed) }} {{ unitsService.speedUnit }}
            </div>
          </div>
        </div>

        <div class="text-xs text-muted-foreground pt-4">
          Updated at {{ formatTime(weather.lastUpdated) }}
        </div>
      </div>
    </app-card>
  `,
  styles: [],
})
export class CurrentWeatherCardComponent {
  @Input() weather!: CurrentWeather;
  @Input() cityName!: string;

  constructor(public unitsService: UnitsService) {}

  formatTime(date: Date): string {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
