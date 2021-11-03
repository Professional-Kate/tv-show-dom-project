/* API endpoints :

https://api.tvmaze.com/shows/82 - specific show via ID, Game of Thrones. 
https://api.tvmaze.com/shows/82/episodes - all episodes from a show via ID - Game of Thrones. Returns an array of objects. 

The id we can get from the /search/show endpoint
https://api.tvmaze.com/search/shows?q=game%20of%20thrones

The /search/show endpoint can accept any string in the query. And is a fuzzy search so you can misspell and it will return anything with that string included

*/

// forces passed numbers less than 10 to add a zero before it, so 9 becomes 09
const minTwoDigits = (number) => (number < 10 ? "0" : "") + number;

// getting episodes from the TVMaze api using an episode ID
const getEpisodesFromID = (showID) => {
  console.log("API was called");

  fetch(`https://api.tvmaze.com/shows/${showID}/episodes`)
    .then(function (response) {
      if (response.ok) {
        return response.json();
      }
      throw `${response.status} ${response.statusText}`;
    })
    .then(function (data) {
      // constructs the individual objects for each episode then returns that into the function
      masterFunction(
        data.map(
          (episode) =>
            // everything after the || is what the constructor will use if the key can't be found
            new EpisodeCardCreator(
              episode.name ||
                "This episode title couldn't be loaded at this time, sorry.", // episode title
              `S${minTwoDigits(episode.season)}E${minTwoDigits(
                episode.number || "S01E01"
              )}`, //SxxExx
              episode.summary ||
                "This episode summary couldn't be loaded at this time, sorry.", // episode description
              episode.image || "", // episode image
              episode.url || "https://www.tvmaze.com/" // link to external site
            )
        )
      );
    })
    .catch(function (error) {
      console.log("An error occurred:", error);
    });
};
