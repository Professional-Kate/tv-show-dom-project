// grab all the episodes from the other script and assign that in a variable
const setup = function () {
  const allEpisodes = getAllEpisodes(); // returns an array
  drawEpisodes(allEpisodes);
};

// function made for setting a lot of attributes easily and quick
const setAttributes = function (element, attributes) {
  for (let key in attributes) {
    element.setAttribute(key, attributes[key]);
  }
};

// forces passed numbers less than 10 to add a zero before it, so 9 becomes 09
const minTwoDigits = (number) => (number < 10 ? "0" : "") + number;

const episodes = [];

// draws episodes on screen
const drawEpisodes = function (episodeList) {
  // grabbing the root container we need
  const getMainContentElement = document.querySelector("#main-content");

  episodeList.forEach((episode, index) => {
    // making parent containers and adding them to the DOM
    const newAnchorTag = getMainContentElement.appendChild(
      document.createElement("a")
    );

    const uniqueId = (newAnchorTag.id = `card-${index}`); // adding a unique ID to each card

    const newArticleTag = newAnchorTag.appendChild(
      document.createElement("article")
    );

    // making children of the parents and adding them to the DOM

    const newHeaderTag = newArticleTag.appendChild(
      document.createElement("h2")
    );
    const newImgTag = newArticleTag.appendChild(document.createElement("img"));
    const newPTag = newArticleTag.appendChild(document.createElement("p"));

    // adding attributes to our elements

    // article tag
    setAttributes(newArticleTag, { class: "card-text" });

    // anchor tag
    setAttributes(newAnchorTag, {
      class: "card",
      target: "_blank",
      href: episode.url,
    });

    // h2 tag
    setAttributes(newHeaderTag, { class: "card-header" });
    newHeaderTag.innerHTML = `${
      episode.name
    } <span class="episode-info">S${minTwoDigits(
      episode.season
    )}E${minTwoDigits(episode.number)}</span>`;

    // img tag
    setAttributes(newImgTag, {
      class: "card-image",
      src: episode.image.medium,
    });

    // p tag
    newPTag.innerText = episode.summary.replace(/<\/?[^>]+(>|$)/g, ""); // replace all tags with an empty string. This is because the API has extra <p></p> and </br> tags

    //
    episodes.push({
      [uniqueId]: {
        description: newArticleTag.lastChild.innerText,
        title: newHeaderTag.innerText.slice(0, -7), //removing the season and episode number from the end of the title
      },
    });
  });
};

// updates the searchbar text to show the amount of episodes being shown
const updateSearchText = (amount) => {
  const getSearchBarText = document.querySelector("#episodes-shown");
  getSearchBarText.innerText = `Showing ${amount} of ${episodes.length} episodes`;
};

// function for the searchbar, handles hiding and showing of cards when the user enters text into the searchbar
const searchBar = function () {
  // getting the elements we need
  const getSearchBar = document.querySelector("#search-bar");

  let drawnEpisodes = 0; // keeping track of the amount of shows drawn on page
  episodes.forEach((episode, index) => {
    // checking the value in the object if the title includes the users entered text
    const titleIncludes = episode[`card-${index}`].title
      .toLowerCase()
      .includes(getSearchBar.value.toLowerCase());
    // checking the value in the object if the description includes the users entered text
    const descriptionIncludes = episode[`card-${index}`].description
      .toLowerCase()
      .includes(getSearchBar.value.toLowerCase());

    // add onto the drawnEpisodes so we can use that to update the text
    if (titleIncludes || descriptionIncludes) {
      drawnEpisodes++;
      // making sure the display: none isn't present
      document.getElementById(Object.keys(episode).join()).style = "";
    }
    // if episode doesn't include the users entered text
    else {
      // hiding the element completely
      document.getElementById(Object.keys(episode).join()).style =
        "display: none";
    }

    updateSearchText(drawnEpisodes);
  });

  // make array of objects for each episode description
  // object key values: anchor tag id : p.innerText
  // use that to find and remove ones which don't match
};

window.onload = () => {
  setup();
  document.querySelector("#search-bar").addEventListener("input", searchBar);
  updateSearchText(episodes.length); // run this once to set the showing episodes text
};
