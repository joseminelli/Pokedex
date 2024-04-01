const MAX_POKEMON = 10000; 
const POKEMON_PER_PAGE = 60; 
const listWrapper = document.querySelector(".list-wrapper");
const searchInput = document.querySelector("#search-input");
const numberFilter = document.querySelector("#number");
const nameFilter = document.querySelector("#name");
const notFoundMessage = document.querySelector("#not-found-message");
const prevPageButton = document.querySelector("#prev-page");
const nextPageButton = document.querySelector("#next-page");
const pageInfo = document.querySelector("#page-info");

let allPokemons = [];
let currentPage = 1;

fetch(`https://pokeapi.co/api/v2/pokemon?limit=${MAX_POKEMON}`)
  .then((response) => response.json())
  .then((data) => {
    allPokemons = data.results;
    displayPokemons(allPokemons, currentPage);
  });

  async function fetchPokemonDataBeforeRedirect(id) {
    try {
      const [pokemon, pokemonSpecies] = await Promise.all([
        fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then((res) =>
          res.json()
        ),
        fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`).then((res) =>
          res.json()
        ),
      ]);
      return true;
    } catch (error) {
      console.error("Failed to fetch Pokemon data before redirect");
      return false;
    }
  }
  
  

function displayPokemons(pokemon) {
  const currentPage = parseInt(new URLSearchParams(window.location.search).get("page")) || 1;
  listWrapper.innerHTML = "";

  const startIndex = (currentPage - 1) * POKEMON_PER_PAGE;
  const endIndex = startIndex + POKEMON_PER_PAGE;
  const pokemonsToShow = pokemon.slice(startIndex, endIndex);

  pokemonsToShow.forEach((pokemon) => {
    const pokemonID = pokemon.url.split("/")[6];
    const listItem = document.createElement("div");
    listItem.className = "list-item";
    listItem.innerHTML = `
        <div class="number-wrap">
            <p class="caption-fonts">#${pokemonID}</p>
        </div>
        <div class="img-wrap">
            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonID}.png" alt="${pokemon.name}" />
        </div>
        <div class="name-wrap">
            <p class="body3-fonts">${pokemon.name}</p>
        </div>
    `;

    listItem.addEventListener("click", async () => {
      const success = await fetchPokemonDataBeforeRedirect(pokemonID);
      if (success) {
        const currentPage = new URLSearchParams(window.location.search).get("page") || 1;
        window.location.href = `./detail.html?id=${pokemonID}&page=${currentPage}`;
      }
    });

    listWrapper.appendChild(listItem);
  });

  updatePageInfo(currentPage);
  listWrapper.scrollTo({ top: 0, behavior: 'smooth' });
}

const pageNumberInput = document.querySelector("#page-number-input");
pageNumberInput.addEventListener("change", () => {
  let pageNumber = parseInt(pageNumberInput.value);

  if (!pageNumber || pageNumber < 1) {
    pageNumber = 1;
  }

  const totalPages = Math.ceil(allPokemons.length / POKEMON_PER_PAGE);
  pageNumber = Math.min(pageNumber, totalPages); 
  currentPage = pageNumber;
  displayPokemons(allPokemons, currentPage);
  pageNumberInput.value = currentPage; 
  window.location.href = `${window.location.pathname}?page=${currentPage}`;
});

function updatePageInfo(page) {
  pageNumberInput.value = page;
}

function handleSearch() {
  const searchTerm = searchInput.value.trim().toLowerCase();
  let filteredPokemons;

  if (!isNaN(searchTerm) && searchTerm !== '') {
    filteredPokemons = allPokemons.filter((pokemon) => {
      const pokemonID = pokemon.url.split("/")[6];
      return pokemonID.startsWith(searchTerm);
    });
  } else {
    filteredPokemons = allPokemons.filter((pokemon) =>
      pokemon.name.toLowerCase().startsWith(searchTerm)
    );
  }

  displayPokemons(filteredPokemons, 1); 

  if (filteredPokemons.length === 0) {
    notFoundMessage.style.display = "block";
  } else {
    notFoundMessage.style.display = "none";
  }
}


function clearSearch() {
  searchInput.value = "";
  displayPokemons(allPokemons, 1);
  notFoundMessage.style.display = "none";
}

searchInput.addEventListener("keyup", handleSearch);
const closeButton = document.querySelector(".search-close-icon");
closeButton.addEventListener("click", clearSearch);

prevPageButton.addEventListener("click", () => {
  const currentPage = Math.max(1, parseInt(new URLSearchParams(window.location.search).get("page")) || 1);
  if (currentPage > 1) {
    const newPage = currentPage - 1;
    window.location.href = `${window.location.pathname}?page=${newPage}`;
  }
});

nextPageButton.addEventListener("click", () => {
  const currentPage = Math.max(1, parseInt(new URLSearchParams(window.location.search).get("page")) || 1);
  const totalPages = Math.ceil(allPokemons.length / POKEMON_PER_PAGE);
  if (currentPage < totalPages) {
    const newPage = currentPage + 1;
    window.location.href = `${window.location.pathname}?page=${newPage}`;
  }
});
