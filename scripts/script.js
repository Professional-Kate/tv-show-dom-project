const getLocalEpisodes = function () {
  const allEpisodes = getAllEpisodes(); // returns an array of objects
  return constructEpisodes(allEpisodes);
};

// function for setting multiple attributes to an element
const setAttributes = function (element, attributes) {
  for (let key in attributes) {
    element.setAttribute(key, attributes[key]);
  }
};

// makes a new element based on parameters then returns that
const makeNewElement = (elementName, parent) =>
  parent.appendChild(document.createElement(elementName));

// construct an object with only the data I need with some added methods
class EpisodeCreator {
  constructor(title, episodeID, summary, image, link) {
    this.title = title; // episode title
    this.episodeID = episodeID; // eg: S01E03
    this.summary = summary; // episode summary
    this.image = image; // medium sized image
    this.link = link; // link to the episode on the API's website
    this.fullTitle = `${episodeID} - ${title}`; // used in the searchbar and dropdown

    // adds the episode to the DOM
    this.constructEpisode = function () {
      const getParentContainer = document.querySelector("#main-content"); // parent parent

      // making new elements and adding them to the DOM
      const newAnchorTag = makeNewElement("a", getParentContainer); // parent for the article
      const newArticleTag = makeNewElement("article", newAnchorTag); // parent for everything else
      const newHeaderTag = makeNewElement("header", newArticleTag);
      const newImgTag = makeNewElement("img", newArticleTag);

      // adding attributes to elements
      setAttributes(newAnchorTag, {
        class: "card",
        target: "_blank",
        href: this.link,
        id: this.episodeID,
      }); // anchor

      setAttributes(newArticleTag, { class: "card-text" }); // article

      setAttributes(newHeaderTag, { class: "card-header" }); // header
      newHeaderTag.innerHTML = `${this.title} <span class="episode-info">${this.episodeID}</span>`;

      setAttributes(newImgTag, {
        class: "card-image",
        src: this.image,
      }); // img

      // summary paragraph
      const shortenedSummary = this.summary.replace(/^(.{230}[^\s]*).*/, "$1"); // the replace uses regex to only cut text after 230 characters but doesn't cut a word in half

      shortenedSummary.length === this.summary.length
        ? (newArticleTag.innerHTML += shortenedSummary)
        : (newArticleTag.innerHTML += shortenedSummary + " ...");
    }; // checks if the shortenedSummary length is equal to the non mutated summary, if it is then the replace did nothing and we don't need to add the ellipsis

    // toggles the visibility of the episode
    this.hideEpisode = function (shouldHide) {
      if (shouldHide === false) {
        document.getElementById(this.episodeID).style = ""; // removing all added styles
      } else {
        document.getElementById(this.episodeID).style = "display: none"; // hiding the element by removing its display. This also takes the element out from the flow of the page
      }
    };

    this.constructEpisode(); // calling this function to construct the episodes on load
  }
}

// updates the amount of episodes showing
const updateSearchText = (episodeList, amount = episodeList.length) => {
  const getSearchBarText = document.querySelector("#episodes-shown");
  getSearchBarText.innerText = `Showing ${amount} of ${episodeList.length} episodes`;
};

// oninput event callback for the searchbar
const searchBar = function (episodeList) {
  // the amount of episodes shown on screen
  let episodesShown = 0;

  // getting the searchbar value from the DOM
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
      episodeList[episode].hideEpisode(false);
      episodesShown++; // only need to add because this variable is reset to 0 whenever this function runs
    } else {
      episodeList[episode].hideEpisode(true);
    }
    updateSearchText(episodeList, episodesShown);
  }
};

// adds options to the dropdown. This is ran on website load
const populateDropdown = function (episodeList) {
  const getDropdown = document.querySelector("#select-episode");
  for (episode in episodeList) {
    const newOption = makeNewElement("option", getDropdown); // for every episode make a new option
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

// forces passed numbers less than 10 to add a zero before it, so 9 becomes 09
const minTwoDigits = (number) => (number < 10 ? "0" : "") + number;

// constructs the individual objects for each episode based on the class above then return that new array
const constructEpisodes = (episodeList) =>
  episodeList.map(
    (episode) =>
      new EpisodeCreator(
        episode.name, // episode title
        `S${minTwoDigits(episode.season)}E${minTwoDigits(episode.number)}`, //SxxExx
        episode.summary, // episode description
        episode.image.medium, // episode image
        episode.url // link to external site
      )
  );

// first time setup also handles the whole episodes object and passing it around
window.onload = () => {
  const episodesObject = getLocalEpisodes();
  document
    .querySelector("#search-bar")
    .addEventListener("input", () => searchBar(episodesObject));

  updateSearchText(episodesObject); // running this at setup to update the showing text
  populateDropdown(episodesObject); // run this once to populate the list

  document.querySelector("#select-episode").addEventListener("change", () => {
    dropdownController(episodesObject);
  });
};
