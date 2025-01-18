const state = {
  episodes: [], // will store all episodes fetched from getAllEpisodes() function 
  searchTerm: "", // tracks the search term entered by the user
};

const endpoint = " https://api.tvmaze.com/shows";

const fetchData = async () => {
  try {
    //Show loading status 
    document.getElementById("status").textContent = "Loading episodes, please wait..."

    const response = await fetch(endpoint);

    if (!response.ok) {
      throw new Error("Failed to fetch episodes");
    }
    const data = await response.json();

    //clear the status message
    document.querySelector("#status").textContent = "";

    return data;

  } catch (error) {

    document.getElementById("status").textContent = "Error fetching episodes. Please try again later.";
    alert("Error fetching episodes:", error);
    return [];
  }

}; // Our async function returns a Promise// Our async function returns a Promise

fetchData().then((shows) => {
  // When the fetchFilms Promise resolves, this callback will be called.
  state.episodes = shows;
  render();
});

// Setup function to initialize the app
async function setup() {
  // Fetch and display shows
  const shows = await fetchData(endpoint);
  state.shows = shows;

  createShowSelectMenu(shows); // Add the show selection menu
  createSearchBar(); // Create the search bar
}

// Create dropdown for shows
function createShowSelectMenu(shows) {
  const rootElem = document.getElementById("root");

  const selectElem = document.createElement("select");
  selectElem.id = "show-selector";

  // Add default option
  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "Select a Show";
  selectElem.appendChild(defaultOption);

  // Populate dropdown with shows
  shows
    .sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" }))
    .forEach((show) => {
      const option = document.createElement("option");
      option.value = show.id;
      option.textContent = show.name;
      selectElem.appendChild(option);
    });

  // Add event listener for show selection
  selectElem.addEventListener("change", async (event) => {
    const showId = event.target.value;
    if (showId) {
      const episodesEndpoint = `https://api.tvmaze.com/shows/${showId}/episodes`;
      const episodes = await fetchData(episodesEndpoint);
      state.episodes = episodes;
      createEpisodeSelectMenu(episodes); // Update the episode dropdown
      makePageForEpisodes(episodes); // Display episodes for selected show
    }
  });

  rootElem.prepend(selectElem);
}
  
// Create dropdown for episodes
function createEpisodeSelectMenu(episodes) {
  const existingSelect = document.getElementById("episode-select");
  if (existingSelect) existingSelect.remove();

  const rootElem = document.getElementById("root");
  const selectElem = document.createElement("select");
  selectElem.id = "episode-select";

  // Add default option to show all episodes
  const defaultOption = document.createElement("option");
  defaultOption.value = "all";
  defaultOption.textContent = "Select All Episodes";
  selectElem.appendChild(defaultOption);

  // Populate dropdown with episodes
  episodes.forEach((episode) => {
    const option = document.createElement("option");
    option.value = episode.id;
    option.textContent = `${formatEpisodeCode(episode.season, episode.number)} - ${episode.name}`;
    selectElem.appendChild(option);
  });

  // Add event listener for episode selection
  selectElem.addEventListener("change", (event) => {
    const selectedValue = event.target.value;

    if (selectedValue === "all") {
      makePageForEpisodes(state.episodes);
    } else {
      const selectedEpisode = state.episodes.find((episode) => episode.id.toString() === selectedValue);
      makePageForEpisodes(selectedEpisode ? [selectedEpisode] : []);
    }
  });

  rootElem.prepend(selectElem);
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
    searchCount.textContent = `Got ${filteredEpisodes.length} episode(s)`;
    makePageForEpisodes(filteredEpisodes)
  });

  //append elements to the search container 
  searchContainer.appendChild(searchInput);
  searchContainer.appendChild(searchCount);

  //add the search container to the top of the root element
  rootElem.prepend(searchContainer);
}

// function to filter episodes based on the search term 
function filterEpisodes(){
  const searchTerm = state.searchTerm;
  return state.episodes.filter((episode) => episode.name.toLowerCase().includes(searchTerm) || (episode.summary && episode.summary.toLowerCase().includes(searchTerm)));
}

//function to render episodes 
function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  let episodeContainer = document.getElementById("episode-container");

  if (!episodeContainer) {
    episodeContainer = document.createElement("div");
    episodeContainer.id = "episode-container";
    rootElem.appendChild(episodeContainer);
  }

  episodeContainer.innerHTML = "";

  //create cards for each episode
  episodeList.forEach((episode) => {
    const episodeCard = document.createElement("div");
    episodeCard.className = "episode-card";

    // episode title with formatted code
    const episodeTitle = document.createElement('h3');
    episodeTitle.textContent = `${episode.name} - ${formatEpisodeCode(episode.season, episode.number)}`;

    const episodeImage = document.createElement('img');
    episodeImage.src = episode.image?.medium || 'placeholder.jpg';
    episodeImage.alt = episode.name;

    const episodeSummary = document.createElement('p');
    episodeSummary.innerHTML = episode.summary || 'No summary available.';

    const episodeLink = document.createElement("a");
    episodeLink.href = episode.url;
    episodeLink.target = "_blank";
    episodeLink.textContent = "Click to Watch";

    episodeCard.appendChild(episodeTitle);
    episodeCard.appendChild(episodeImage);
    episodeCard.appendChild(episodeSummary);
    episodeCard.appendChild(episodeLink);


    episodeContainer.appendChild(episodeCard);

  });

  if (!existingContainer) {
    rootElem.appendChild(episodeContainer);
  }
  
}

 
function formatEpisodeCode(season, number) {
  return `S${String(season).padStart(2, '0')}E${String(number).padStart(2, '0')}`;
}

 
window.onload = setup;