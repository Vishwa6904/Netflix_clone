// TMDB API configuration
const TMDB_API_KEY = "534ac55664f93476b8f87a5063d21d02"; // Replace with your actual TMDB API key
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

// API endpoints
const API_ENDPOINTS = {
  trending: `${TMDB_BASE_URL}/trending/all/week`,
  popularMovies: `${TMDB_BASE_URL}/movie/popular`,
  popularTVSeries: `${TMDB_BASE_URL}/tv/popular`,
  movieDetails: (id) => `${TMDB_BASE_URL}/movie/${id}`,
  tvDetails: (id) => `${TMDB_BASE_URL}/tv/${id}`,
  movieCredits: (id) => `${TMDB_BASE_URL}/movie/${id}/credits`,
  tvCredits: (id) => `${TMDB_BASE_URL}/tv/${id}/credits`,
  search: `${TMDB_BASE_URL}/search/multi`,
};

// Get image URL
function getImageUrl(path, size = "w500") {
  if (!path) return "https://via.placeholder.com/300x450?text=No+Image";
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
}

// Import axios
// import axios from "axios"

// Fetch data from TMDB API
async function fetchFromTMDB(endpoint, params = {}) {
  try {
    console.log(`Fetching data from: ${endpoint}`);
    const url = new URL(endpoint);

    // Add API key and other params to URL
    url.searchParams.append("api_key", TMDB_API_KEY);
    for (const key in params) {
      url.searchParams.append(key, params[key]);
    }

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Fetched data:", data);
    return data;
  } catch (error) {
    console.error("Error fetching data from TMDB:", error);
    return null;
  }
}

// Fetch trending content
async function fetchTrending() {
  console.log("Fetching trending content...");
  return fetchFromTMDB(API_ENDPOINTS.trending);
}

// Fetch popular movies
async function fetchPopularMovies() {
  console.log("Fetching popular movies...");
  return fetchFromTMDB(API_ENDPOINTS.popularMovies);
}

// Fetch popular TV series
async function fetchPopularTVSeries() {
  console.log("Fetching popular TV series...");
  return fetchFromTMDB(API_ENDPOINTS.popularTVSeries);
}

// Fetch movie or TV show details
async function fetchDetails(id, type) {
  console.log(`Fetching ${type} details for ID: ${id}`);
  const endpoint =
    type === "movie"
      ? API_ENDPOINTS.movieDetails(id)
      : API_ENDPOINTS.tvDetails(id);
  return fetchFromTMDB(endpoint);
}

// Fetch movie or TV show credits
async function fetchCredits(id, type) {
  console.log(`Fetching ${type} credits for ID: ${id}`);
  const endpoint =
    type === "movie"
      ? API_ENDPOINTS.movieCredits(id)
      : API_ENDPOINTS.tvCredits(id);
  return fetchFromTMDB(endpoint);
}

// Search for movies and TV shows
async function searchContent(query) {
  console.log(`Searching for: "${query}"`);
  return fetchFromTMDB(API_ENDPOINTS.search, { query });
}
