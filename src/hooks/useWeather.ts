import axios from "axios";
import type { SearchType, Weather } from "../types";

// TYPE GUARD o ASSERTION
function isWeatherReponse(weather: unknown): weather is Weather {
  return (
    Boolean(weather) &&
    typeof weather === "object" &&
    typeof (weather as Weather).name === "string" &&
    typeof (weather as Weather).main.temp === "number" &&
    typeof (weather as Weather).main.temp_max === "number" &&
    typeof (weather as Weather).main.temp_min === "number"
  );
}

export default function useWeather() {
  const fetchWeather = async (search: SearchType) => {
    const appId = import.meta.env.VITE_API_KEY;
    const apiUrl = import.meta.env.VITE_API_URL_WEATHER;
    try {
      const geoUrl = `${apiUrl}geo/1.0/direct?q=${search.city},${search.country}&appid=${appId}`;
      const { data } = await axios(geoUrl);
      console.log(data);

      const lat = data[0].lat;
      const lon = data[0].lon;

      const weatherUrl = `${apiUrl}data/2.5/weather?lat=${lat}&lon=${lon}&appid=${appId}`;
      const { data: weatherResult } = await axios(weatherUrl);
      const result = isWeatherReponse(weatherResult);
      if (result) {
        console.log(weatherResult);
      } else {
        console.log("Respuesta mal formada");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return {
    fetchWeather,
  };
}
