const global = {
    currentPage: window.location.pathname,
};

function showSpinner() {
    document.querySelector(".spinner").classList.add("show");
}

function hideSpinner() {
    document.querySelector(".spinner").classList.remove("show");
}

// show popular movies on the home page
async function displayPopularMovies() {
    const { results } = await fetchAPIData("movie/popular/");
    // console.log(results);

    results.forEach((movie) => {
        const div = document.createElement("div");
        div.classList.add("card");
        div.innerHTML = `
            <a href="movie-details.html?id=${movie.id}">
            ${
                movie.poster_path
                    ? `<img
                src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
                class="card-img-top"
                alt="${movie.title}"
                />`
                    : `<img
                            src="images/no-image.jpg"
                            class="card-img-top"
                            alt="${movie.title}"
                        />`
            }
            </a>
            <div class="card-body">
                <h5 class="card-title">${movie.title}</h5>
                <p class="card-text">
                <small class="text-muted">Release: ${movie.release_date}</small>
                </p>
            </div>`;
        document.querySelector("#popular-movies").appendChild(div);
    });
}

// show popular shows on the shows page
async function displayPopularShows() {
    const { results } = await fetchAPIData("tv/popular/");
    // console.log(results);

    results.forEach((show) => {
        const div = document.createElement("div");
        div.classList.add("card");
        div.innerHTML = `
            <a href="tv-details.html?id=${show.id}">
            ${
                show.poster_path
                    ? `<img
                src="https://image.tmdb.org/t/p/w500${show.poster_path}"
                class="card-img-top"
                alt="${show.name}"
                />`
                    : `<img
                            src="images/no-image.jpg"
                            class="card-img-top"
                            alt="${show.name}"
                        />`
            }
            </a>
            <div class="card-body">
                <h5 class="card-title">${show.name}</h5>
                <p class="card-text">
                <small class="text-muted">Release: ${
                    show.first_air_date
                }</small>
                </p>
            </div>`;
        document.querySelector("#popular-shows").appendChild(div);
    });
}

// Display movie details
async function displayMovieDetails() {
    const movieId = window.location.search.split("=")[1];
    // console.log(movieId);

    const movieDetails = await fetchAPIData(`movie/${movieId}`);
    // console.log(movieDetails);

    // overlay for background image
    displayBackgroundImage("movie", movieDetails.backdrop_path);

    const div = document.createElement("div");
    div.innerHTML = `<div class="details-top">
    <div>
    ${
        movieDetails.poster_path
            ? `<img
        src="https://image.tmdb.org/t/p/w500${movieDetails.poster_path}"
        class="card-img-top"
        alt="${movieDetails.title}"
        />`
            : `<img
                    src="images/no-image.jpg"
                    class="card-img-top"
                    alt="${movieDetails.title}"
                />`
    }
    </div>
    <div>
      <h2>${movieDetails.title}</h2>
      <p>
        <i class="fas fa-star text-primary"></i>
        ${movieDetails.vote_average.toFixed(1)} / 10
      </p>
      <p class="text-muted">Release Date: ${movieDetails.release_date}</p>
      <p>
      ${movieDetails.overview}
      </p>
      <h5>Genres</h5>
      <ul class="list-group">
      ${movieDetails.genres.map((genre) => `<li>${genre.name}</li>`).join("")}
      </ul>
      <a href="#" target="_blank" class="btn">${movieDetails.homepage}</a>
    </div>
  </div>
  <div class="details-bottom">
    <h2>Movie Info</h2>
    <ul>
      <li><span class="text-secondary">Budget:</span> $${addCommas(
          movieDetails.budget
      )}</li>
      <li><span class="text-secondary">Revenue:</span> $${addCommas(
          movieDetails.revenue
      )}</li>
      <li><span class="text-secondary">Runtime:</span> ${
          movieDetails.runtime
      } minutes</li>
      <li><span class="text-secondary">Status:</span> ${
          movieDetails.status
      }</li>
    </ul>
    <h4>Production Companies</h4>
    <div class="list-group"> 
    ${movieDetails.production_companies
        .map((company) => `<span>${company.name}</span>`)
        .join(", ")}</div>
  </div>`;

    document.querySelector("#movie-details").appendChild(div);
}

// Display show details
async function displayShowDetails() {
    const showId = window.location.search.split("=")[1];
    // console.log(showId);

    const show = await fetchAPIData(`tv/${showId}`);
    // console.log(show);

    // overlay for background image
    displayBackgroundImage("show", show.backdrop_path);

    const div = document.createElement("div");
    div.innerHTML = `<div class="details-top">
    <div>
    ${
        show.poster_path
            ? `<img
        src="https://image.tmdb.org/t/p/w500${show.poster_path}"
        class="card-img-top"
        alt="${show.name}"
        />`
            : `<img
                    src="images/no-image.jpg"
                    class="card-img-top"
                    alt="${show.name}"
                />`
    }
    </div>
    <div>
      <h2>${show.name}</h2>
      <p>
        <i class="fas fa-star text-primary"></i>
        ${show.vote_average.toFixed(1)} / 10
      </p>
      <p class="text-muted">Release Date:  ${show.first_air_date}</p>
      <p>
      ${show.overview}
      </p>
      <h5>Genres</h5>
      <ul class="list-group">
        ${show.genres.map((genre) => `<li>${genre.name}</li>`).join("")}
      </ul>
      <a href="#" target="_blank" class="btn">${show.homepage}</a>
    </div>
  </div>
  <div class="details-bottom">
    <h2>Show Info</h2>
    <ul>
      <li><span class="text-secondary">Number Of Episodes:</span> ${
          show.number_of_episodes
      }</li>
      <li>
        <span class="text-secondary">Last Episode To Air:</span> ${
            show.last_episode_to_air.air_date
        }
      </li>
      <li><span class="text-secondary">Status:</span> ${show.status}</li>
    </ul>
    <h4>Production Companies</h4>
    <div class="list-group">${show.production_companies
        .map((company) => `<span>${company.name}</span>`)
        .join(", ")}</div>
  </div>`;

    document.querySelector("#show-details").appendChild(div);
}

// function to get background image
async function displayBackgroundImage(type, path) {
    const overlayDiv = document.createElement("div");
    overlayDiv.style.backgroundImage = `url(https://image.tmdb.org/t/p/original${path})`;
    overlayDiv.style.backgroundSize = "cover";
    overlayDiv.style.backgroundPosition = "center";
    overlayDiv.style.backgroundRepeat = "no-repeat";
    overlayDiv.style.height = "100vh";
    overlayDiv.style.width = "100vw";
    overlayDiv.style.position = "absolute";
    overlayDiv.style.top = "0";
    overlayDiv.style.left = "0";
    overlayDiv.style.zIndex = "-1";
    overlayDiv.style.opacity = "0.25";

    if (type === "movie") {
        document.querySelector("#movie-details").appendChild(overlayDiv);
    } else {
        document.querySelector("#show-details").appendChild(overlayDiv);
    }
}

// display slider movies
async function displaySlider() {
    const { results } = await fetchAPIData("movie/now_playing");

    results.forEach((result) => {
        console.log(result);
        const div = document.createElement("div");
        div.classList.add("swiper-slide");

        div.innerHTML = `
            <a href="movie-details.html?id=${result.id}">
              <img src="https://image.tmdb.org/t/p/w500${result.poster_path}" alt="${result.title}" />
            </a>
            <h4 class="swiper-rating">
              <i class="fas fa-star text-secondary"></i> ${result.vote_average} / 10
            </h4>`;

        document.querySelector(".swiper-wrapper").appendChild(div);

        initSwiper();
    });
}

function initSwiper() {
    const swiper = new Swiper(".swiper", {
        slidesPerView: 1,
        spaceBetween: 30,
        freeMode: true,
        loop: true,
        autoplay: {
            delay: 4000,
            disableOnInteraction: true,
        },
        breakpoints: {
            500: {
                slidesPerView: 2,
            },
            700: {
                slidesPerView: 3,
            },
            1200: {
                slidesPerView: 4,
            },
        },
    });
}

// function to add commas ot big numbers
function addCommas(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// fetch data from movie db api
async function fetchAPIData(endpoint) {
    const API_KEY = "5d72827234f2ddb5bf52e4193d773e4b";
    const API_URL = "https://api.themoviedb.org/3/";

    showSpinner();

    const response = await fetch(
        `${API_URL}${endpoint}?api_key=${API_KEY}&language=en-US`
    );

    const data = await response.json();

    await new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, 1000);
    });

    hideSpinner();

    return data;
}

// highlight active page
function highlightActiveLink() {
    const navLinks = document.querySelectorAll(".nav-link");
    navLinks.forEach((link) => {
        if (link.getAttribute("href") === global.currentPage) {
            link.classList.add("active");
        }
    });
}

// init app
function init() {
    switch (global.currentPage) {
        case "/":
        case "/index.html":
            displaySlider();
            displayPopularMovies();
            break;
        case "/movie-details.html":
            displayMovieDetails();
            break;
        case "/search.html":
            console.log("search");
            break;
        case "/shows.html":
            displayPopularShows();
            break;
        case "/tv-details.html":
            displayShowDetails();
            break;
    }
    highlightActiveLink();
}

init();
