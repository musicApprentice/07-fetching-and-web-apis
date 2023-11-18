import fetch from "../include/fetch.js";

export function fetchUniversities(query: string): Promise<string[]> {
  // TODO
  const base = 'https://220.maxkuechen.com/universities/search'
  const url = new URL(base)
  url.searchParams.append('name', name)

  return fetch(rurl.toString())
    .then(response => {
      if (!response.ok) {
        throw new Error(`Error! Status:${response.status}`)
      }
      return response.json()
    })
    .then((data: string[]) => {
      if (!Array.isArray(data) || data.length === 0) {
        throw new Error("No results found.")
      }
      return data.map((university: string) => university.name);
    })
    .catch(error => {
      console.error("Error fetching the url", error)
      throw error
    })
  // return new Promise(res => res([]));
}
