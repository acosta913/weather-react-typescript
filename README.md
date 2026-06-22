# Weather Finder

[Español](./README.es.md)

A small single-page application that looks up the current weather for any city, built with React 19, TypeScript and Vite. The user picks a country, types a city, and the app talks to the OpenWeatherMap API to return the current temperature plus the daily minimum and maximum.

I built this project to practice strongly-typed React: custom hooks, controlled forms, runtime validation of third-party data, and a clean separation between UI components and data-fetching logic.

## What it does

1. The user selects a country from a dropdown and writes a city name.
2. On submit, the app calls OpenWeatherMap's geocoding endpoint to translate the `(city, country)` pair into geographic coordinates.
3. With those coordinates it calls the weather endpoint and renders the result.
4. The API response is validated at runtime with a Zod schema before it ever reaches the UI, so a malformed payload never breaks the render.

The interface handles four visible states: idle, loading (spinner), data ready, and "city not found".

## Tech stack

- **React 19** with the new JSX runtime
- **TypeScript** in strict mode
- **Vite 7** with the SWC plugin for fast HMR
- **Axios** for HTTP calls
- **Zod** for runtime schema validation of the API response
- **CSS Modules** for scoped styling, one file per component
- **ESLint** (flat config) with the React Hooks and React Refresh plugins

## Getting started

### Prerequisites

- Node.js 18 or newer
- An OpenWeatherMap API key (free tier works): https://openweathermap.org/api

### Installation

```bash
git clone <repository-url>
cd weather-react-typescript-main
npm install
```

### Environment variables

Create a `.env.local` file at the project root:

```env
VITE_API_KEY=your_openweathermap_api_key
VITE_API_URL_WEATHER=https://api.openweathermap.org/
```

The trailing slash on `VITE_API_URL_WEATHER` is required because the hook concatenates the endpoint paths directly.

### Run

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

## Available scripts

| Script            | What it does                                                  |
| ----------------- | ------------------------------------------------------------- |
| `npm run dev`     | Start the Vite dev server with hot reload                     |
| `npm run build`   | Type-check the project (`tsc -b`) and produce a static bundle |
| `npm run preview` | Serve the production build locally                            |
| `npm run lint`    | Run ESLint over the codebase                                  |

## Project structure

```
src/
├── components/
│   ├── Alert/          Inline error / validation message
│   ├── Form/           Country + city form, controlled inputs
│   ├── Spinner/        Loading indicator
│   └── WeatherDetail/  Renders the parsed weather data
├── data/
│   └── countries.ts    Static ISO 3166-1 country list used in the <select>
├── hooks/
│   └── useWeather.ts   Owns all data state and the fetch logic
├── types/
│   └── index.ts        Shared TypeScript types
├── utils/
│   └── index.ts        Kelvin → Celsius conversion
├── App.tsx             Composes the components based on hook state
└── main.tsx            App entry point
```

## Implementation notes

**Custom hook for data.** All of the asynchronous logic, loading flags and validation live inside `useWeather`. The components stay declarative: they receive the action and the derived flags, and decide what to render. This makes the UI easy to read and the hook easy to test or swap.

**Runtime validation.** TypeScript types are erased at runtime, so they cannot protect the app from an unexpected response. The hook defines a Zod schema for the weather payload and uses `safeParse` before committing anything to state. The file also keeps two commented-out alternatives (a hand-written type guard and a Valibot schema) as a record of the trade-offs I considered.

**Two-step API call.** The geocoding endpoint is queried first; if it returns an empty array the `notFound` flag is raised and the second call is skipped, so the user gets immediate feedback for misspelled cities without wasting a request.

**Temperature handling.** OpenWeatherMap returns Kelvin. A single `formatTemperature` helper converts to integer Celsius, and every temperature in the UI is rendered through it.

## Possible next steps

- Persist the last successful search in `localStorage`.
- Add a unit toggle (Celsius / Fahrenheit).
- Show the weather icon and a short description from the API response.
- Add Vitest + React Testing Library coverage for the hook and the form.

## Author

**Bryan Acosta**

If you are reviewing this project as part of a hiring process and want to discuss the decisions behind it, I am happy to walk through the code.

## License

Released for portfolio and learning purposes. Feel free to fork it and adapt it.
