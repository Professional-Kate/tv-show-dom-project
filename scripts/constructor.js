// function for setting multiple attributes to an element
const setAttributes = function (element, attributes) {
  for (let key in attributes) {
    element.setAttribute(key, attributes[key]);
  }
};

// makes a new element based on parameters then returns that
const makeNewElement = function (elementName, parent, elementID) {
  const newElement = parent.appendChild(document.createElement(elementName));
  if (typeof elementID !== "undefined") newElement.id = elementID;
  return newElement;
};

// pass in a string and an array of things you want to remove, will use each index of the array from the string then return
const replaceFromString = function (string, removes) {
  removes.forEach((remove) => {
    string = string.replace(remove, "");
  });
  return string;
};

// construct an object for the episodes
class CardCreator {
  constructor(
    parentContainerID,
    title,
    summary,
    rating,
    link,
    image,
    episodeID
  ) {
    this.title = title; // episode title
    this.episodeID = episodeID; // eg: S01E03
    this.link = link; // link to the episode on the API's website
    this.fullTitle = `${episodeID} - ${title}`; // used in the searchbar and dropdown
    this.rating = rating; // rating
    this.summary = replaceFromString(summary, ["<p>", "</p>", "<br>"]); // episode summary

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
      const getParentContainer = document.getElementById(parentContainerID); // parent parent

      // making new elements and adding them to the DOM
      const newArticleTag = makeNewElement(
        "article",
        getParentContainer,
        this.episodeID
      ); // parent for everything else
      const newImgTag = makeNewElement("img", newArticleTag);
      const newHeaderTag = makeNewElement("h2", newArticleTag);
      const newSummaryTag = makeNewElement("p", newArticleTag);
      const newExtraInfoTag = makeNewElement("p", newArticleTag);

      setAttributes(newArticleTag, { class: "card" });

      setAttributes(newHeaderTag, { class: "card-header" }); // header
      newHeaderTag.innerHTML = `${this.title} <span class="episode-info">${this.episodeID}</span>`;

      setAttributes(newImgTag, {
        class: "card-image",
        src: this.image,
      }); // img

      // setting the text for the summary and giving it the card-text class
      const shortenedSummary = this.summary.replace(/^(.{230}[^\s]*).*/, "$1"); // the replace uses regex to only cut text after 230 characters but doesn't cut a word in half

      newSummaryTag.innerHTML = shortenedSummary;

      if (shortenedSummary.length !== this.summary.length)
        newSummaryTag.innerHTML += " ..."; // checks if the shortenedSummary length is equal to the non mutated summary, if it is then the replace did nothing and we don't need to add the ellipsis

      setAttributes(newSummaryTag, { class: "card-text" });

      // making a new p tag to act as our rating
      newExtraInfoTag.innerHTML = `
      Average rating: ${this.rating}
      <a class="special-text" href="${this.link}" target="_blank">Click to view more</a>
      `;

      setAttributes(newExtraInfoTag, { class: "card-rating" });
    };

    // toggles the visibility of the episode
    this.hideCard = function (shouldHide) {
      const getCurrentElement = document.getElementById(this.episodeID);
      if (shouldHide === false) {
        getCurrentElement.style.display = "grid"; // removing all added styles
      } else if (shouldHide) {
        getCurrentElement.style.display = "none"; // hiding the element by removing its display. This also takes the element out from the flow of the page
      }
    };

    this.constructCard(); // calling this function to construct the episodes on load
  }
}
