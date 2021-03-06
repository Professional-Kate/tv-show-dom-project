/* API endpoints :

https://api.tvmaze.com/shows/82 - specific show via ID, Game of Thrones. 
https://api.tvmaze.com/shows/82/episodes - all episodes from a show via ID - Game of Thrones. Returns an array of objects. 

The /search/show endpoint can accept any string in the query. And is a fuzzy search so you can misspell and it will return anything with that string included

*/

// forces passed numbers less than 10 to add a zero before it, so 9 becomes 09
const minTwoDigits = (number) => (number < 10 ? "0" : "") + number;

// getting episodes from the TVMaze api using an episode ID
const getEpisodesFromID = (showID) => {
  console.log("TVMaze's API was called");

  fetch(`https://api.tvmaze.com/shows/${showID}/episodes`)
    .then(function (response) {
      if (response.ok) {
        return response.json();
      }
      throw `${response.status} ${response.statusText}`;
    })
    .then(function (data) {
      // this is how we remove the old show cards from the DOM and replace it with the new one
      const getParentContainer = document.querySelector("#page-container");
      getParentContainer.removeChild(document.querySelector("#main-content")); // removing the main card container

      const newMain = makeNewElement("main", getParentContainer);
      setAttributes(newMain, {
        id: "main-content",
      });

      // constructs the individual objects for each episode then returns that into the function
      helperFunction(
        data.map(
          (episode) =>
            // everything after the || is what the constructor will use if the key can't be found
            new CardCreator(
              "main-content",
              episode.name ||
                "This episode title couldn't be loaded at this time, sorry.", // episode title
              episode.summary ||
                "This episode summary couldn't be loaded at this time, sorry.", // episode description
              episode.rating.average || "?", // episode airdate
              episode.image || false, // episode image. The false can be anything but an object
              `S${minTwoDigits(episode.season)}E${minTwoDigits(
                episode.number || "S??E??"
              )}`,
              episode.url || "https://www.tvmaze.com/" // link to external site
            )
        )
      );
    })
    .catch(function (error) {
      console.log("An error occurred:", error);
    });
};
