import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HourlyForecast } from '../models/types';
import { UnitsService } from '../services/units.service';
import { CardComponent } from './ui/card.component';

@Component({
  selector: 'app-hourly-forecast-chart',
  standalone: true,
  imports: [CommonModule, CardComponent],
  template: `
    <app-card className="p-6 bg-gradient-card backdrop-blur-sm border-primary/20 shadow-soft mt-6 mb-6">
      <h3 class="text-xl font-bold text-card-foreground mb-4">24-Hour Forecast</h3>

      <div class="overflow-x-auto">
        <div class="flex space-x-4 min-w-max pb-4">
          @for (hour of hourly; track $index) {
          <div class="flex flex-col items-center space-y-2 min-w-[60px]">
            <div class="text-xs text-muted-foreground">
              {{ formatTime(hour.time) }}
            </div>
            <div class="text-lg font-semibold text-card-foreground">
              {{ unitsService.convertTemp(hour.temperature) }}{{ unitsService.tempUnit }}
            </div>
            @if (hour.precipitation > 0) {
            <div class="text-xs text-primary">{{ hour.precipitation.toFixed(1) }}mm</div>
            }
          </div>
          }
        </div>
      </div>

      <!-- Simple line chart using CSS -->
      <div class="mt-6 relative h-48">
        <svg class="w-full h-full" viewBox="0 0 800 200" preserveAspectRatio="none">
          <polyline
            [attr.points]="getChartPoints()"
            fill="none"
            stroke="hsl(var(--primary))"
            stroke-width="3"
            class="drop-shadow-lg"
          />
          @for (point of getChartData(); track $index) {
          <circle
            [attr.cx]="point.x"
            [attr.cy]="point.y"
            r="4"
            fill="hsl(var(--primary))"
            class="hover:r-6 transition-all"
          />
          }
        </svg>
      </div>
    </app-card>
  `,
  styles: [],
})
export class HourlyForecastChartComponent {
  @Input() hourly!: HourlyForecast[];

  constructor(public unitsService: UnitsService) {}

  formatTime(date: Date): string {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', hour12: false });
  }

  getChartData(): Array<{ x: number; y: number }> {
    if (!this.hourly || this.hourly.length === 0) return [];

    const temperatures = this.hourly.map((h) => this.unitsService.convertTemp(h.temperature));
    const minTemp = Math.min(...temperatures);
    const maxTemp = Math.max(...temperatures);
    const range = maxTemp - minTemp || 1;

    const padding = 20;
    const width = 800;
    const height = 200;
    const availableHeight = height - padding * 2;

    return temperatures.map((temp, index) => {
      const x = padding + (index / (temperatures.length - 1 || 1)) * (width - padding * 2);
      const normalized = (temp - minTemp) / range;
      const y = padding + availableHeight - normalized * availableHeight;
      return { x, y };
    });
  }

  getChartPoints(): string {
    const points = this.getChartData();
    return points.map((p) => `${p.x},${p.y}`).join(' ');
  }
}
