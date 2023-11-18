import { GeoCoord } from "./fetchGeoCoord.js";
import fetch from "../include/fetch.js";
interface TemperatureReadingOuter {
  hourly: {time: string[], temperature_2m: number[]},
}

interface TemperatureReading {
  time: string[];
  temperature_2m: number[];
}

export function fetchCurrentTemperature(coords: GeoCoord): Promise<TemperatureReading> {
  // TODO
  const base = "https://220.maxkuechen.com/currentTemperature/forecast";
  const url = new URL(base);
  url.searchParams.append("latitude", coords.lat.toString());
  url.searchParams.append("longitude", coords.lon.toString());
  url.searchParams.append("hourly", "temperature_2m");
  url.searchParams.append("temperature_unit", "fahrenheit");
  console.log(url.toString())
  // https://220.maxkuechen.com/currentTemperature/forecast?latitude=___&longitude=___&hourly=temperature_2m&temperature_unit=fahrenheit
  return fetch(url.toString())
    .then(response => {
      if (!response.ok) {
        console.log("Response", response)
        throw new Error(`Error! Response not ok.Status: ${response.status}`);
      }
      console.log(response)
      return response.json();
    })
    .then((data: TemperatureReadingOuter) => {
      console.log("Before returning", data)
      const TemperatureReading = {time: data.hourly.time, temperature_2m: data.hourly.temperature_2m,
      }
      return TemperatureReading;
    })
  .catch(error => {
    console.error("Error fetching the url", error);
    throw error;
  });
}
// return new Promise(res => res({ time: [], temperature_2m: [] }));
