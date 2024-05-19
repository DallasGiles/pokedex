var themeToggleDarkIcon = document.getElementById("theme-toggle-dark-icon");
var themeToggleLightIcon = document.getElementById("theme-toggle-light-icon");

// Change the icons inside the button based on previous settings
if (
  localStorage.getItem("color-theme") === "dark" ||
  (!("color-theme" in localStorage) &&
    window.matchMedia("(prefers-color-scheme: dark)").matches)
) {
  themeToggleLightIcon.classList.remove("hidden");
} else {
  themeToggleDarkIcon.classList.remove("hidden");
}

var themeToggleBtn = document.getElementById("theme-toggle");

themeToggleBtn.addEventListener("click", function () {
  // toggle icons inside button
  themeToggleDarkIcon.classList.toggle("hidden");
  themeToggleLightIcon.classList.toggle("hidden");

  // if set via local storage previously
  if (localStorage.getItem("color-theme")) {
    if (localStorage.getItem("color-theme") === "light") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("color-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("color-theme", "light");
    }

    // if NOT set via local storage previously
  } else {
    if (document.documentElement.classList.contains("dark")) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("color-theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("color-theme", "dark");
    }
  }
});

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
    // Local variable to store the response data for pokemonData so it can be extracted
    const pokemonData = await response.json();

    // Local variable to store the response data for versionName using the pokemonData variable to extract the version name
    const versionName = pokemonData.game_indices[0].version.name;

    // Local variable to store the response data for statsData using the pokemonData variable to extract the stats
    const statsData = pokemonData.stats;

    // Create a card element
    const pokeCard = document.createElement("div");

    // Apply styles to the card element
    pokeCard.style.display = "inline-block";
    pokeCard.style.margin = "10px";
    pokeCard.style.padding = "10px";
    pokeCard.style.backgroundColor = "#f9f9f9";
    pokeCard.style.border = "5px ridge #ECBF1E";
    pokeCard.style.borderRadius = "5px";
    pokeCard.style.width = "200px";
    // Set the card ID based on the Pokémon ID
    pokeCard.id = `pokemonCard${pokemonData.id}`;

    // Determine the toggle button icon based on isFavorited
    const toggleButtonIcon = isFavorited ? "starFav.png" : "starNoFav.png";

    const capitalize = (string) => {
      return string.charAt(0).toUpperCase() + string.slice(1);
    };

    // HTML content for the card with the toggle button and Pokémon details which are extracted from the pokemonData variable
    pokeCard.innerHTML = `
      <p>Name: ${capitalize(pokemonData.name)}</p>
      <p>Type: ${capitalize(
        pokemonData.types.map((type) => type.type.name).join("/")
      )}</p>
      <p>Version: ${capitalize(versionName)}</p>
      <p>ID: ${pokemonData.id.toString().padStart(3, "0")}</p>
      <ul id="stats${pokemonData.id}"></ul>
      <button id="toggleFavButton_${pokemonData.id}">
          <img class="visible" style="width:20px;height:20px" id="defaultImage" src="./assets/images/${toggleButtonIcon}" alt="Default Image">
      </button>
    `;

    // Append the card to a containers div element
    const cardContainer = document.getElementById("pokemonCardContainer");
    cardContainer.appendChild(pokeCard);

    // Set the sprite image for the Pokémon searched
    const pokemonSprite = pokemonData.sprites.front_default;
    const imgElement = document.createElement("img");
    imgElement.src = pokemonSprite;
    imgElement.classList.add("pokemon-sprite");
    pokeCard.appendChild(imgElement);
    localStorage.setItem(
      `pokemon_${pokemonData.id}`,
      JSON.stringify(pokemonData)
    );

    // Display the stats data in an unordered list inside the card
    statsData.forEach((stat) => {
      const statsList = pokeCard.querySelector(`#stats${pokemonData.id}`);
      const statItem = document.createElement("li");
      statItem.textContent = `${capitalize(stat.stat.name)}: ${stat.base_stat}`;
      statsList.appendChild(statItem);
    });
  } catch (error) {
    console.error("Error fetching Pokémon data:", error);
  }
}

// The function to handle the toggle button click event to favorite a Pokémon
function handleToggleButton(event) {
  // Check if the clicked element is a toggle button if it is, extract the Pokémon ID and the image element
  const toggleButton = event.target.closest("[id^='toggleFavButton']");
  if (toggleButton) {
    const pokemonId = toggleButton.id.replace("toggleFavButton_", "");
    const imgElement = toggleButton.querySelector("img");
    // Then check if the Pokémon is favorited or not and update the local storage accordingly
    let savedPokemon = JSON.parse(localStorage.getItem("savedPokemon")) || [];
    const isFavorited = savedPokemon.some(
      (pokemon) => pokemon.id === parseInt(pokemonId)
    );
    // If the Pokémon is not favorited, add it to the local storage and update the image source to the favorited image
    if (!isFavorited) {
      const pokemonData = JSON.parse(
        localStorage.getItem(`pokemon_${pokemonId}`)
      );
      savedPokemon.push({ ...pokemonData, isFavorited: true });
      imgElement.src = "./assets/images/starFav.png";
      // If the Pokémon is favorited, remove it from the local storage and update the image source to the not favorited image
    } else {
      savedPokemon = savedPokemon.filter(
        (pokemon) => pokemon.id !== parseInt(pokemonId)
      );
      imgElement.src = "./assets/images/starNoFav.png";
    }
    // Update the local storage with the updated saved Pokémon data
    localStorage.setItem("savedPokemon", JSON.stringify(savedPokemon));
  }
}

// Attach event listener to the card container using event delegation
const cardContainer = document.getElementById("pokemonCardContainer");
cardContainer.addEventListener("click", handleToggleButton);
// The function to save the Pokémon data to the local storage as a string
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

  // Loop through saved Pokemon and render their cards on the page
  savedPokemon.forEach((pokemonData) => {
    // Extract the isFavorited property from the saved Pokemon data object
    const isFavorited = pokemonData.isFavorited;

    // Render each saved Pokemon
    fetchPokemonData(pokemonData.name, isFavorited);
  });
}

// Add event listener to window load event
window.addEventListener("load", function () {
  // Render saved Pokemon on page load
  renderSavedPokemon();
});