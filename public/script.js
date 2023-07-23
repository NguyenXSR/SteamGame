const BASE_URL = "https://steam-api-mass.onrender.com";
const limit = 21;
let page = 1;
const groupButton = document.querySelector(".btn-group");
const previousButton = document.querySelector(".btn-previous");
const nextButton = document.querySelector(".btn-next");
const displayPage = document.querySelector(".game-result");
const displayPageNum = document.querySelector(".display-page");

//get API All game
const getAllGames = async () => {
  try {
    const url = `${BASE_URL}/games?limit=${limit}&page=${page}`;
    const respone = await fetch(url);
    const data = await respone.json();
    // console.log("allgames", data);
    return data;
  } catch (error) {
    console.log(error);
    return;
  }
};
// getAllGames().then((data) => console.log(data));

//render All Games to website

const renderAllGames = async () => {
  try {
    const games = await getAllGames();
    const gameResult = document.querySelector(".game-result");
    gameResult.innerHTML = "";

    games.data.forEach((data) => {
      const game = document.createElement("div");

      if (data.price === 0) {
        data.price = "Free to play";
      } else {
        data.price = "$" + data.price;
      }

      game.classList.add("game-card");
      game.innerHTML = `<div class="game-result">
      <div class="game-banner"> <img src="${data.header_image}" width ="100%" id="${data.appid}"></img> </div>
      <div class="game-infor">
        <div class="game-name">${data.name}</div>
        <div class="game-price">${data.price}</div>
      </div>
    </div>`;

      gameResult.appendChild(game);
    });
  } catch (error) {
    console.log(error);
    return;
  }
};

renderAllGames();

//get API genres list

const getGenresList = async () => {
  try {
    const url = `${BASE_URL}/genres?limit=${limit}`;
    const respone = await fetch(url);
    const data = await respone.json();
    console.log("genresList", data);
    return data;
  } catch (error) {
    console.log(error);
    return;
  }
};
// getGenresList().then((data) => console.log(data));

//render GenresList when browse Genres

const renderGenresList = async (list) => {
  try {
    const list = await getGenresList();
    const ulGenresList = document.querySelector(".genres-list");

    ulGenresList.innerHTML = "";
    list.data.forEach((data) => {
      const newLi = document.createElement("li");
      newLi.textContent = `${data.name}`;

      ulGenresList.appendChild(newLi);
    });
  } catch (error) {
    console.log(error);
    return;
  }
};

renderGenresList();

//get Games by genre from API

const getGameByGenres = async (genres) => {
  try {
    const url = `${BASE_URL}/games?genres=${genres}&limit=${limit}`;
    // console.log("url", url);
    const respone = await fetch(url);
    const data = await respone.json();
    // console.log("gamebyGenres", data);
    return data;
  } catch (error) {
    console.log(error);
    return;
  }
};
// getGameByGenres().then((data) => console.log(data));

//render game by genres after fetching

const renderGamesbyGenres = async (games) => {
  try {
    const gameResult = document.querySelector(".game-result");

    gameResult.innerHTML = "";

    games.data.forEach((data) => {
      const game = document.createElement("div");

      if (data.price === 0) {
        data.price = "Free to play";
      } else {
        data.price = "$" + data.price;
      }

      game.classList.add("game-card");
      game.innerHTML = `<div class="game-result">
      <div class="game-banner"> <img src="${data.header_image}" width ="100%" id="${data.appid}"></img> </div>
      <div class="game-infor">
        <div class="game-name">${data.name}</div>
        <div class="game-price">${data.price}</div>
      </div>
    </div>`;
      gameResult.appendChild(game);
    });
  } catch (error) {
    console.log(error);
    return;
  }
};

const genres = document.querySelector(".genres-list");
genres.addEventListener("click", async (e) => {
  displayPageNum.innerHTML = "";
  const value = e.target.innerText;
  // console.log("genresClicked", value);
  const dataGamesbyGenres = await getGameByGenres(value);
  // console.log("dataGamesbyGenres", dataGamesbyGenres);
  renderGamesbyGenres(dataGamesbyGenres);
});

// get details for each game.

const getGameDetails = async (appid) => {
  try {
    const url = `${BASE_URL}/single-game/${appid}`;
    // console.log(url);
    const respone = await fetch(url);
    const data = await respone.json();
    // console.log("details", data);
    return data;
  } catch (error) {
    console.log(error);
    return;
  }
};
// getGameDetails().then((data) => console.log(data));

//render game detail to Games

const renderGameDetails = async (appid) => {
  try {
    const gameResult = document.querySelector(".game-result");

    gameResult.innerHTML = "";
    groupButton.innerHTML = "";

    const gameDetails = document.createElement("div");

    if (appid.data.price === 0) {
      appid.data.price = "Free to play";
    } else {
      appid.data.price = "$" + appid.data.price;
    }

    gameDetails.innerHTML = `<div class="showing-game show-detail">
    <div class="title-contain ">
    <div class="title">${appid.data.name}</div>
    <div class="price">${appid.data.price}</div>
    </div>
    <div class="img-detail">
    <img
    src="${appid.data.header_image}"
    alt="${appid.data.title}"
    />
    <div class="game-details">
    <div class="game-description">${appid.data.description}</div>
    <div class="game-informations">
    <p>POSITIVE RATINGS: ${appid.data["positive_ratings"]}</p>
    <p>RELEASE DATE:  ${appid.data["release_date"].substr(0, 10)}</p>
    <p>DEVELOPER:  ${appid.data.developer}</p>
    <p>MEDIAN PLAYTIME: ${appid.data["median_playtime"]} hours</p>
    </div>
    </div>
    </div>`;

    gameResult.appendChild(gameDetails);
  } catch (error) {
    console.log(error);
    return;
  }
};

const gameResult = document.querySelector(".game-result");
gameResult.addEventListener("click", async (e) => {
  const appid = e.target.id;
  // console.log("id", appid);
  const gameDetails = await getGameDetails(appid);
  // console.log("gameDetail", gameDetails);
  renderGameDetails(gameDetails);
});

//Add event when searching for game

let input = "";
const keyword = document.querySelector("#search-for-game");
const searchBtn = document.querySelector(".search-btn");

searchBtn.addEventListener("click", async () => {
  input = keyword.value;
  console.log("search", input);

  const dataGamesBySearch = await getGamesBySearch(input);
  renderGamesBySearch(dataGamesBySearch);
});

//get API games for searching

const getGamesBySearch = async (input) => {
  try {
    const url = `${BASE_URL}/games?q=${input}`;
    const respone = await fetch(url);
    const data = await respone.json();
    console.log("game by search", data);
    return data;
  } catch (error) {
    console.log(error);
    return;
  }
};

const renderGamesBySearch = async (input) => {
  try {
    const gameResult = document.querySelector(".game-result");

    gameResult.innerHTML = "";
    groupButton.innerHTML = "";
    input.data.forEach((data) => {
      const game = document.createElement("div");
      game.classList.add("game-card");
      game.innerHTML = `<div class="game-result">
      <div class="game-banner"> <img src="${data.header_image}" width ="100%" id="${data.appid}"></img> </div>
      <div class="game-infor">
        <div class="game-name">${data.name}</div>
        <div class="game-price">${data.price}$</div>
      </div>
    </div>`;
      gameResult.appendChild(game);
    });
  } catch (error) {
    console.log(error);
    return;
  }
};
//work with next and previous button

previousButton.addEventListener("click", () => {
  if (page > 1) {
    page -= 1;
    console.log(page);
    displayPageNum.innerHTML = page;
    renderAllGames();
  }
});

nextButton.addEventListener("click", () => {
  page += 1;

  displayPage.innerHTML = page;
  displayPageNum.innerHTML = page;
  console.log(page);

  renderAllGames();
});

//make animation for banner

const banner = document.querySelector("#banner-img");
const images = ["./A.jpg", "./GOW.jpg", "./GTA.jpg", "./LOL.jpg", "./OW.jpg"];
let currIndex = 0;

function changeBanner() {
  currIndex++;
  if (currIndex === images.length) {
    currIndex = 0;
  }
  banner.src = images[currIndex];
}

setInterval(changeBanner, 3000);
