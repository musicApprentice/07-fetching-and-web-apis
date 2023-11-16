import fetch from "../include/fetch.js";

export interface GeoCoord {
  lat: number;
  lon: number;
}

interface fetchresult {
  lat: string;
  lon: string;
}

export function fetchGeoCoord(query: string): Promise<GeoCoord> {
  // TODO
  const base = 'https://220.maxkuechen.com/geoCoord/search'
  const url = new URL(base)
  url.searchParams.append('q', query)
  
  return fetch(url.toString())
    .then(response => {
      if (!response.ok) {
        throw new Error(`Error! Status:${response.status}`)
      }  //response.status < 200 && response.status > 299 means valid, otherwise is not  ok (200 -299)
      return response.json()
    })
    .then((data:fetchresult[]) => {
      if (!Array.isArray(data) || data.length === 0) {
        throw new Error('No results found for query.')
      }
      const result:fetchresult = data[0]
      return {
        lat: Number.parseFloat(result.lat),
        lon: Number.parseFloat(result.lon)
      }
    })
    .catch(error => {
      console.error("Error fetching the url", error)
      throw error
    })
}
//return new Promise(res => res({ lat: NaN, lon: NaN }));