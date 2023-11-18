import fetch from "../include/fetch.js";

interface universities {
  name: string;
}
export function fetchUniversities(query: string): Promise<string[]> {
  // TODO
  const base = "https://220.maxkuechen.com/universities/search";
  const url = new URL(base);
  url.searchParams.append("name", query);

  return fetch(url.toString())
    .then(response => {
      if (!response.ok) {
        throw new Error(`Error! Status:${response.status}`);
      }
      return response.json();
    })
    .then((data: universities[]) => {
      if (!Array.isArray(data)) {
        throw new Error("Error! Not in array form");
      }
      const nameArray = data.map(x => x.name);
      return nameArray;
      // return data.map((university: string) => university.name);
    })
    .catch(error => {
      console.error("Error fetching the url", error);
      throw error;
    });
  // return new Promise(res => res([]));
}
