// updates the amount of episodes showing
const updateSearchText = (type, episodeList, amount = episodeList.length) => {
  const getEpisodesShown = document.querySelector("#episodes-shown");
  getEpisodesShown.innerText = `Found ${amount} of ${episodeList.length} ${type}`;
};

// oninput event callback for the searchbar. type typeof === string : shows || episodes
const searchBarOnInput = function (type, episodeList, value) {
  // the amount of episodes shown on screen
  let episodesShown = 0;

  // for every object in the array of objects
  for (episode in episodeList) {
    const titleIncludes = episodeList[episode].fullTitle
      .toLowerCase()
      .includes(value);
    // checking the value in the object if the description includes the users entered text
    const descriptionIncludes = episodeList[episode].summary
      .toLowerCase()
      .includes(value);

    let genresInclude;

    // if it is undefined it means we are working with the episode array which doesn't have genres
    if (episodeList[episode].genres !== undefined) {
      genresInclude = episodeList[episode].genres
        .map((genre) => genre.toLowerCase()) // converting each genre to lowerCase
        .some((genre) => genre.includes(value)); // if any of the genres === true this will return true
    }

    if (titleIncludes || descriptionIncludes || genresInclude) {
      episodeList[episode].hideCard(false);
      episodesShown++; // only need to add because this variable is reset to 0 whenever this function runs
    } else {
      episodeList[episode].hideCard(true);
    }
  }
  updateSearchText(type, episodeList, episodesShown);
};

// adds options to the dropdown. This is ran on website load
const populateEpisodeDropdown = function (episodeList) {
  const getDropdown = document.querySelector("#select-episode");
  getDropdown.innerHTML = `<option value="" selected disabled hidden>Select...</option>`;

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

  searchBarOnInput(
    "episodes",
    episodeList,
    document.querySelector("#search-bar").value.toLowerCase()
  ); // call the searchbar function to update the amount of episodes shown with the new searchbar value
};

const recreateSearchBar = function (array) {
  let getSearchBar = document.querySelector("#search-bar");
  const getParent = document.querySelector("#search-bar-container");
  getParent.removeChild(getSearchBar);
  getSearchBar = makeNewElement("input", getParent, "search-bar");
  setAttributes(getSearchBar, { type: "search", placeholder: "Search..." });

  getSearchBar.addEventListener("input", function () {
    searchBarOnInput(
      "episodes",
      array,
      document.querySelector("#search-bar").value.toLowerCase()
    );
  });
};

const showSearch = function (array) {
  searchBarOnInput(
    "shows",
    array,
    document.querySelector("#show-search").value.toLowerCase()
  );
};

// handles the whole episodes object and passing it around. Also adds event listeners
const helperFunction = function (episodeArray) {
  // grabbing elements from the dom
  const getSelectEpisode = document.querySelector("#select-episode");

  recreateSearchBar(episodeArray);

  updateSearchText("episodes", episodeArray); // running this at setup to update the showing text
  populateEpisodeDropdown(episodeArray); // run this once to populate the list

  getSelectEpisode.addEventListener("change", () => {
    episodeDropdownOnChange(episodeArray);
  });
};

// take in an object with elements ID : boolean. Where the boolean is if the element should be hidden
const shouldHideElements = function (object) {
  for (let elementID in object) {
    const getElement = document.getElementById(elementID);
    if (object[elementID]) {
      getElement.style.display = "none";
    } else {
      getElement.style.display = "initial";
    }
  }
};

// handles loading all the shows from the local script
window.onload = () => {
  const getShows = getAllShows();
  getShows.sort((first, second) =>
    first.name > second.name ? 1 : second.name > first.name ? -1 : 0
  ); // sorts the show array based on the title of each show

  updateSearchText("shows", getShows);

  let showArray = getShows.map(
    (show) =>
      new CardCreator(
        "show-cards",
        show.name || "This show name couldn't be loaded",
        show.summary || "This show summary couldn't be loaded",
        show.rating.average || "?",
        show.image || false,
        show.id || "?",
        false, // should be a URL but I don't use that for the show cards
        show.genres, // array of genres which we join in the constructor
        show.status || "Ended", // if the show has ended or is running
        show.runtime || "60 minutes" // show runtime
      )
  );

  document
    .querySelector("#show-search")
    .addEventListener("input", () => showSearch(showArray));

  showArray.forEach((showCard) => {
    const getParentContainer = document.getElementById(`${showCard.episodeID}`);
    getParentContainer.classList.add("clickable"); // informs the user that they can click on the cards
    getParentContainer.addEventListener("click", function () {
      getEpisodesFromID(this.id); // "this" is relevant to the clicked card
      // hiding and showing elements when the card is clicked

      shouldHideElements({
        "show-screen": true,
        "first-header": true,
        "go-back-text": false,
        "select-episode": false,
        "show-search": true,
        "search-bar": false,
      });
    });
  });
};

// go back text onclick
const goBackText = function () {
  shouldHideElements({
    "show-screen": false,
    "first-header": false,
    "main-content": true,
    "go-back-text": true,
    "select-episode": true,
    "show-search": false,
    "search-bar": true,
  });
};
