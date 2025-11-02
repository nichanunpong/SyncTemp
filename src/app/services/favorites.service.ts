import { Injectable } from '@angular/core';
import { Favorite, Place } from '../models/types';
import { BehaviorSubject, Observable } from 'rxjs';

const FAVORITES_KEY = 'weather-favorites';

@Injectable({
  providedIn: 'root',
})
export class FavoritesService {
  private favoritesSubject = new BehaviorSubject<Favorite[]>(this.getFavorites());
  public favorites$: Observable<Favorite[]> = this.favoritesSubject.asObservable();

  getFavorites(): Favorite[] {
    try {
      const stored = localStorage.getItem(FAVORITES_KEY);
      if (!stored) return [];

      const favorites = JSON.parse(stored);
      return favorites.map((fav: any) => ({
        ...fav,
        addedAt: new Date(fav.addedAt),
      }));
    } catch (error) {
      console.error('Error loading favorites:', error);
      return [];
    }
  }

  addFavorite(place: Place): void {
    const favorites = this.getFavorites();

    // Check if already exists
    if (favorites.some((fav) => fav.place.id === place.id)) {
      return;
    }

    const newFavorite: Favorite = {
      id: crypto.randomUUID(),
      place,
      addedAt: new Date(),
    };

    favorites.push(newFavorite);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    this.favoritesSubject.next(favorites);
  }

  removeFavorite(favoriteId: string): void {
    const favorites = this.getFavorites();
    const filtered = favorites.filter((fav) => fav.id !== favoriteId);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(filtered));
    this.favoritesSubject.next(filtered);
  }

  isFavorite(placeId: number): boolean {
    const favorites = this.getFavorites();
    return favorites.some((fav) => fav.place.id === placeId);
  }
}
