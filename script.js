//You can edit ALL of the code here
function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  rootElem.textContent = `Got ${episodeList.length} episode(s)`;
}


const episodeCount = document.createElement('p');
episodeCount.textContent = `Got ${episodeList.length} episode(s)`;
rootElem.appendChild(episodeCount);



window.onload = setup;
