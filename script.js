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


const episodeContainer = document.createAttribute('div');
episodeContainer.id = `episode-container`;
rootElem.appendChild(episodeContainer);

episodeList.forEach((episode) => {
  const episodeCard = document.createElement('div');
  episodeCard.episode.className = 'episode-card';

  const episodeTitle = document.createElement('h3');
  episodeTitle.textcontent = `${episode.name} - ${formatEpisodeCode(episode.season, episode.number)}`;
  

})



window.onload = setup;
