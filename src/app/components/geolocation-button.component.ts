import { Component, EventEmitter, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeocodingService } from '../services/geocoding.service';
import { ButtonComponent } from './ui/button.component';

@Component({
  selector: 'app-geolocation-button',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  template: `
    <app-button
      (click)="handleGetLocation()"
      [disabled]="isLoading()"
      variant="outline"
      size="lg"
      className="gap-2"
    >
      @if (isLoading()) {
      <svg class="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
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
      } @else {
      <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
        ></path>
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
        ></path>
      </svg>
      } Use My Location
    </app-button>
  `,
  styles: [],
})
export class GeolocationButtonComponent {
  @Output() locationFound = new EventEmitter<{ lat: number; lon: number }>();

  isLoading = signal(false);

  constructor(private geocodingService: GeocodingService) {}

  handleGetLocation(): void {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    this.isLoading.set(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.isLoading.set(false);
        this.locationFound.emit({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      },
      (error) => {
        this.isLoading.set(false);
        let message = 'Failed to get location';
        if (error.code === error.PERMISSION_DENIED) {
          message = 'Location permission denied';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          message = 'Location information unavailable';
        }
        alert(message);
      }
    );
  }
}
