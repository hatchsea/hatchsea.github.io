const BASE_URL = "https://webdev.alphacamp.io";
const INDEX_URL = BASE_URL + "/api/movies";
const POSTER_URL = BASE_URL + "/posters/";
// favorite
const movies = JSON.parse(localStorage.getItem("favoriteMovies")) || [];
const dataPanel = document.querySelector("#data-panel");
const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
const switchDisplay = document.querySelector(".switch-display");
let switchDisplayChosen = true;
function renderMovieList(data) {
  let rawHTML = "";
  if (switchDisplayChosen) {
    data.forEach((item) => {
      rawHTML += `<div class="col-sm-3 mb-4">
<div class="mb-2">

<div class="card" >
  <img src="${POSTER_URL + item.image}" class="card-img-top" alt="...">
  <div class="card-body">
    <h5 class="card-title">${item.title}</h5>
    
  </div>
    <div class="card-footer d-flex justify-content-end">
    <button class="btn btn-primary btn-show-movie me-2" data-bs-toggle="modal" data-bs-target="#movie-modal" data-id="${
      item.id
    }">More</button>
    <button class="btn btn-danger btn-remove-favorite" data-id="${
      item.id
    }">X</button>
  </div>
</div>

</div>

</div>`;
    });
  } else if (!switchDisplayChosen) {
    data.forEach((item) => {
      rawHTML += `<div class="movie-sheets d-flex justify-content-between p-3 border-top">
  <h5 class="list-title">${item.title}</h5>
<div class="list-buttons">
    <button class="btn btn-primary btn-show-movie me-2" data-bs-toggle="modal" data-bs-target="#movie-modal" data-id="${item.id}">More</button>
    <button class="btn btn-danger btn-remove-favorite" data-id="${item.id}">X</button>
  </div>
</div>`;
    });
  }
  dataPanel.innerHTML = rawHTML;
}

function showMovieModal(id) {
  const modalTitle = document.querySelector("#movie-modal-title");
  const modalImage = document.querySelector("#movie-modal-image");
  const modalDate = document.querySelector("#movie-modal-date");
  const modalDescription = document.querySelector("#movie-modal-description");

  axios.get(INDEX_URL).then((response) => {
    const data = response.data.results[id - 1];
    modalTitle.innerText = data.title;
    modalDate.innerText = "Release date: " + data.release_date;
    modalDescription.innerText = data.description;
    modalImage.innerHTML = `<img src="${
      POSTER_URL + data.image
    }" alt="movie-poster" class="img-fluid">`;
  });
}

function RemoveFavorite(id) {
  // 防錯 收藏清單不存在或為空，結束函式
  if (!movies || !movies.length) return;
  const movieIndex = movies.findIndex((movie) => movie.id === id);
  // 防錯 收藏清單中無此id，結束函式
  if (movieIndex === -1) return;
  movies.splice(movieIndex, 1);

  localStorage.setItem("favoriteMovies", JSON.stringify(movies));
  renderMovieList(movies);
}

function myFunction(x) {
  if (x.matches) {
    // If media query matches
    switchDisplayChosen = false;
    displayList.classList.add("active");
    displayPic.classList.remove("active");
    renderMovieList(movies);
  } else {
    switchDisplayChosen = true;
    displayPic.classList.add("active");
    displayList.classList.remove("active");
    renderMovieList(movies);
  }
}

var x = window.matchMedia("(max-width: 768px)");
myFunction(x); // Call listener function at run time
x.addListener(myFunction); // Attach listener function on state changes

switchDisplay.addEventListener("click", function onSwitchDisplayClicked(event) {
  if (event.target.matches("#displayPic")) {
    switchDisplayChosen = true;
    displayPic.classList.add("active");
    displayList.classList.remove("active");
    renderMovieList(movies);
  } else if (event.target.matches("#displayList")) {
    switchDisplayChosen = false;
    displayList.classList.add("active");
    displayPic.classList.remove("active");
    renderMovieList(movies);
  }
});

dataPanel.addEventListener("click", function onPanelClicked(event) {
  if (event.target.matches(".btn-show-movie")) {
    showMovieModal(Number(event.target.dataset.id));
  } else if (event.target.matches(".btn-remove-favorite")) {
    RemoveFavorite(Number(event.target.dataset.id));
  }
});

renderMovieList(movies);
displayPic.classList.add("active");
