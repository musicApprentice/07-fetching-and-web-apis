import assert from "assert";
import { fetchUniversities } from "./fetchUniversities.js";

describe("fetchUniversities", () => {
  it("follows type specification", () => {
    const promise = fetchUniversities("University of Massachusetts at Amherst");

    return promise.then(result => {
      assert(Array.isArray(result)); // Assert the result in an array
      assert(result.every(x => typeof x === "string")); // Assert each element in the array is a string
    });
  });

  it("handles empty result", () => {
    const promise = fetchUniversities("Nonexistent University");

    return promise.then(result => {
      assert(Array.isArray(result));
      assert.strictEqual(result.length, 0);
    });
  });

  it("hundles multiple results", () => {
    const promise = fetchUniversities("Amherst");

    return promise.then(result => {
      assert(Array.isArray(result));
      assert(result.length > 1);
    });
  });

  it("handles special characters", () => {
    const promise = fetchUniversities("Boston University");
    return promise.then(result => {
      assert(Array.isArray(result));
      assert(result.length > 0);
    });
  });
});
