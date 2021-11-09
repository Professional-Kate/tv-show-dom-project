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
  constructor(title, episodeID, summary, image, link, rating) {
    this.title = title; // episode title
    this.episodeID = episodeID; // eg: S01E03
    this.summary = summary; // episode summary
    this.link = link; // link to the episode on the API's website
    this.fullTitle = `${episodeID} - ${title}`; // used in the searchbar and dropdown
    this.rating = rating; // rating

    // condition for if the API doesn't have an image for the show we replace it with a placeholder
    if (typeof image !== "object") {
      console.log(
        `"${this.fullTitle}" : image didn't exist, replacing image...`
      );
      this.image =
        "https://pbs.twimg.com/media/E1Tm_QnWQAAY5LT?format=jpg&name=large";
    } else this.image = image.original;

    // adds the episode to the DOM
    this.constructCard = function () {
      const getParentContainer = document.querySelector("#main-content"); // parent parent

      // making new elements and adding them to the DOM
      const newArticleTag = makeNewElement("article", getParentContainer); // parent for everything else
      const newImgTag = makeNewElement("img", newArticleTag);
      const newHeaderTag = makeNewElement("h2", newArticleTag);

      setAttributes(newArticleTag, { class: "card", id: this.episodeID });

      setAttributes(newHeaderTag, { class: "card-header" }); // header
      newHeaderTag.innerHTML = `${this.title} <span class="episode-info">${this.episodeID}</span>`;

      setAttributes(newImgTag, {
        class: "card-image",
        src: this.image,
      }); // img

      // appending the summary onto the article tag, this summary comes wrapped in <p> tags
      newArticleTag.innerHTML += this.summary;
      const getParagraph = newArticleTag.lastChild;
      setAttributes(getParagraph, { class: "card-text" });

      // making a new p tag to act as our rating
      const newParagraphTag = makeNewElement("p", newArticleTag);
      newParagraphTag.innerHTML = `
      Average rating: ${this.rating}
      <a class="special-text" href="${this.link}" target="_blank">Click to go to episode</a>
      `;

      setAttributes(newParagraphTag, { class: "card-rating" });
    };

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
