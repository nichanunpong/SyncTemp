import { Component, EventEmitter, Input, Output, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GeocodingService } from '../services/geocoding.service';
import { Place } from '../models/types';
import { InputComponent } from './ui/input.component';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, FormsModule, InputComponent],
  template: `
    <div class="relative w-full" [class]="className">
      <div class="relative">
        <svg
          class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          ></path>
        </svg>
        <app-input
          type="text"
          placeholder="Search for a city..."
          [(ngModel)]="queryValue"
          (ngModelChange)="onQueryChange($event)"
          (focus)="onFocus()"
          className="pl-10 pr-10 h-12 text-base shadow-soft"
        />
        @if (isLoading()) {
        <svg
          class="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground"
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
        }
      </div>

      @if (isOpen() && results().length > 0) {
      <div
        class="absolute top-full mt-2 w-full rounded-lg border bg-card shadow-soft z-50 overflow-hidden animate-fade-in"
      >
        @for (place of results(); track place.id) {
        <button
          (click)="handleSelect(place)"
          class="w-full px-4 py-3 text-left hover:bg-muted/50 transition-colors border-b last:border-b-0"
        >
          <div class="font-medium text-card-foreground">{{ place.name }}</div>
          <div class="text-sm text-muted-foreground">
            {{ getLocationString(place) }}
          </div>
        </button>
        }
      </div>
      }
    </div>
  `,
  styles: [],
})
export class SearchBarComponent implements OnInit, OnDestroy {
  @Input() className: string = '';
  @Output() selectPlace = new EventEmitter<Place>();

  queryValue: string = '';
  results = signal<Place[]>([]);
  isLoading = signal(false);
  isOpen = signal(false);
  private searchTimeout: any;

  constructor(private geocodingService: GeocodingService) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
  }

  onQueryChange(value: string): void {
    this.queryValue = value;

    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }

    if (value.length < 2) {
      this.results.set([]);
      this.isOpen.set(false);
      return;
    }

    this.isLoading.set(true);
    this.searchTimeout = setTimeout(async () => {
      try {
        const cities = await this.geocodingService.searchCities(value);
        this.results.set(cities);
        this.isOpen.set(cities.length > 0);
      } catch (error) {
        console.error('Search error:', error);
        this.results.set([]);
      } finally {
        this.isLoading.set(false);
      }
    }, 300);
  }

  onFocus(): void {
    if (this.results().length > 0) {
      this.isOpen.set(true);
    }
  }

  handleSelect(place: Place): void {
    this.queryValue = '';
    this.results.set([]);
    this.isOpen.set(false);
    this.selectPlace.emit(place);
  }

  getLocationString(place: Place): string {
    const parts: string[] = [];
    if (place.admin1) parts.push(place.admin1);
    if (place.country) parts.push(place.country);
    return parts.join(', ');
  }
}
