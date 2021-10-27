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

const drawEpisodes = function (episodeList) {
  // grabbing the root container we need
  const getMainContentElement = document.querySelector("#main-content");

  episodeList.forEach((episode) => {
    // making parent containers and adding them to the DOM
    const newAnchorTag = getMainContentElement.appendChild(
      document.createElement("a")
    );
    const newArticleTag = newAnchorTag.appendChild(
      document.createElement("article")
    );

    // making children of the parents and adding them to the DOM

    const newHeaderTag = newArticleTag.appendChild(
      document.createElement("h2")
    );
    const newImgTag = newArticleTag.appendChild(document.createElement("img"));

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
    newArticleTag.innerHTML += episode.summary;
  });
};

window.onload = setup;
