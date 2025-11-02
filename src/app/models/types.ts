export interface Place {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string;
  timezone?: string;
}

export interface CurrentWeather {
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  weatherCode: number;
  condition: string;
  icon: string;
  lastUpdated: Date;
}

export interface HourlyForecast {
  time: Date;
  temperature: number;
  precipitation: number;
}

export interface DailyForecast {
  date: Date;
  tempMax: number;
  tempMin: number;
  precipitationSum: number;
  weatherCode: number;
}

export interface WorldTime {
  datetime: string;
  timezone: string;
  utcOffset: string;
}

export interface Favorite {
  id: string;
  place: Place;
  addedAt: Date;
}
