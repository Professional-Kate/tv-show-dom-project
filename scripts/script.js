const setup = function () {
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
    this.title = title;
    this.episodeID = episodeID;
    this.summary = summary;
    this.image = image;
    this.link = link;
    this.fullTitle = `${title} ${episodeID}`;

    // adds the episode to the DOM
    this.constructEpisode = function () {
      const getParentContainer = document.querySelector("#main-content"); // parent parent

      // making new elements and adding them to the DOM
      const newAnchorTag = makeNewElement("a", getParentContainer); // parent for the episode
      const newArticleTag = makeNewElement("article", newAnchorTag);
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

      newArticleTag.innerHTML += this.summary; // adding a p tag as the last child of article
    };

    // toggles the visibility of the episode
    this.hideEpisode = function (shouldHide) {
      if (shouldHide === false) {
        document.getElementById(this.episodeID).style = ""; // removing all added styles
      } else {
        document.getElementById(this.episodeID).style = "display: none"; // hiding the element by removing its display
      }
    };

    this.constructEpisode(); // calling this function to construct the episode on load
  }
}

// updates the amount of episodes showing
const updateSearchText = (amount, episodeList) => {
  const getSearchBarText = document.querySelector("#episodes-shown");
  getSearchBarText.innerText = `Showing ${amount} of ${episodeList.length} episodes`;
};

// logic for the searchbar
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
      episodesShown++;
    } else {
      episodeList[episode].hideEpisode(true);
    }
    updateSearchText(episodesShown, episodeList);
  }
};

// adds options to the dropdown
const populateDropdown = function (episodeList) {
  for (episode in episodeList) {
    const getDropdown = document.querySelector("#select-episode");
    const newOption = getDropdown.appendChild(document.createElement("option"));
    newOption.innerHTML = episodeList[episode].fullTitle;
    newOption.value = newOption.innerHTML;
  }
};

// function for getting the value of the selected option then updating the searchbar with that
const dropdownController = function (episodeList) {
  const getDropdown = document.querySelector("#select-episode");
  const getSearchBar = document.querySelector("#search-bar");

  getSearchBar.setAttribute("value", getDropdown.value);
  searchBar(episodeList);
};

// forces passed numbers less than 10 to add a zero before it, so 9 becomes 09
const minTwoDigits = (number) => (number < 10 ? "0" : "") + number;

// constructs the individual objects for each episode based on the class above
const constructEpisodes = function (episodeList) {
  const episodes = [];
  episodeList.forEach((episode) => {
    episodes.push(
      new EpisodeCreator(
        episode.name, // episode title
        `S${minTwoDigits(episode.season)}E${minTwoDigits(episode.number)}`, //SxxExx
        episode.summary, // episode description
        episode.image.medium, // episode image
        episode.url // link to external site
      )
    );
  });

  return episodes;
};

// first time setup also handles the whole episodes object and passing it around
window.onload = () => {
  const episodesObject = setup();
  document
    .querySelector("#search-bar")
    .addEventListener("input", () => searchBar(episodesObject));

  updateSearchText(episodesObject.length, episodesObject); // running this at setup to update the showing text
  populateDropdown(episodesObject); // run this once to populate the list

  document.querySelector("#select-episode").addEventListener("change", () => {
    dropdownController(episodesObject);
  });
};

// NEXT : dropdown. When selected move that value into the searchbar
