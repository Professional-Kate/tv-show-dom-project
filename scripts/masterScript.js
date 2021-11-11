// updates the amount of episodes showing
const updateSearchText = (episodeList, amount = episodeList.length) => {
  const getEpisodesShown = document.querySelector("#episodes-shown");
  getEpisodesShown.innerText = `Showing ${amount} of ${episodeList.length} episodes`;
};

// oninput event callback for the searchbar
const searchBarOnInput = function (episodeList) {
  // the amount of episodes shown on screen
  let episodesShown = 0;

  // getting the OnInput value from the DOM to lowercase
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
const populateEpisodeDropdown = function (episodeList) {
  const getDropdown = document.querySelector("#select-episode");
  getDropdown.innerHTML = `<option value="" selected disabled hidden>Select an episode...</option>`;

  for (episode in episodeList) {
    const newOption = makeNewElement("option", getDropdown); // for every episode make a new option
    newOption.innerHTML = episodeList[episode].fullTitle; // set the text of it to be the fullTitle
    newOption.value = newOption.innerHTML; // setting the value of that new dropdown
  }
};

// onchange event callback for the dropdown menu
const episodeDropdownOnChange = function (episodeList) {
  document.querySelector("#search-bar").value =
    document.querySelector("#select-episode").value; // setting the value of the searchbar using the drop downs selected value

  searchBarOnInput(episodeList); // call the searchbar function to update the amount of episodes shown with the new searchbar value
};

// eventListener for onChange for the show dropdown
const showDropdownOnChange = function () {
  const getShowDropdown = document.querySelector("#select-show"); // getting the dropdown element from the DOM
  const getShowHeader = document.querySelector("#first-header"); // getting the h1 element from the DOM

  getShowHeader.innerText =
    getShowDropdown.options[getShowDropdown.selectedIndex].text; // setting the header text to the selected options text

  getEpisodesFromID(getShowDropdown.value); // calling the API with the value from the dropdown
};

// populates the show dropdown based on the local shows script. That script returns an array of objects
const populateShowDropdown = function (allShows) {
  const getShowDropdown = document.querySelector("#select-show"); // getting the dropdown element from the DOM

  allShows
    .sort((first, second) =>
      first.name > second.name ? 1 : second.name > first.name ? -1 : 0
    ) // sort that mapped array based on the shows title
    .map((show) => ({ name: show.name, id: show.id })); // make an array of objects with values of the show title and ID

  allShows.forEach((show) => {
    // creating an option element and adding it to the dom
    const newOption = makeNewElement("option", getShowDropdown);
    newOption.innerText = show.name;
    newOption.value = show.id;
  });
};

// handles the whole episodes object and passing it around. Also adds event listeners
const helperFunction = function (episodeArray) {
  // grabbing elements from the dom
  const getSearchBar = document.querySelector("#search-bar");
  const getSelectEpisode = document.querySelector("#select-episode");

  getSearchBar.addEventListener("input", () => searchBarOnInput(episodeArray));

  updateSearchText(episodeArray); // running this at setup to update the showing text
  populateEpisodeDropdown(episodeArray); // run this once to populate the list

  getSelectEpisode.addEventListener("change", () => {
    episodeDropdownOnChange(episodeArray);
  });
};

// handles loading all the shows from the local script
window.onload = () => {
  const getShows = getAllShows();
  const showArray = getShows.map(
    (show) =>
      new CardCreator(
        "show-cards",
        show.name || "This show name couldn't be loaded",
        show.summary || "This show summary couldn't be loaded",
        show.rating.average || "?",
        show.url || "https://www.tvmaze.com/",
        show.image || false,
        show.id || "?"
      )
  );

  showArray.forEach((showCard) => {
    const getParentContainer = document.getElementById(`${showCard.episodeID}`);
    getParentContainer.style.cursor = "pointer"; // tells the user that they can click on the card
    getParentContainer.addEventListener("click", function () {
      getEpisodesFromID(this.id); // this is relevant to the clicked card
      const getShowContainer = document.querySelector("#show-screen");
      getShowContainer.style.display = "none"; // hiding the show cards last to load all the others first
    });
  });
};

const useLiveData = true; // true - grabbing from the API, will make an API call. false - using the local data in episodes.js meaning no API call

if (useLiveData === false) {
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
        episode.image ||
          "https://pbs.twimg.com/media/E1Tm_QnWQAAY5LT?format=jpg&name=large", // episode image
        episode.url || "https://www.tvmaze.com/" // link to external site
      )
  );
  helperFunction(episodeArray);
}
