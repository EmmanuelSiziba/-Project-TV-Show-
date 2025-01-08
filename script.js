function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
}

 
function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  rootElem.innerHTML = '';  

  const episodeCount = document.createElement('p');
  episodeCount.textContent = `Got ${episodeList.length} episode(s)`;
  rootElem.appendChild(episodeCount);

 
  const episodeContainer = document.createElement('div');
  episodeContainer.id = 'episode-container';
  rootElem.appendChild(episodeContainer);

  episodeList.forEach((episode) => {
      const episodeCard = document.createElement('div');
      episodeCard.className = 'episode-card';

       
      const episodeTitle = document.createElement('h3');
      episodeTitle.textContent = `${episode.name} - ${formatEpisodeCode(episode.season, episode.number)}`;

    
      const episodeImage = document.createElement('img');
      episodeImage.src = episode.image?.medium || 'placeholder.jpg';
      episodeImage.alt = episode.name;

       
      const episodeSummary = document.createElement('p');
      episodeSummary.innerHTML = episode.summary || 'No summary available.';

 
      episodeCard.appendChild(episodeTitle);
      episodeCard.appendChild(episodeImage);
      episodeCard.appendChild(episodeSummary);

       
      episodeContainer.appendChild(episodeCard);
  });
}

 
function formatEpisodeCode(season, number) {
  return `S${String(season).padStart(2, '0')}E${String(number).padStart(2, '0')}`;
}

 
window.onload = setup;