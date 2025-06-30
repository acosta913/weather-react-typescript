import axios from "axios";
import type { SearchType } from "../types";
import { z } from "zod";
import { useMemo, useState } from "react";
// import { object, string, number, parse } from "valibot";

// TYPE GUARD o ASSERTION
// function isWeatherReponse(weather: unknown): weather is Weather {
//   return (
//     Boolean(weather) &&
//     typeof weather === "object" &&
//     typeof (weather as Weather).name === "string" &&
//     typeof (weather as Weather).main.temp === "number" &&
//     typeof (weather as Weather).main.temp_max === "number" &&
//     typeof (weather as Weather).main.temp_min === "number"
//   );
// }

// Zod
const Weather = z.object({
  name: z.string(),
  main: z.object({
    temp: z.number(),
    temp_max: z.number(),
    temp_min: z.number(),
  }),
});
export type Weather = z.infer<typeof Weather>;

// Valibot
// const WeatherSchema = object({
//   name: string(),
//   main: object({
//     temp: number(),
//     temp_max: number(),
//     temp_min: number(),
//   }),
// });
const intialState = {
  name: "",
  main: {
    temp: 0,
    temp_max: 0,
    temp_min: 0,
  },
};

export default function useWeather() {
  const [weather, setWeather] = useState(intialState);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const fetchWeather = async (search: SearchType) => {
    const appId = import.meta.env.VITE_API_KEY;
    const apiUrl = import.meta.env.VITE_API_URL_WEATHER;
    setLoading(true);
    setWeather(intialState);
    try {
      const geoUrl = `${apiUrl}geo/1.0/direct?q=${search.city},${search.country}&appid=${appId}`;
      const { data } = await axios(geoUrl);

      if (!data[0]) {
        setNotFound(true);
        return;
      }

      const lat = data[0].lat;
      const lon = data[0].lon;

      const weatherUrl = `${apiUrl}data/2.5/weather?lat=${lat}&lon=${lon}&appid=${appId}`;
      const { data: weatherResult } = await axios(weatherUrl);
      // TYPE GUARD o ASSERTION
      //   const result = isWeatherReponse(weatherResult);
      //   if (result) {
      //     console.log(weatherResult);
      //   } else {
      //     console.log("Respuesta mal formada");
      //   }

      // Zod
      const result = Weather.safeParse(weatherResult);
      if (result.success) {
        setWeather(result.data);
      } else {
        console.log("Respuesta mal formada");
      }

      // Valibot
      //   const result = parse(WeatherSchema, weatherResult);
      //   if (result) {
      //     console.log(result);
      //   }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const hasWeatherData = useMemo(() => weather.name, [weather]);

  return {
    weather,
    loading,
    notFound,
    fetchWeather,
    hasWeatherData,
  };
}
