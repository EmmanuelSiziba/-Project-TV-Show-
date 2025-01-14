const state = {
  episodes: [], // will store all episodes fetched from getAllEpisodes() function 
  searchTerm: "", // tracks the search term entered by the user
};

function setup() {
  //Initialize the state will all episodes 
  state.episodes = getAllEpisodes();

  createSearchBar(); // create search bar and render the initial episodes
  makePageForEpisodes(state.episodes);
}

function createSearchBar(){
  const rootElem = document.getElementById("root");

  // search container 
  const searchContainer = document.createElement("div");
  searchContainer.id = "search-container";

  //input field for searching 
  const searchInput = document.createElement("input");
  searchInput.type = "text";
  searchInput.id = "search-input";
  searchInput.placeholder = "Search episodes by title or summary";

  //paragraph to show number of matching episodes
  const searchCount = document.createElement("p");
  searchCount.id = "search-count";
  searchCount.textContent = `Got ${state.episodes.length} episode(s)`;

  // event listener to update search term and filter episodes 
  searchInput.addEventListener("input", () => {
    state.searchTerm = searchInput.value.toLowerCase();
    const filteredEpisodes = filterEpisodes();
    searchCount.textContent = `Got ${filteredElements.length} episode(s)`;
    makePageForEpisodes(filteredEpisodes)
  });

  //append elements to the search container 
  searchContainer.appendChild(searchInput);
  searchContainer.appendChild(searchCount);

  //add the search container to the top of the root element
  rootElem.prepend(searchContainer);
}

// function to filter episodes based on the search term 
function filteredEpisodes(){
  const searchTerm = state.searchTerm;
  return state.episodes.filter((episode) => episode.name.toLowerCase().includes(searchTerm) || (episode.summary && episode.summary.toLowerCase().includes(searchTerm)));
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