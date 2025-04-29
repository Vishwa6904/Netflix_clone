// Import Firebase authentication functions from auth.js
import {
  checkAuthState,
  signUpUser,
  loginUser,
  logoutUser,
  addToMyList,
  loadMyList,
} from "./auth.js";

// DOM Elements
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const loginButton = document.getElementById("login-button");
const signupButton = document.getElementById("signup-button");
const logoutButton = document.getElementById("logout-button");
const authModal = document.getElementById("auth-modal");
const movieModal = document.getElementById("movie-modal");
const searchResultsModal = document.getElementById("search-results-modal");
const loginTab = document.getElementById("login-tab");
const signupTab = document.getElementById("signup-tab");
const loginForm = document.getElementById("login-form");
const signupForm = document.getElementById("signup-form");
const loginSubmit = document.getElementById("login-submit");
const signupSubmit = document.getElementById("signup-submit");
const addToListButton = document.getElementById("add-to-list-button");
const modalAddToList = document.getElementById("modal-add-to-list");
const heroSection = document.getElementById("hero");
const heroTitle = document.getElementById("hero-title");
const heroOverview = document.getElementById("hero-overview");
const trendingRow = document.getElementById("trending-row");
const moviesRow = document.getElementById("popular-movies-row");
const seriesRow = document.getElementById("popular-series-row");
const myListRow = document.getElementById("my-list-row");

// API Base URL and Key
const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = "534ac55664f93476b8f87a5063d21d02"; // Replace with your actual API key

// API Endpoints
const TRENDING_ENDPOINT = `${API_BASE_URL}/trending/all/day?api_key=${API_KEY}`;
const POPULAR_MOVIES_ENDPOINT = `${API_BASE_URL}/movie/popular?api_key=${API_KEY}`;
const POPULAR_SERIES_ENDPOINT = `${API_BASE_URL}/tv/popular?api_key=${API_KEY}`;
const SEARCH_ENDPOINT = `${API_BASE_URL}/search/multi?api_key=${API_KEY}&query=`;

// Image Base URL
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/";

// Function to fetch trending content
async function fetchTrending() {
  try {
    const response = await fetch(TRENDING_ENDPOINT);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching trending content:", error);
    return null;
  }
}

// Function to fetch popular movies
async function fetchPopularMovies() {
  try {
    const response = await fetch(POPULAR_MOVIES_ENDPOINT);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching popular movies:", error);
    return null;
  }
}

// Function to fetch popular TV series
async function fetchPopularTVSeries() {
  try {
    const response = await fetch(POPULAR_SERIES_ENDPOINT);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching popular TV series:", error);
    return null;
  }
}

// Function to get image URL
function getImageUrl(path, size = "w500") {
  return `${IMAGE_BASE_URL}${size}${path}`;
}

// Function to search for content
async function searchContent(query) {
  try {
    const response = await fetch(SEARCH_ENDPOINT + query);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error searching for content:", error);
    return null;
  }
}

// Function to fetch details for a movie or TV show
async function fetchDetails(id, type) {
  try {
    const detailsEndpoint = `${API_BASE_URL}/${type}/${id}?api_key=${API_KEY}`;
    const response = await fetch(detailsEndpoint);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching details for ${type} with ID ${id}:`, error);
    return null;
  }
}

// Function to fetch credits for a movie or TV show
async function fetchCredits(id, type) {
  try {
    const creditsEndpoint = `${API_BASE_URL}/${type}/${id}/credits?api_key=${API_KEY}`;
    const response = await fetch(creditsEndpoint);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching credits for ${type} with ID ${id}:`, error);
    return null;
  }
}

// Initialize the application
function initApp() {
  console.log("Initializing application...");

  // Show loading states
  setLoadingState(trendingRow);
  setLoadingState(moviesRow);
  setLoadingState(seriesRow);

  loadContent();
  setupEventListeners();

  // Firebase auth state would go here in a real app
  // For now, we'll just simulate logged out state
  updateUIForLoggedOutUser();
}

// Set loading state for a container
function setLoadingState(container) {
  container.innerHTML = '<div class="loading">Loading content...</div>';
}

// Load content from API
async function loadContent() {
  try {
    console.log("Loading content...");

    // Load trending content for hero section
    const trendingData = await fetchTrending();
    if (
      trendingData &&
      trendingData.results &&
      trendingData.results.length > 0
    ) {
      console.log("Trending data loaded successfully");
      const featuredContent = trendingData.results[0];
      updateHeroSection(featuredContent);

      // Load trending row
      trendingRow.innerHTML = "";
      trendingData.results.forEach((item) => {
        const card = createMovieCard(item);
        trendingRow.appendChild(card);
      });
    } else {
      console.error("No trending data available");
      heroTitle.textContent = "Content Unavailable";
      heroOverview.textContent =
        "Sorry, we couldn't load the featured content. Please try again later.";
      trendingRow.innerHTML = '<div class="loading">No content available</div>';
    }

    // Load popular movies
    const moviesData = await fetchPopularMovies();
    if (moviesData && moviesData.results && moviesData.results.length > 0) {
      console.log("Popular movies loaded successfully");
      moviesRow.innerHTML = "";
      moviesData.results.forEach((movie) => {
        const movieItem = {
          ...movie,
          type: "movie",
        };
        const card = createMovieCard(movieItem);
        moviesRow.appendChild(card);
      });
    } else {
      console.error("No movie data available");
      moviesRow.innerHTML = '<div class="loading">No movies available</div>';
    }

    // Load popular TV series
    const seriesData = await fetchPopularTVSeries();
    if (seriesData && seriesData.results && seriesData.results.length > 0) {
      console.log("Popular TV series loaded successfully");
      seriesRow.innerHTML = "";
      seriesData.results.forEach((series) => {
        const seriesItem = {
          ...series,
          type: "tv",
        };
        const card = createMovieCard(seriesItem);
        seriesRow.appendChild(card);
      });
    } else {
      console.error("No TV series data available");
      seriesRow.innerHTML = '<div class="loading">No TV series available</div>';
    }
  } catch (error) {
    console.error("Error loading content:", error);
    heroTitle.textContent = "Error Loading Content";
    heroOverview.textContent =
      "Sorry, we encountered an error while loading content. Please try again later.";
    trendingRow.innerHTML = '<div class="loading">Error loading content</div>';
    moviesRow.innerHTML = '<div class="loading">Error loading content</div>';
    seriesRow.innerHTML = '<div class="loading">Error loading content</div>';
  }
}

// Update hero section with featured content
function updateHeroSection(content) {
  console.log("Updating hero section with:", content);

  // Set background image
  const backdropPath = content.backdrop_path;
  if (backdropPath) {
    heroSection.style.backgroundImage = `url(${getImageUrl(
      backdropPath,
      "original"
    )})`;
  } else {
    heroSection.style.backgroundImage =
      "linear-gradient(to right, #141414, #333)";
  }

  // Set title and overview
  heroTitle.textContent = content.title || content.name;
  heroOverview.textContent = content.overview || "No overview available";

  // Set up add to list button for hero content
  addToListButton.onclick = () => {
    const contentType = content.title ? "movie" : "tv";
    const contentItem = {
      id: content.id,
      title: content.title || content.name,
      poster_path: content.poster_path,
      backdrop_path: content.backdrop_path,
      overview: content.overview,
      release_date: content.release_date || content.first_air_date,
      type: contentType,
    };
    console.log("Adding to list:", contentItem);
    // In a real app, this would add to Firebase
    alert("This would add to your list if Firebase was configured");
  };
}

// Create movie card element
function createMovieCard(item) {
  const card = document.createElement("div");
  card.className = "movie-card";

  const img = document.createElement("img");
  img.src = getImageUrl(item.poster_path);
  img.alt = item.title || item.name;
  img.onerror = () => {
    img.src = "https://via.placeholder.com/300x450?text=No+Image";
  };

  const info = document.createElement("div");
  info.className = "movie-info";

  const title = document.createElement("div");
  title.className = "movie-title";
  title.textContent = item.title || item.name;

  const year = document.createElement("div");
  year.className = "movie-year";
  const releaseDate = item.release_date || item.first_air_date;
  year.textContent = releaseDate
    ? new Date(releaseDate).getFullYear()
    : "Unknown";

  info.appendChild(title);
  info.appendChild(year);

  card.appendChild(img);
  card.appendChild(info);

  // Add click event to open modal with details
  card.addEventListener("click", () => {
    const contentType = item.type || (item.title ? "movie" : "tv");
    console.log(`Card clicked: ${item.title || item.name} (${contentType})`);
    openMovieModal(item.id, contentType);
  });

  return card;
}

// Open movie details modal
async function openMovieModal(id, type) {
  try {
    console.log(`Opening modal for ${type} with ID: ${id}`);

    // Show loading state in modal
    document.getElementById("modal-title").textContent = "Loading...";
    document.getElementById("modal-poster-img").src =
      "https://via.placeholder.com/300x450?text=Loading";
    document.getElementById("modal-year").textContent = "";
    document.getElementById("modal-rating").textContent = "";
    document.getElementById("modal-runtime").textContent = "";
    document.getElementById("modal-overview").textContent =
      "Loading content...";
    document.getElementById("modal-cast").textContent = "Loading cast...";

    // Show modal while loading
    movieModal.style.display = "block";

    // Fetch details and credits
    const details = await fetchDetails(id, type);
    const credits = await fetchCredits(id, type);

    if (!details) {
      console.error("Failed to fetch details");
      document.getElementById("modal-title").textContent = "Error";
      document.getElementById("modal-overview").textContent =
        "Failed to load content details.";
      return;
    }

    console.log("Movie details:", details);
    console.log("Movie credits:", credits);

    // Update modal content
    document.getElementById("modal-title").textContent =
      details.title || details.name;
    document.getElementById("modal-poster-img").src = getImageUrl(
      details.poster_path
    );
    document.getElementById("modal-poster-img").onerror = () => {
      document.getElementById("modal-poster-img").src =
        "https://via.placeholder.com/300x450?text=No+Image";
    };

    // Handle release date
    const releaseDate = details.release_date || details.first_air_date;
    document.getElementById("modal-year").textContent = releaseDate
      ? new Date(releaseDate).getFullYear()
      : "Unknown";

    // Handle rating
    document.getElementById("modal-rating").textContent = details.adult
      ? "R"
      : "PG-13";

    // Handle runtime
    if (type === "movie") {
      document.getElementById("modal-runtime").textContent = details.runtime
        ? `${details.runtime} min`
        : "N/A";
    } else {
      const episodes = details.number_of_episodes || "?";
      const seasons = details.number_of_seasons || "?";
      document.getElementById(
        "modal-runtime"
      ).textContent = `${seasons} season${
        seasons !== 1 ? "s" : ""
      }, ${episodes} episode${episodes !== 1 ? "s" : ""}`;
    }

    // Handle overview
    document.getElementById("modal-overview").textContent =
      details.overview || "No overview available";

    // Update cast information
    if (credits && credits.cast && credits.cast.length > 0) {
      const castNames = credits.cast
        .slice(0, 5)
        .map((actor) => actor.name)
        .join(", ");
      document.getElementById("modal-cast").textContent = castNames;
    } else {
      document.getElementById("modal-cast").textContent =
        "Cast information not available";
    }

    // Set up add to list button
    const contentItem = {
      id: details.id,
      title: details.title || details.name,
      poster_path: details.poster_path,
      backdrop_path: details.backdrop_path,
      overview: details.overview,
      release_date: releaseDate,
      type: type,
    };

    modalAddToList.onclick = () => {
      console.log("Adding to list from modal:", contentItem);
      // In a real app, this would add to Firebase
      alert("This would add to your list if Firebase was configured");
    };

    // In a real app, we would check if content is in user's list
    modalAddToList.innerHTML = '<i class="fas fa-plus"></i> Add to List';
  } catch (error) {
    console.error("Error opening movie modal:", error);
    document.getElementById("modal-title").textContent = "Error";
    document.getElementById("modal-overview").textContent =
      "An error occurred while loading content details.";
  }
}

// Close modal
function closeModal(modal) {
  modal.style.display = "none";
}

// Open auth modal
function openAuthModal() {
  authModal.style.display = "block";
}

// Close auth modal
function closeAuthModal() {
  authModal.style.display = "none";
}

// Update UI for logged out user
function updateUIForLoggedOutUser() {
  document.getElementById("auth-buttons").style.display = "flex";
  document.getElementById("user-profile").style.display = "none";
  document.getElementById("my-list-nav").style.display = "none";
  document.getElementById("mylist").style.display = "none";
  document.getElementById("add-to-list-button").style.display = "none";
}

// Update UI for logged in user
function updateUIForLoggedInUser(user) {
  document.getElementById("auth-buttons").style.display = "none";
  document.getElementById("user-profile").style.display = "flex";
  document.getElementById("user-name").textContent =
    user.displayName || user.email;
  document.getElementById("my-list-nav").style.display = "block";
  document.getElementById("mylist").style.display = "block";
  document.getElementById("add-to-list-button").style.display = "inline-block";
}

// Switch between login and signup forms
function switchAuthForm(form) {
  if (form === "login") {
    loginForm.style.display = "flex";
    signupForm.style.display = "none";
    loginTab.classList.add("active");
    signupTab.classList.remove("active");
  } else {
    loginForm.style.display = "none";
    signupForm.style.display = "flex";
    loginTab.classList.remove("active");
    signupTab.classList.add("active");
  }
}

// Search for content
async function searchForContent() {
  const query = searchInput.value.trim();
  if (!query) return;

  try {
    console.log(`Searching for: "${query}"`);

    // Show loading state
    const searchResults = document.getElementById("search-results");
    searchResults.innerHTML = '<div class="loading">Searching...</div>';

    // Show search results modal while loading
    searchResultsModal.style.display = "block";

    const searchData = await searchContent(query);
    console.log("Search results:", searchData);

    searchResults.innerHTML = "";

    if (searchData && searchData.results && searchData.results.length > 0) {
      // Filter to only include movies and TV shows
      const filteredResults = searchData.results.filter(
        (item) => item.media_type === "movie" || item.media_type === "tv"
      );

      if (filteredResults.length > 0) {
        filteredResults.forEach((item) => {
          const card = createMovieCard({
            ...item,
            type: item.media_type,
          });
          searchResults.appendChild(card);
        });
      } else {
        searchResults.innerHTML =
          '<div class="loading">No movies or TV shows found</div>';
      }
    } else {
      searchResults.innerHTML = '<div class="loading">No results found</div>';
    }
  } catch (error) {
    console.error("Error searching for content:", error);
    const searchResults = document.getElementById("search-results");
    searchResults.innerHTML =
      '<div class="loading">Error searching for content</div>';
  }
}

// Setup event listeners
function setupEventListeners() {
  // Search
  searchButton.addEventListener("click", searchForContent);
  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      searchForContent();
    }
  });

  // Auth buttons
  loginButton.addEventListener("click", () => {
    openAuthModal();
    switchAuthForm("login");
  });

  signupButton.addEventListener("click", () => {
    openAuthModal();
    switchAuthForm("signup");
  });

  logoutButton.addEventListener("click", async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error("Error during logout:", error);
    }
  });

  // Auth tabs
  loginTab.addEventListener("click", () => switchAuthForm("login"));
  signupTab.addEventListener("click", () => switchAuthForm("signup"));

  // Auth form submission
  loginSubmit.addEventListener("click", async (e) => {
    e.preventDefault();

    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;
    const errorElement = document.getElementById("login-error");

    if (!email || !password) {
      errorElement.textContent = "Please fill in all fields";
      return;
    }

    try {
      await loginUser(email, password);
    } catch (error) {
      console.error("Error during login:", error);
      errorElement.textContent = error.message;
    }
  });

  signupSubmit.addEventListener("click", async (e) => {
    e.preventDefault();

    const name = document.getElementById("signup-name").value;
    const email = document.getElementById("signup-email").value;
    const password = document.getElementById("signup-password").value;
    const errorElement = document.getElementById("signup-error");

    if (!name || !email || !password) {
      errorElement.textContent = "Please fill in all fields";
      return;
    }

    try {
      await signUpUser(name, email, password);
    } catch (error) {
      console.error("Error during signup:", error);
      errorElement.textContent = error.message;
    }
  });

  // Close modals
  document.querySelectorAll(".close").forEach((closeButton) => {
    closeButton.addEventListener("click", () => {
      closeModal(movieModal);
      closeModal(authModal);
      closeModal(searchResultsModal);
    });
  });

  // Close modal when clicking outside
  window.addEventListener("click", (e) => {
    if (e.target === movieModal) {
      closeModal(movieModal);
    }
    if (e.target === authModal) {
      closeModal(authModal);
    }
    if (e.target === searchResultsModal) {
      closeModal(searchResultsModal);
    }
  });

  // Header scroll effect
  window.addEventListener("scroll", () => {
    const header = document.querySelector("header");
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });
}

// Initialize the app when DOM is loaded
document.addEventListener("DOMContentLoaded", initApp);
