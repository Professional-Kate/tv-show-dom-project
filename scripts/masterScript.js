const getEpisodeFromAPI = function () {
  getEpisodesFromID(379); // returns an array of objects
};

// updates the amount of episodes showing
const updateSearchText = (episodeList, amount = episodeList.length) => {
  const getEpisodesShown = document.querySelector("#episodes-shown");
  getEpisodesShown.innerText = `Showing ${amount} of ${episodeList.length} episodes`;
};

// oninput event callback for the searchbar
const searchBar = function (episodeList) {
  // the amount of episodes shown on screen
  let episodesShown = 0;

  // getting the searchbar value from the DOM to lowercase
  const getSearchBarValue = document
    .querySelector("#search-bar")
    .value.toLowerCase();

  // for every object in the array of objects
  for (episode in episodeList) {
    const titleIncludes = episodeList[episode].fullTitle
      .toLowerCase()
      .includes(getSearchBarValue);
    // checking the value in the object if the description includes the users entered text
    const descriptionIncludes = episodeList[episode].summary
      .toLowerCase()
      .includes(getSearchBarValue);

    if (titleIncludes || descriptionIncludes) {
      episodeList[episode].hideCard(false);
      episodesShown++; // only need to add because this variable is reset to 0 whenever this function runs
    } else {
      episodeList[episode].hideCard(true);
    }
  }
  updateSearchText(episodeList, episodesShown);
};

// adds options to the dropdown. This is ran on website load
const populateDropdown = function (episodeList) {
  const getDropdown = document.querySelector("#select-episode");
  for (episode in episodeList) {
    const newOption = getDropdown.appendChild(document.createElement("option")); // for every episode make a new option
    newOption.innerHTML = episodeList[episode].fullTitle; // set the text of it to be the fullTitle
    newOption.value = newOption.innerHTML; // setting the value of that new dropdown
  }
};

// onchange event callback for the dropdown menu
const dropdownController = function (episodeList) {
  document.querySelector("#search-bar").value =
    document.querySelector("#select-episode").value; // setting the value of the searchbar using the drop downs selected value

  searchBar(episodeList); // call the searchbar function to update the amount of episodes shown with the new searchbar value
};

// first time setup also handles the whole episodes object and passing it around
const masterFunction = function (episodeArray) {
  document
    .querySelector("#search-bar")
    .addEventListener("input", () => searchBar(episodeArray));

  updateSearchText(episodeArray); // running this at setup to update the showing text
  populateDropdown(episodeArray); // run this once to populate the list

  document.querySelector("#select-episode").addEventListener("change", () => {
    dropdownController(episodeArray);
  });
};

const data = "local"; // "live" - grabbing from the API, will make an API call. "Local" - using the local data in episodes.js meaning no API call

if (data === "live") {
  console.log("Using live data...");
  getEpisodeFromAPI();
} else {
  console.log("Using local data...");
  const episodesList = getAllEpisodes();
  const episodeArray = episodesList.map(
    (episode) =>
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
  );
  masterFunction(episodeArray);
}
