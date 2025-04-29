// Function to create a movie card element
export function createMovieCard(item) {
  const card = document.createElement("div");
  card.className = "movie-card";

  const img = document.createElement("img");
  img.src = item.poster_path;
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

  return card;
}
