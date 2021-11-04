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
class EpisodeCardCreator {
  constructor(title, episodeID, summary, image, link) {
    this.title = title; // episode title
    this.episodeID = episodeID; // eg: S01E03
    this.summary = summary; // episode summary
    this.image = image.original; // medium sized image
    this.link = link; // link to the episode on the API's website
    this.fullTitle = `${episodeID} - ${title}`; // used in the searchbar and dropdown

    // adds the episode to the DOM
    this.constructCard = function () {
      const getParentContainer = document.querySelector("#main-content"); // parent parent

      // making new elements and adding them to the DOM
      const newAnchorTag = makeNewElement("a", getParentContainer); // parent for the article
      const newArticleTag = makeNewElement("article", newAnchorTag); // parent for everything else
      const newImgTag = makeNewElement("img", newArticleTag);
      const newHeaderTag = makeNewElement("h2", newArticleTag);

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
    this.hideCard = function (shouldHide) {
      if (shouldHide === false) {
        document.getElementById(this.episodeID).style = ""; // removing all added styles
      } else {
        document.getElementById(this.episodeID).style = "display: none"; // hiding the element by removing its display. This also takes the element out from the flow of the page
      }
    };

    this.constructCard(); // calling this function to construct the episodes on load
  }
}
