// function for setting multiple attributes to an element. Attributes is assumed to be an object
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
    image,
    episodeID,
    link,
    genres
  ) {
    this.title = title; // episode / show title
    this.episodeID = episodeID; // eg: S01E03
    this.link = link; // link to the episode on the API's website. Only using this for the episodes list
    this.fullTitle = `${episodeID} - ${title}`; // used in the searchbar and dropdown
    this.rating = rating; // rating
    this.summary = replaceFromString(summary, ["<p>", "</p>", "<br>"]); // episode summary
    this.genres = genres; // equal to an array if the argument was passed in. Only using this for the show list

    // condition for if the API doesn't have an image for the show we replace it with a placeholder
    if (typeof image !== "object") {
      console.log(
        `"${this.fullTitle}" : image didn't exist, replacing image...`
      );
      this.image =
        "https://pbs.twimg.com/media/E1Tm_QnWQAAY5LT?format=jpg&name=large"; // a picture of a field that I took
    } else this.image = image.original; // original is higher quality

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
      const newExtraInfoTag = makeNewElement("p", newArticleTag); // Shows : genre. Episodes : average review

      // giving all out newly created elements some attributes
      setAttributes(newArticleTag, { class: "card" });

      // show / episode title
      setAttributes(newHeaderTag, { class: "card-header" }); // header
      newHeaderTag.innerHTML = `${this.title}`;
      // if it does then we are working with episodes. The episodeID for shows is typeof number
      if (typeof this.episodeID === "string") {
        // episode number - S01E01
        newHeaderTag.innerHTML += `<span class="episode-info">${this.episodeID}</span>`;
      } else if (typeof this.episodeID === "number") {
        // show rating
        newHeaderTag.innerHTML += `<span class="episode-info">Average rating: ${this.rating}</span>`;
      }

      setAttributes(newImgTag, {
        class: "card-image",
        src: this.image,
      }); // img

      // setting the text for the summary and giving it the card-text class
      const shortenedSummary = this.summary.replace(/^(.{230}[^\s]*).*/, "$1"); // the replace uses regex to only cut text after the number of characters in the {x} but doesn't cut a word in half

      newSummaryTag.innerHTML = shortenedSummary;

      if (shortenedSummary.length !== this.summary.length)
        newSummaryTag.innerHTML += " ..."; // checks if the shortenedSummary length is equal to the non mutated summary, if it is then the replace did nothing and we don't need to add the ellipsis

      setAttributes(newSummaryTag, { class: "card-text" });

      // if this equals anything else then that means we didn't pass in genres, which means we are creating cards for the episodes
      if (this.genres !== [])
        // only for the show cards
        newExtraInfoTag.innerHTML = ` Genres:
        <span class="special-text">${this.genres.join(" : ")}</span>`;
      else {
        // only for the episode cards
        newExtraInfoTag.innerHTML = `
      Average rating: ${this.rating}
      <a class="special-text" href="${this.link}" target="_blank">Click to view more</a>
      `;
      }

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
