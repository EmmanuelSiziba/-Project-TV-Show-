const state = {
  episodes: [], // will store all episodes fetched from getAllEpisodes() function 
  searchTerm: "", // tracks the search term entered by the user
};

const endpoint = "https://api.tvmaze.com/shows";

// Get references to the DOM elements
const statusElem = document.getElementById("status");
const searchInput = document.getElementById("search-input");
const showSelector = document.getElementById("show-selector");
const episodeSelect = document.getElementById("episode-select");

// Fetch data from the API
const fetchData = async (endpoint) => {
  try {
    statusElem.textContent = "Loading episodes, please wait...";
    const response = await fetch(endpoint);

    if (!response.ok) {
      throw new Error("Failed to fetch episodes");
    }

    const data = await response.json();
    statusElem.textContent = "";
    return data;

  } catch (error) {
    statusElem.textContent = "Error fetching episodes. Please try again later.";
    alert("Error fetching episodes: " + error);
    return [];
  }
};

// Setup function to initialize the app
async function setup() {
  const shows = await fetchData(endpoint);
  state.episodes = shows;
  createShowSelectMenu(state.episodes)
  createSearchBar();
  makePageForEpisodes(state.episodes);
}


// Create dropdown for shows
function createShowSelectMenu(shows) {
  // Add default option
  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  showSelector.appendChild(defaultOption);

  // Populate dropdown with shows
  shows
    .sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" }))
    .forEach((show) => {
      const option = document.createElement("option");
      option.value = show.id;
      option.textContent = show.name;
      showSelector.appendChild(option);
    });

  // Add event listener for show selection
  showSelector.addEventListener("change", async (event) => {
    const showId = event.target.value;
    if (showId) {
      const episodesEndpoint = `https://api.tvmaze.com/shows/${showId}/episodes`;
      const episodes = await fetchData(episodesEndpoint);
      state.episodes = episodes;
      createEpisodeSelectMenu(episodes);
      makePageForEpisodes(episodes);
    } else {
      makePageForEpisodes(shows);
      episodeSelect.innerHTML = ""; // Clear episode dropdown
    }
  });
}

// Create dropdown for episodes
function createEpisodeSelectMenu(episodes) {
  episodeSelect.innerHTML = ""; // Clear existing options

  // Add default option to show all episodes
  const defaultOption = document.createElement("option");
  defaultOption.value = "all";
  defaultOption.textContent = "Select All Episodes";
  episodeSelect.appendChild(defaultOption);

  // Populate dropdown with episodes
  episodes.forEach((episode) => {
    const option = document.createElement("option");
    option.value = episode.id;
    option.textContent = `${formatEpisodeCode(episode.season, episode.number)} - ${episode.name}`;
    episodeSelect.appendChild(option);
  });

  // Add event listener for episode selection
  episodeSelect.addEventListener("change", (event) => {
    const selectedValue = event.target.value;

    if (selectedValue === "all") {
      makePageForEpisodes(state.episodes);
    } else {
      const selectedEpisode = state.episodes.find((episode) => episode.id.toString() === selectedValue);
      makePageForEpisodes(selectedEpisode ? [selectedEpisode] : []);
    }
  });
}

function createSearchBar() {
  // Event listener to update search term and filter episodes 
  searchInput.addEventListener("input", () => {
    state.searchTerm = searchInput.value.toLowerCase();
    const filteredEpisodes = filterEpisodes();
    makePageForEpisodes(filteredEpisodes);
  });
}

// Function to filter episodes based on the search term 
function filterEpisodes() {
  const searchTerm = state.searchTerm;
  return state.episodes.filter((episode) =>
    episode.name.toLowerCase().includes(searchTerm) ||
    (episode.summary && episode.summary.toLowerCase().includes(searchTerm))
  );
}

// Function to render episodes 
function makePageForEpisodes(episodeList) {
  let episodeContainer = document.getElementById("episode-container");

  if (!episodeContainer) {
    episodeContainer = document.createElement("div");
    episodeContainer.id = "episode-container";
    document.body.appendChild(episodeContainer); // Append to body or a specific container
  }

  episodeContainer.innerHTML = "";

  // Create cards for each episode
  episodeList.forEach((episode) => {
    const episodeCard = document.createElement("div");
    episodeCard.className = "episode-card";

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
}

function formatEpisodeCode(season, number) {
  return `S${String(season).padStart(2, '0')}E${String(number).padStart(2, '0')}`;
}

window.onload = setup;