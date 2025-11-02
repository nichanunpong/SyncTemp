import { Injectable } from '@angular/core';
import { Place } from '../models/types';

const GEOCODING_API_BASE = 'https://geocoding-api.open-meteo.com/v1';

@Injectable({
  providedIn: 'root',
})
export class GeocodingService {
  async searchCities(query: string): Promise<Place[]> {
    if (!query || query.length < 2) return [];

    const params = new URLSearchParams({
      name: query,
      count: '5',
      language: 'en',
      format: 'json',
    });

    try {
      const response = await fetch(`${GEOCODING_API_BASE}/search?${params}`);
      if (!response.ok) return [];

      const data = await response.json();
      if (!data.results) return [];

      return data.results.map((result: any) => ({
        id: result.id,
        name: result.name,
        latitude: result.latitude,
        longitude: result.longitude,
        country: result.country,
        admin1: result.admin1,
        timezone: result.timezone,
      }));
    } catch (error) {
      console.error('Geocoding error:', error);
      return [];
    }
  }
}
