// import fetch from "../include/fetch.js";

// // TODO - Now its your turn to make the working example! :)


/*
It uses fetch to make HTTP requests and readline for command-line interactions.  
 Main. ts contains two main functions: fetchJokes and promptForJokeOption. 
 fetchJokes asynchronously fetches jokes from the API, 
 handling both single and multiple joke requests with error handling. 
 promptForJokeOption interacts with the user, 
 asking user to choose between a random joke, ten jokes, or to exit.  
 It console.log fetched jokes and re-prompts the user based on their input. 
This cycle continues until the user exits.
*/

import fetch from 'node-fetch';
import readline from 'readline';
import assert from 'assert'

interface Joke {
  id: number;
  type: string;
  setup: string;
  punchline: string;
}

const rl = readline.createInterface({
  input: process.stdin, //the interface will read the data that the user types in the command line.
  output: process.stdout //the interface will write data to the command line, allowing it to display text to the user.
});

async function fetchJokes(isSingleJoke: boolean): Promise<Joke[]> {
  const endpoint = isSingleJoke ? 'random' : 'ten';
  const url = `https://official-joke-api.appspot.com/jokes/programming/${endpoint}`;

  try {
    const response = await fetch(url);
    const jokes = await response.json() as Joke[];
    return jokes instanceof Array ? jokes : [jokes]; // Ensure result is always an array, easier to deal with result
  } catch (error) {
    console.error('Error fetching jokes:', error);
    throw error;
  }
}
function promptForJokeOption() {
  rl.question('Do you want a "random" joke or "ten" jokes? Type "exit" to quit: ', (option) => {
    if (option.toLowerCase() === 'exit') {
      rl.close();
    }
    else if (option.toLowerCase() === 'random' || option.toLowerCase() === 'ten') {
      const isSingleJoke = option.toLowerCase() === 'random';
      fetchJokes(isSingleJoke)
        .then(jokes => {
          assert(Array.isArray(jokes))
          jokes.forEach((joke, index) => {
            console.log(`Joke ${index + 1}: (id: ${joke.id}) ${joke.setup} - ${joke.punchline}`);
          });
          promptForJokeOption(); // Ask again
        })
        .catch(error => {
          console.error('Failed to fetch jokes.');
          promptForJokeOption(); // Ask again in case of an error
        });
    }
    else {
      console.log('Please enter "random", "ten", or "exit".');
      promptForJokeOption(); // Retry for valid input
    }
  });
}
promptForJokeOption();