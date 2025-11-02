import { Component, EventEmitter, Output, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FavoritesService } from '../services/favorites.service';
import { Place, Favorite } from '../models/types';

@Component({
  selector: 'app-favorites-bar',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (favorites.length > 0) {
    <div class="mb-6 animate-fade-in">
      <div class="flex items-center space-x-2 mb-3">
        <span class="text-accent">⭐</span>
        <h3 class="text-sm font-semibold text-foreground">Favorites</h3>
      </div>

      <div class="flex flex-wrap gap-2">
        @for (fav of favorites; track fav.id) {
        <div
          class="px-3 py-2 cursor-pointer bg-secondary text-secondary-foreground rounded-md hover:bg-primary hover:text-primary-foreground transition-colors group flex items-center gap-2"
          (click)="onSelectPlace(fav.place)"
        >
          <span> {{ fav.place.name }}, {{ fav.place.country }} </span>
          <button
            class="h-4 w-4 p-0 hover:bg-transparent opacity-0 group-hover:opacity-100 transition-opacity"
            (click)="removeFavorite($event, fav.id)"
          >
            <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>
        }
      </div>
    </div>
    }
  `,
  styles: [],
})
export class FavoritesBarComponent implements OnInit, OnDestroy {
  @Output() selectPlace = new EventEmitter<Place>();

  favorites: Favorite[] = [];
  private subscription: any;

  constructor(private favoritesService: FavoritesService) {}

  ngOnInit(): void {
    this.loadFavorites();
    this.subscription = this.favoritesService.favorites$.subscribe((favs) => {
      this.favorites = favs;
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  loadFavorites(): void {
    this.favorites = this.favoritesService.getFavorites();
  }

  removeFavorite(event: Event, favoriteId: string): void {
    event.stopPropagation();
    this.favoritesService.removeFavorite(favoriteId);
    this.loadFavorites();
  }

  onSelectPlace(place: Place): void {
    this.selectPlace.emit(place);
  }
}
