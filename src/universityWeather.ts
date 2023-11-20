import { fetchGeoCoord } from "./fetchGeoCoord.js";
import { fetchUniversities } from "./fetchUniversities";
import { fetchCurrentTemperature } from "./fetchCurrentTemperature.js";
interface AverageTemperatureResults {
  totalAverage: number;
  [key: string]: number;
}
interface TemperatureResults {
  [key: string]: number;
}

// 1.get university's name list first
// 2.check if have transformName, if do, apply it
// 3.get coord list
// 4.get temp list, calculate ave with the temp list 2d array
function calAve(tem: number[]) {
  const total = tem.reduce((acc, cur) => acc + cur, 0);
  return total / tem.length;
}

export function fetchUniversityWeather(
  universityQuery: string,
  transformName?: (s: string) => string
): Promise<AverageTemperatureResults> {
  // TODO
  return fetchUniversities(universityQuery).then(university => {
    if (university.length === 0) { //check if the result from fetchUniversities is valid 
      new Error("No results found for query.");
    }
    const newName = transformName ? university.map(transformName) : university; //change name if have a transformName callback function
    const coordPromise = newName.map(name => fetchGeoCoord(name)); // get coord list
    return Promise.all(coordPromise)  // make sure all promise inside coordPromise is fulfilled
      .then(coord => {
        const tempPromise = coord.map(coor => fetchCurrentTemperature(coor)); // get tempture for each coord
        return Promise.all(tempPromise);// make sure all fulfilled
      })
      /*{
        totalAverage: 50,
        "University One": 60,
        "University Two": 40,
        "University Three": 50
      } */
      .then(tempArr => {
        let totalAve = 0;
        const resultOfUniversity: TemperatureResults = {}; // store average temp of each university
        tempArr.forEach((hourly, index) => {
          const ave = calAve(hourly.temperature_2m);
          totalAve += ave;
          resultOfUniversity[university[index]] = ave; // set each univerty's temp, looks like this:  "University Three": 50
        });
        const finalAve = totalAve / tempArr.length; // total ave
        const finalResult: AverageTemperatureResults = { totalAverage: finalAve };
        for (const ele in resultOfUniversity) {
          finalResult[ele] = resultOfUniversity[ele]; // combine two obj
        }
        return finalResult;
      });
  });
}
// return new Promise(res => res({ totalAverage: NaN }));



//The university name in the coordinate database differs from the name in the university database. This can happen in other cases too.
export function fetchUMassWeather(): Promise<AverageTemperatureResults> {
  // TODO
  return fetchUniversityWeather("University of Massachusetts", (name: string) => name.replace("at", ""));
}

export function fetchUCalWeather(): Promise<AverageTemperatureResults> {
  // TODO
  return fetchUniversityWeather("University of California", (name: string) => name.replace("at", ""));
}
