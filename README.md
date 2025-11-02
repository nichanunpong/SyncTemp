# WeatherZone - Weather & Time Zones

A modern Angular application for viewing real-time weather forecasts and time zone information for cities worldwide. Built with Angular, TypeScript, and Tailwind CSS.

## Features

- 🌍 **City Search** - Search for any city worldwide with autocomplete
- 🌤️ **Current Weather** - View current conditions, temperature, humidity, and wind speed
- 📅 **7-Day Forecast** - See extended weather forecasts
- 📊 **24-Hour Chart** - Visualize hourly temperature trends
- ⏰ **Time Zones** - Display local time and UTC offset for any location
- ⭐ **Favorites** - Save your favorite cities for quick access
- 📍 **Geolocation** - Get weather for your current location
- 🌓 **Dark Mode** - Toggle between light and dark themes
- 🌡️ **Unit Toggle** - Switch between Celsius/Fahrenheit and km/h/mph

## Tech Stack

- **Framework**: Angular 20
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **APIs**:
  - Open-Meteo API (Weather data)
  - WorldTimeAPI (Time zone data)
  - Open-Meteo Geocoding API (City search)

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <your-repo-url>
cd time-and-temp
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm start
# or
ng serve
```

4. Open your browser and navigate to `http://localhost:4200/`

## Building for Production

To build the project for production:

```bash
npm run build
# or
ng build
```

The build artifacts will be stored in the `dist/time-and-temp/` directory.

## Deployment

### Deploy to GitHub Pages

1. Build the project:

```bash
ng build --base-href=/<repository-name>/
```

2. Install `angular-cli-ghpages`:

```bash
npm install -g angular-cli-ghpages
```

3. Deploy:

```bash
npx angular-cli-ghpages --dir=dist/time-and-temp/browser
```

### Deploy to Netlify

1. Build the project:

```bash
ng build
```

2. Deploy the `dist/time-and-temp/browser` folder to Netlify

### Deploy to Vercel

1. Install Vercel CLI:

```bash
npm i -g vercel
```

2. Deploy:

```bash
vercel
```

## Project Structure

```
src/
├── app/
│   ├── components/      # Reusable UI components
│   ├── pages/           # Page components
│   ├── services/        # Angular services (API calls, state management)
│   ├── models/          # TypeScript interfaces/types
│   └── utils/           # Utility functions
├── styles.css           # Global styles and Tailwind imports
└── index.html           # Main HTML file
```

## Development

### Code scaffolding

Generate a new component:

```bash
ng generate component component-name
```

Generate a new service:

```bash
ng generate service service-name
```

### Running tests

```bash
ng test
```

## License

This project is open source and available under the MIT License.

## Acknowledgments

- Weather data provided by [Open-Meteo](https://open-meteo.com/)
- Time zone data provided by [WorldTimeAPI](http://worldtimeapi.org/)
