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
const getEpisodesFromID = (id) => {
  console.log("API was called");

  fetch(`https://api.tvmaze.com/shows/${id}/episodes`)
    .then(function (response) {
      if (response.ok) {
        return response.json();
      }
      throw `${response.status} ${response.statusText}`;
    })
    .then(function (data) {
      // constructs the individual objects for each episode based on the class above then return that new array
      masterFunction(
        data.map(
          (episode) =>
            new EpisodeCardCreator(
              episode.name, // episode title
              `S${minTwoDigits(episode.season)}E${minTwoDigits(
                episode.number
              )}`, //SxxExx
              episode.summary, // episode description
              episode.image.medium, // episode image
              episode.url // link to external site
            )
        )
      );
    })
    .catch(function (error) {
      console.log("An error occurred:", error);
    });
};
