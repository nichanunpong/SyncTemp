import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ThemeToggleComponent } from '../components/theme-toggle.component';
import { UnitsToggleComponent } from '../components/units-toggle.component';
import { CurrentWeatherCardComponent } from '../components/current-weather-card.component';
import { TimezoneCardComponent } from '../components/timezone-card.component';
import { HourlyForecastChartComponent } from '../components/hourly-forecast-chart.component';
import { DailyForecastListComponent } from '../components/daily-forecast-list.component';
import { WeatherAlertsComponent } from '../components/weather-alerts.component';
import { ButtonComponent } from '../components/ui/button.component';
import { WeatherService } from '../services/weather.service';
import { TimeService } from '../services/time.service';
import { FavoritesService } from '../services/favorites.service';
import { CurrentWeather, HourlyForecast, DailyForecast, WorldTime, Place } from '../models/types';

@Component({
  selector: 'app-city-detail-page',
  standalone: true,
  imports: [
    CommonModule,
    ThemeToggleComponent,
    UnitsToggleComponent,
    CurrentWeatherCardComponent,
    TimezoneCardComponent,
    HourlyForecastChartComponent,
    DailyForecastListComponent,
    WeatherAlertsComponent,
    ButtonComponent,
  ],
  template: `
    <div [class]="getWeatherBackground()" class="min-h-screen transition-all duration-700">
      <div class="container mx-auto px-4 py-8">
        <header class="flex items-center justify-between mb-8">
          <app-button variant="outline" className="gap-2" (click)="goBack()">
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              ></path>
            </svg>
            Back
          </app-button>

          <div class="flex items-center gap-2">
            <app-button
              [variant]="favorited() ? 'default' : 'outline'"
              size="icon"
              (click)="handleAddToFavorites()"
              [disabled]="favorited()"
            >
              <span [class]="favorited() ? 'fill-current' : ''">⭐</span>
            </app-button>
            <app-units-toggle />
            <app-theme-toggle />
          </div>
        </header>

        @if (isLoading()) {
        <div class="flex items-center justify-center min-h-[60vh]">
          <div class="text-center space-y-4">
            <svg
              class="h-12 w-12 animate-spin text-primary mx-auto"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <p class="text-muted-foreground">Loading weather data...</p>
          </div>
        </div>
        } @else if (error() || !currentWeather()) {
        <div class="flex items-center justify-center min-h-[60vh]">
          <div class="text-center space-y-4 p-8">
            <svg
              class="h-12 w-12 text-destructive mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              ></path>
            </svg>
            <h2 class="text-2xl font-bold text-foreground">Something went wrong</h2>
            <p class="text-muted-foreground">{{ error() }}</p>
            <div class="flex gap-4 justify-center">
              <app-button variant="outline" (click)="goBack()">
                <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  ></path>
                </svg>
                Go Back
              </app-button>
              <app-button (click)="loadWeatherData()"> Try Again </app-button>
            </div>
          </div>
        </div>
        } @else {
        <main class="max-w-5xl mx-auto space-y-6">
          <app-weather-alerts [weather]="currentWeather()!" />

          <div class="grid md:grid-cols-2 gap-6">
            <app-current-weather-card [weather]="currentWeather()!" [cityName]="getCityName()" />

            <app-timezone-card
              [timezone]="worldTime()?.timezone || place()?.timezone || 'Local'"
              [utcOffset]="worldTime()?.utcOffset"
            />
          </div>

          <app-hourly-forecast-chart [hourly]="hourlyForecast()" />

          <app-daily-forecast-list [daily]="dailyForecast()" />
        </main>
        }
      </div>
    </div>
  `,
  styles: [],
})
export class CityDetailPageComponent implements OnInit {
  currentWeather = signal<CurrentWeather | null>(null);
  hourlyForecast = signal<HourlyForecast[]>([]);
  dailyForecast = signal<DailyForecast[]>([]);
  worldTime = signal<WorldTime | null>(null);
  isLoading = signal(true);
  error = signal<string | null>(null);
  favorited = signal(false);
  place = signal<Place | null>(null);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private weatherService: WeatherService,
    private timeService: TimeService,
    private favoritesService: FavoritesService
  ) {}

  ngOnInit(): void {
    const coords = this.route.snapshot.paramMap.get('coords');
    const state = history.state;
    const place = state?.place as Place | undefined;

    if (!coords || !place) {
      this.router.navigate(['/']);
      return;
    }

    this.place.set(place);
    this.favorited.set(this.favoritesService.isFavorite(place.id));
    this.loadWeatherData();
  }

  async loadWeatherData(): Promise<void> {
    const coords = this.route.snapshot.paramMap.get('coords');
    const place = this.place();

    if (!coords || !place) return;

    const [lat, lon] = coords.split(',').map(Number);

    this.isLoading.set(true);
    this.error.set(null);

    try {
      const [current, hourly, daily] = await Promise.all([
        this.weatherService.getCurrentWeather(lat, lon),
        this.weatherService.getHourlyForecast(lat, lon),
        this.weatherService.getDailyForecast(lat, lon),
      ]);

      this.currentWeather.set(current);
      this.hourlyForecast.set(hourly);
      this.dailyForecast.set(daily);

      // Try to get timezone info
      if (place.timezone) {
        try {
          const time = await this.timeService.getTimeByTimezone(place.timezone);
          this.worldTime.set(time);
        } catch (error) {
          console.error('Failed to fetch time:', error);
        }
      }
    } catch (err) {
      this.error.set('Failed to load weather data. Please try again.');
      console.error('Weather fetch error:', err);
    } finally {
      this.isLoading.set(false);
    }
  }

  handleAddToFavorites(): void {
    const place = this.place();
    if (!place) return;

    this.favoritesService.addFavorite(place);
    this.favorited.set(true);
    alert('Added to favorites');
  }

  getWeatherBackground(): string {
    const weather = this.currentWeather();
    if (!weather) return 'bg-gradient-day dark:bg-gradient-night';

    const code = weather.weatherCode;
    if (code === 0 || code === 1) return 'bg-gradient-sunny dark:bg-gradient-night';
    if (code >= 61 && code <= 65) return 'bg-gradient-rainy dark:bg-gradient-rainy-dark';
    if (code >= 71 && code <= 77) return 'bg-gradient-snowy dark:bg-gradient-snowy-dark';
    if (code >= 95) return 'bg-gradient-stormy dark:bg-gradient-stormy-dark';
    return 'bg-gradient-day dark:bg-gradient-night';
  }

  getCityName(): string {
    const place = this.place();
    return place ? `${place.name}, ${place.country}` : '';
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}
