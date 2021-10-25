// grab all the episodes from the other script and assign that in a variable
const setup = function () {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
};

const makePageForEpisodes = function (episodeList) {};

window.onload = setup;
