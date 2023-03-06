const BASE_URL = "https://webdev.alphacamp.io";
const INDEX_URL = BASE_URL + "/api/movies";
const POSTER_URL = BASE_URL + "/posters/";
const movies = [];
let filteredMovies = [];
const dataPanel = document.querySelector("#data-panel");
const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
const MOVIES_PER_PAGE = 12;
const paginator = document.querySelector("#paginator");
const switchDisplay = document.querySelector(".switch-display");
let switchDisplayChosen = true;
// function
let currentPage = 1;
const displayPic = document.querySelector("#displayPic");
const displayList = document.querySelector("#displayList");

function renderMovieList(data) {
  if (switchDisplayChosen) {
    let rawHTML = "";

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
    <button class="btn btn-info btn-add-favorite" data-id="${
      item.id
    }">+</button>
  </div>
</div>

</div>

</div>`;
    });

    dataPanel.innerHTML = rawHTML;
  } else if (!switchDisplayChosen) {
    let rawHTML = "";
    data.forEach((item) => {
      rawHTML += `<div class="movie-sheets d-flex justify-content-between p-3 border-top">
  <h5 class="list-title">${item.title}</h5>
<div class="list-buttons">
    <button class="btn btn-primary btn-show-movie me-2" data-bs-toggle="modal" data-bs-target="#movie-modal" data-id="${item.id}">More</button>
    <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
  </div>
</div>`;
    });
    dataPanel.innerHTML = rawHTML;
  }
}

function renderMovieSheets(data) {
  let rawHTML = "";
  data.forEach((item) => {
    rawHTML += `<div class="movie-sheets d-flex justify-content-between p-3 border-top">
  <h5 class="list-title">${item.title}</h5>
<div class="list-buttons">
    <button class="btn btn-primary btn-show-movie" data-bs-toggle="modal" data-bs-target="#movie-modal" data-id="${item.id}">More</button>
    <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
  </div>
</div>`;
  });
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

function addToFavorite(id) {
  // 建立一個初始為空的陣列，當localStorage的favoriteMovies key有內容時，取出時會使用JSON方法把字串轉回 JavaScript 原生物件
  // ||優先回傳左起為true的值
  const list = JSON.parse(localStorage.getItem("favoriteMovies")) || [];
  // 在movies陣列中用find()方法，迭代movie，當有遇到符合函式條件的movie時，就會終止回傳該movie，得到按+後的movie物件
  const movie = movies.find((movie) => movie.id === id);
  // 使用some()方法，當list中有符合函式條件的movie，回傳true
  if (list.some((movie) => movie.id === id)) {
    return alert("此電影已在收藏清單中");
  }
  list.push(movie);
  // localStorage只能存進字串，所以要用JSON方法將資料轉為 JSON 格式的字串
  localStorage.setItem("favoriteMovies", JSON.stringify(list));
}

function getMoviesByPage(page) {
  // page1 0 - 11
  // page2 12 - 23
  // page3 24 - 35
  const data = filteredMovies.length ? filteredMovies : movies;
  const startIndex = (page - 1) * MOVIES_PER_PAGE;
  // return movies.slice(startIndex, startIndex + MOVIES_PER_PAGE);
  return data.slice(startIndex, startIndex + MOVIES_PER_PAGE);
}

function renderPaginator(amount) {
  const numberOfPages = Math.ceil(amount / MOVIES_PER_PAGE);

  let rawHTML = "";

  for (let page = 1; page <= numberOfPages; page++) {
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`;
  }
  paginator.innerHTML = rawHTML;
}

function myFunction(x) {
  if (x.matches) {
    // If media query matches
    switchDisplayChosen = false;
    displayList.classList.add("active");
    displayPic.classList.remove("active");
    renderMovieList(getMoviesByPage(currentPage));
  } else {
    switchDisplayChosen = true;
    displayPic.classList.add("active");
    displayList.classList.remove("active");
    renderMovieList(getMoviesByPage(currentPage));
  }
}

var x = window.matchMedia("(max-width: 768px)");
myFunction(x); // Call listener function at run time
x.addListener(myFunction); // Attach listener function on state changes

dataPanel.addEventListener("click", function onPanelClicked(event) {
  if (event.target.matches(".btn-show-movie")) {
    showMovieModal(Number(event.target.dataset.id));
  } else if (event.target.matches(".btn-add-favorite")) {
    addToFavorite(Number(event.target.dataset.id));
  }
});

paginator.addEventListener("click", function onPaginatorClicked(event) {
  if (event.target.tagName !== "A") return;
  const page = Number(event.target.dataset.page);
  renderMovieList(getMoviesByPage(page));
  currentPage = page;
});

// search bar event
searchForm.addEventListener("submit", function onSearchFormSubmitted(event) {
  // console.log(event);
  event.preventDefault();
  const keyword = searchInput.value.trim().toLowerCase();
  // let filteredMovies = [];
  // if (!keyword.length) {
  //   return alert("Please enter a valid string");
  // }

  // movies.forEach((movie) => {
  //   if (movie.title.toLowerCase().includes(keyword)) {
  //     filteredMovies.push(movie);
  //   }
  //   renderMovieList(filteredMovies);
  // });

  filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(keyword)
  );

  if (filteredMovies.length === 0) {
    return alert("Cannot find movies with keyword" + keyword);
  }
  renderPaginator(filteredMovies.length);
  renderMovieList(getMoviesByPage(1));
});

switchDisplay.addEventListener("click", function onSwitchDisplayClicked(event) {
  if (event.target.matches("#displayPic")) {
    switchDisplayChosen = true;
    displayPic.classList.add("active");
    displayList.classList.remove("active");
    renderMovieList(getMoviesByPage(currentPage));
  } else if (event.target.matches("#displayList")) {
    switchDisplayChosen = false;
    displayList.classList.add("active");
    displayPic.classList.remove("active");
    renderMovieList(getMoviesByPage(currentPage));
  }
});

axios
  .get(INDEX_URL)
  .then((response) => {
    // for (const movie of response.data.results) {
    //   movies.push(movie);
    // }
    movies.push(...response.data.results);
    renderPaginator(movies.length);
    renderMovieList(getMoviesByPage(1));
    displayPic.classList.add("active");
  })
  .catch((err) => console.log(err));
