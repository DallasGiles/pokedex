// Add event listener to search button
const searchSubmitButton = document.getElementById("searchSubmit");
// If the search button has an event listener, make the search buttons accept lowercase and fetch the pokemon data
if (searchSubmitButton) {
  searchSubmitButton.addEventListener("click", function () {
    const pokemonName = document
      .getElementById("searchInput")
      .value.toLowerCase();
    fetchPokemonData(pokemonName);
  });
}

// Define the combined fetch function
// Define the combined fetch function
async function fetchPokemonData(pokemonName, isFavorited) {
  try {
    // Fetch Pokémon details
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${pokemonName}`
    );
    // If the response is not ok, throw an error
    if (!response.ok) {
      throw new Error("Could not fetch Pokémon details");
    }
    // Local variable to store the response data so it can be extracted
    const pokemonData = await response.json();

    // Local variable to store the response data so it can be extracted
    const statsData = pokemonData.stats;

    // Create a card element
    const pokeCard = document.createElement("div");

    // Apply styles to the card element
    pokeCard.style.display = "inline-block";
    pokeCard.style.margin = "10px";
    pokeCard.style.padding = "10px";
    pokeCard.style.backgroundColor = "#f9f9f9";
    pokeCard.style.border = "1px solid #ccc";
    pokeCard.style.borderRadius = "5px";
    pokeCard.style.width = "200px";

    pokeCard.id = `pokemonCard${pokemonData.id}`;

    // Determine the toggle button icon based on isFavorited
    const toggleButtonIcon = isFavorited ? "starFav.png" : "starNoFav.png";

    // HTML content for the card, including the toggle button
    pokeCard.innerHTML = `
      <p>Name: ${pokemonData.name}</p>
      <p>Type: ${pokemonData.types.map((type) => type.type.name).join("/")}</p>
      <p>Generation: 1</p>
      <p>ID: ${pokemonData.id.toString().padStart(3, "0")}</p>
      <ul id="stats${pokemonData.id}"></ul>
      <button id="toggleFavButton_${pokemonData.id}">
          <img class="visible" style="width:20px;height:20px" id="defaultImage" src="./assets/images/${toggleButtonIcon}" alt="Default Image">
      </button>
    `;

    // Append the card to a container
    const cardContainer = document.getElementById("pokemonCardContainer");
    cardContainer.appendChild(pokeCard);

    // Set the sprite image
    const pokemonSprite = pokemonData.sprites.front_default;
    const imgElement = document.createElement("img");
    imgElement.src = pokemonSprite;
    imgElement.classList.add("pokemon-sprite");
    pokeCard.appendChild(imgElement);
    localStorage.setItem(
      `pokemon_${pokemonData.id}`,
      JSON.stringify(pokemonData)
    );

    // Display Pokémon stats
    statsData.forEach((stat) => {
      const statsList = pokeCard.querySelector(`#stats${pokemonData.id}`);
      const statItem = document.createElement("li");
      statItem.textContent = `${stat.stat.name}: ${stat.base_stat}`;
      statsList.appendChild(statItem);
    });
  } catch (error) {
    console.error("Error fetching Pokémon data:", error);
  }
}


// The function to handle the toggle button click event to favorite a Pokémon
function handleToggleButton(event) {
  const toggleButton = event.target.closest("[id^='toggleFavButton']");
  if (toggleButton) {
    const pokemonId = toggleButton.id.replace("toggleFavButton_", "");
    const imgElement = toggleButton.querySelector("img");

    let savedPokemon = JSON.parse(localStorage.getItem("savedPokemon")) || [];
    const isFavorited = savedPokemon.some(
      (pokemon) => pokemon.id === parseInt(pokemonId)
    );

    if (!isFavorited) {
      const pokemonData = JSON.parse(
        localStorage.getItem(`pokemon_${pokemonId}`)
      );
      savedPokemon.push({ ...pokemonData, isFavorited: true }); // Save favorited status
      imgElement.src = "./assets/images/starFav.png";
    } else {
      savedPokemon = savedPokemon.filter(
        (pokemon) => pokemon.id !== parseInt(pokemonId)
      );
      imgElement.src = "./assets/images/starNoFav.png";
    }

    localStorage.setItem("savedPokemon", JSON.stringify(savedPokemon));
    displaySavedPokemon(savedPokemon);
  }
}

// Attach event listener to the card container using event delegation
const cardContainer = document.getElementById("pokemonCardContainer");
cardContainer.addEventListener("click", handleToggleButton);

function savedPokemon(pokemonData) {
  const savedPokemon = JSON.parse(localStorage.getItem("savedPokemon")) || [];
  savedPokemon.push(pokemonData);
  localStorage.setItem("savedPokemon", JSON.stringify(savedPokemon));
}

// Add event listener to the clearList button
const clearListButton = document.getElementById("clearList");
if (clearListButton) {
  clearListButton.addEventListener("click", function () {
    // Remove the savedPokemon key from local storage
    localStorage.removeItem("savedPokemon");

    // Retrieve all keys from local storage
    const keys = Object.keys(localStorage);

    // Filter out keys that start with "pokemon_"
    const pokemonKeys = keys.filter((key) => key.startsWith("pokemon_"));

    // Remove each pokemon data from local storage
    pokemonKeys.forEach((key) => localStorage.removeItem(key));

    // Remove all Pokémon cards from the page
    const cardContainer = document.getElementById("pokemonCardContainer");
    cardContainer.innerHTML = ""; // Clear all child elements
  });
}

function renderSavedPokemon() {
  // Retrieve saved Pokemon from local storage
  const savedPokemon = JSON.parse(localStorage.getItem("savedPokemon")) || [];

  // Loop through saved Pokemon and render their cards
  savedPokemon.forEach((pokemonData) => {
    const isFavorited = pokemonData.isFavorited; // Retrieve favorited status

    // Render each saved Pokemon
    fetchPokemonData(pokemonData.name, isFavorited); // Pass isFavorited status
  });
}

// Add event listener to window load event
window.addEventListener("load", function () {
  // Render saved Pokemon on page load
  renderSavedPokemon();
});