import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SearchBarComponent } from '../components/search-bar.component';
import { ThemeToggleComponent } from '../components/theme-toggle.component';
import { FavoritesBarComponent } from '../components/favorites-bar.component';
import { GeolocationButtonComponent } from '../components/geolocation-button.component';
import { UnitsToggleComponent } from '../components/units-toggle.component';
import { GeocodingService } from '../services/geocoding.service';
import { Place } from '../models/types';

@Component({
  selector: 'app-index-page',
  standalone: true,
  imports: [
    CommonModule,
    SearchBarComponent,
    ThemeToggleComponent,
    FavoritesBarComponent,
    GeolocationButtonComponent,
    UnitsToggleComponent,
  ],
  template: `
    <div class="min-h-screen bg-gradient-day dark:bg-gradient-night transition-colors duration-300">
      <div class="container mx-auto px-4 py-8">
        <header class="flex items-center justify-between mb-12">
          <div class="flex items-center space-x-3">
            <span class="text-4xl">☁️</span>
            <h1 class="text-3xl font-bold text-foreground">WeatherZone</h1>
          </div>
          <div class="flex items-center gap-2">
            <app-units-toggle />
            <app-theme-toggle />
          </div>
        </header>

        <main class="max-w-2xl mx-auto">
          <div class="text-center mb-12 space-y-4 animate-fade-in">
            <h2 class="text-4xl md:text-5xl font-bold text-foreground">Weather & Time Zones</h2>
            <p class="text-lg text-muted-foreground">
              Get current weather conditions and local time for any city worldwide
            </p>
          </div>

          <div class="mb-8 space-y-4">
            <app-search-bar (selectPlace)="handleSelectPlace($event)" />
            <div class="flex justify-center">
              <app-geolocation-button (locationFound)="handleGeolocation($event)" />
            </div>
          </div>

          <app-favorites-bar (selectPlace)="handleSelectPlace($event)" />

          <div class="mt-16 text-center space-y-6">
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              @for (emoji of ['🌤️', '⛈️', '🌈', '❄️']; track $index) {
              <div
                class="bg-card/50 backdrop-blur-sm rounded-lg p-6 shadow-soft animate-fade-in"
                [style.animation-delay.ms]="$index * 100"
              >
                <div class="text-5xl mb-2">{{ emoji }}</div>
              </div>
              }
            </div>

            <p class="text-sm text-muted-foreground">
              Search for any city to view detailed weather forecasts and time zones
            </p>
          </div>
        </main>
      </div>
    </div>
  `,
  styles: [],
})
export class IndexPageComponent {
  constructor(private router: Router, private geocodingService: GeocodingService) {}

  handleSelectPlace(place: Place): void {
    this.router.navigate(['/city', `${place.latitude},${place.longitude}`], {
      state: { place },
    });
  }

  async handleGeolocation(location: { lat: number; lon: number }): Promise<void> {
    try {
      const places = await this.geocodingService.searchCities(`${location.lat},${location.lon}`);
      if (places.length > 0) {
        this.handleSelectPlace(places[0]);
      } else {
        // Fallback: navigate with coordinates only
        this.router.navigate(['/city', `${location.lat},${location.lon}`], {
          state: {
            place: {
              id: Date.now(),
              name: 'Current Location',
              latitude: location.lat,
              longitude: location.lon,
              country: '',
            },
          },
        });
      }
    } catch (error) {
      alert('Failed to fetch location details');
    }
  }
}
