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

    let genresToLowerCase;

    // if it is undefined it means we are working with the episode array which doesn't have genres
    if (episodeList[episode].genres !== undefined) {
      genresToLowerCase = episodeList[episode].genres
        .map((genre) => genre.toLowerCase()) // converting each genre to lowerCase
        .some((genre) => genre.includes(getSearchBarValue)); // if any of the genres === true this will return true
    }

    if (titleIncludes || descriptionIncludes || genresToLowerCase) {
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

  searchBarOnInput(episodeList); // call the searchbar function to update the amount of episodes shown with the new searchbar value
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
  getShows.sort((first, second) =>
    first.name > second.name ? 1 : second.name > first.name ? -1 : 0
  ); // sorts the show array based on the title of each show

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
        show.genres || ["unknown"]
      )
  );

  populateEpisodeDropdown(showArray);
  document
    .querySelector("#search-bar")
    .addEventListener("input", () => searchBarOnInput(showArray));

  showArray.forEach((showCard) => {
    const getParentContainer = document.getElementById(`${showCard.episodeID}`);
    getParentContainer.classList.add("clickable"); // informs the user that they can click on the cards
    getParentContainer.addEventListener("click", function () {
      getEpisodesFromID(this.id); // "this" is relevant to the clicked card
      // hiding and showing elements when the card is clicked
      document.querySelector("#show-screen").style.display = "none"; // hiding the show cards
      document.querySelector("#first-header").style.display = "none"; // hiding the "select a show text"
      document.querySelector("#go-back-text").style.display = "initial"; // showing the go back button
      document.querySelector("#episodes-shown").style.display = "initial"; // showing the episodes shown text
      document.querySelector("#select-episode").style.display = "initial"; // showing the episode dropdown
    });
  });
};

// go back text onclick
const goBackText = function () {
  document.querySelector("#show-screen").style.display = "initial"; // showing the show cards
  document.querySelector("#first-header").style.display = "initial"; // showing the "select a show text"
  document.querySelector("#main-content").style.display = "none"; // hiding the episode cards. No need to remove them as it's already handled
  document.querySelector("#go-back-text").style.display = "none"; // hiding the go back button
  document.querySelector("#episodes-shown").style.display = "none"; // hiding the episodes shown text
  document.querySelector("#select-episode").style.display = "none"; // hiding the episode dropdown
};
