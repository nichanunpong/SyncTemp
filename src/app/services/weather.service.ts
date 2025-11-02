import { Injectable } from '@angular/core';
import { CurrentWeather, HourlyForecast, DailyForecast } from '../models/types';

const WEATHER_API_BASE = 'https://api.open-meteo.com/v1';

const weatherCodeMap: Record<number, { condition: string; icon: string }> = {
  0: { condition: 'Clear sky', icon: '☀️' },
  1: { condition: 'Mainly clear', icon: '🌤️' },
  2: { condition: 'Partly cloudy', icon: '⛅' },
  3: { condition: 'Overcast', icon: '☁️' },
  45: { condition: 'Foggy', icon: '🌫️' },
  48: { condition: 'Foggy', icon: '🌫️' },
  51: { condition: 'Light drizzle', icon: '🌦️' },
  53: { condition: 'Drizzle', icon: '🌦️' },
  55: { condition: 'Heavy drizzle', icon: '🌧️' },
  61: { condition: 'Light rain', icon: '🌧️' },
  63: { condition: 'Rain', icon: '🌧️' },
  65: { condition: 'Heavy rain', icon: '⛈️' },
  71: { condition: 'Light snow', icon: '🌨️' },
  73: { condition: 'Snow', icon: '❄️' },
  75: { condition: 'Heavy snow', icon: '❄️' },
  77: { condition: 'Snow grains', icon: '❄️' },
  80: { condition: 'Light showers', icon: '🌦️' },
  81: { condition: 'Showers', icon: '🌧️' },
  82: { condition: 'Heavy showers', icon: '⛈️' },
  85: { condition: 'Light snow showers', icon: '🌨️' },
  86: { condition: 'Snow showers', icon: '❄️' },
  95: { condition: 'Thunderstorm', icon: '⛈️' },
  96: { condition: 'Thunderstorm with hail', icon: '⛈️' },
  99: { condition: 'Thunderstorm with hail', icon: '⛈️' },
};

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  async getCurrentWeather(latitude: number, longitude: number): Promise<CurrentWeather> {
    const params = new URLSearchParams({
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      current:
        'temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m',
      timezone: 'auto',
    });

    const response = await fetch(`${WEATHER_API_BASE}/forecast?${params}`);
    if (!response.ok) throw new Error('Failed to fetch weather data');

    const data = await response.json();
    const current = data.current;
    const weatherInfo = weatherCodeMap[current.weather_code] || weatherCodeMap[0];

    return {
      temperature: Math.round(current.temperature_2m),
      feelsLike: Math.round(current.apparent_temperature),
      humidity: current.relative_humidity_2m,
      windSpeed: Math.round(current.wind_speed_10m),
      windDirection: current.wind_direction_10m,
      weatherCode: current.weather_code,
      condition: weatherInfo.condition,
      icon: weatherInfo.icon,
      lastUpdated: new Date(current.time),
    };
  }

  async getHourlyForecast(latitude: number, longitude: number): Promise<HourlyForecast[]> {
    const params = new URLSearchParams({
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      hourly: 'temperature_2m,precipitation',
      forecast_days: '2',
      timezone: 'auto',
    });

    const response = await fetch(`${WEATHER_API_BASE}/forecast?${params}`);
    if (!response.ok) throw new Error('Failed to fetch hourly forecast');

    const data = await response.json();
    const hourly = data.hourly;

    return hourly.time.slice(0, 24).map((time: string, index: number) => ({
      time: new Date(time),
      temperature: Math.round(hourly.temperature_2m[index]),
      precipitation: hourly.precipitation[index] || 0,
    }));
  }

  async getDailyForecast(latitude: number, longitude: number): Promise<DailyForecast[]> {
    const params = new URLSearchParams({
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      daily: 'temperature_2m_max,temperature_2m_min,precipitation_sum,weather_code',
      forecast_days: '7',
      timezone: 'auto',
    });

    const response = await fetch(`${WEATHER_API_BASE}/forecast?${params}`);
    if (!response.ok) throw new Error('Failed to fetch daily forecast');

    const data = await response.json();
    const daily = data.daily;

    return daily.time.map((date: string, index: number) => ({
      date: new Date(date),
      tempMax: Math.round(daily.temperature_2m_max[index]),
      tempMin: Math.round(daily.temperature_2m_min[index]),
      precipitationSum: daily.precipitation_sum[index] || 0,
      weatherCode: daily.weather_code[index],
    }));
  }
}
