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

// Add event listener to search button
const searchSubmitButton = document.getElementById("searchSubmit");
// If the search button has an event listener, make the search buttons accept lowercase and fetch the pokemon data
if (searchSubmitButton) {
  searchSubmitButton.addEventListener("click", function () {
    const pokemonName = document
      .getElementById("searchInput")
      .value.toLowerCase();
    // Fetch the Pokémon data using the input value as the Pokémon name
    fetchPokemonData(pokemonName);
  });
}
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
    
    // Extract version name from game_indices array
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
    pokeCard.style.border = "1px solid #ccc";
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

// // Add event listener to the clearList button
// const clearListButton = document.getElementById("clearList");
// if (clearListButton) {
//   clearListButton.addEventListener("click", function () {
//     // Remove the savedPokemon key from local storage
//     localStorage.removeItem("savedPokemon");

//     // Retrieve all keys from local storage
//     const keys = Object.keys(localStorage);

//     // Filter out keys that start with "pokemon_"
//     const pokemonKeys = keys.filter((key) => key.startsWith("pokemon_"));

//     // Remove each pokemon data from local storage
//     pokemonKeys.forEach((key) => localStorage.removeItem(key));

//     // Remove all Pokémon cards from the page
//     const cardContainer = document.getElementById("pokemonCardContainer");
//     cardContainer.innerHTML = ""; // Clear all child elements
//   });
// }

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

let pokemonListVisible = false;

// Function to toggle the visibility of the Pokémon list
function togglePokemonList() {
  const pokemonList = document.getElementById("pokemonList");
  if (pokemonList.style.display === "none") {
    pokemonList.style.display = "flex"; // Show the list
  } else {
    pokemonList.style.display = "none"; // Hide the list
  }
}

// Function to fetch Pokémon data and render a Pokémon card
async function fetchAndRenderPokemon(pokemonName) {
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
    
    // Extract version name from game_indices array
    const versionName = pokemonData.game_indices[0].version.name;

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
    
    // Set the card ID based on the Pokémon ID
    pokeCard.id = `pokemonCard${pokemonData.id}`;

    const capitalize = (string) => {
      return string.charAt(0).toUpperCase() + string.slice(1);
    };

    // HTML content for the card with the Pokémon details and version name
    pokeCard.innerHTML = `
      <p>Name: ${capitalize(pokemonData.name)}</p>
      <p>Type: ${capitalize(
        pokemonData.types.map((type) => type.type.name).join("/")
      )}</p>
      <p>Version: ${capitalize(versionName)}</p>
      <p>ID: ${pokemonData.id.toString().padStart(3, "0")}</p>
    `;

    // Append the card to the Pokémon list container
    const pokemonListContainer = document.getElementById("pokemonList");
    pokemonListContainer.appendChild(pokeCard);
  } catch (error) {
    console.error("Error fetching Pokémon data:", error);
  }
}


// Event listener for "More Pokémon" button
const morePokemonButton = document.getElementById("morePokemonButton");
if (morePokemonButton) {
  morePokemonButton.addEventListener("click", async function () {
    try {
      const response = await fetch(
        "https://pokeapi.co/api/v2/pokemon?limit=40"
      ); // Fetch Pokémon data
      const data = await response.json(); // Convert response to JSON
      const pokemonNames = data.results.map((pokemon) => pokemon.name); // Extract Pokémon names

      // Clear the Pokemon list container
      const pokemonListContainer = document.getElementById("pokemonList");
      pokemonListContainer.innerHTML = "";

      // Fetch and render each Pokémon
      pokemonNames.forEach((name) => fetchAndRenderPokemon(name));

      // Toggle the visibility of the Pokemon list
      togglePokemonList();
    } catch (error) {
      console.error("Error fetching Pokémon data:", error);
    }
  });
}

// Add event listener to window load event
// window.addEventListener("load", function () {
// Render saved Pokemon on page load
//   renderSavedPokemon();
// });
/* Set the width of the side navigation to 250px */
// function openNav() {
//   document.getElementById("mySidenav").style.width = "250px";
// }

/* Set the width of the side navigation to 0 */
// function closeNav() {
//   document.getElementById("mySidenav").style.width = "0";
// }

//search functions hopefully
// const searchButtonSubmit = document.getElementById("searchSubmit");
// searchButtonSubmit.addEventListener("submit", function(event) {
//   event.preventDefault();
//   const pokemonName = document.getElementById("searchInput").value.toLowerCase();
//   fetchPokemonData1(pokemonName);
//   console.log("button clicked");
// })

//  async function fetchPokemonData1(pokemonName){
//   const responseGen1 = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
//   if(!responseGen1.ok){
//     throw new Error("Could not fetch Pokemon stats");
//   }
//   const pokemonData1 = await responseGen1.json();
//   const statsData1 = pokemonData1.stats;
//   console.log(statsData1);
//   console.log(pokemonData1);

//   function createPokecard1(){
//     const pokeCard1 = document.createElement("div");

//     // Apply styles to the card element
//     pokeCard1.style.display = "inline-block";
//     pokeCard1.style.margin = "10px";
//     pokeCard1.style.padding = "10px";
//     pokeCard1.style.backgroundImage = "linear-gradient(to right, #FFB6C1, #FFB6C1)";
//     pokeCard1.style.border = "2px solid #111";
//     pokeCard1.style.borderRadius = "5px";
//     pokeCard1.style.width = "200px";

//     pokeCard1.innerHTML = `
//         <p>Name: ${pokemonData1.name}</p>
//         <p>Type: ${pokemonData1.types.map(type => type.type.name).join('/')}</p>
//         <p>ID: ${pokemonData1.id.toString().padStart(3, '0')}</p>
//         <ul id="stats${pokemonData1.id}"></ul>
//     `;
//     // Append the card to a container
// const cardContainer = document.getElementById("pokemonCardContainer");
// cardContainer.appendChild(pokeCard1);

// // Set the sprite image
// const pokemonSprite = pokemonData1.sprites.front_default;
// const imgElement = document.createElement("img");
// imgElement.src = pokemonSprite;
// imgElement.classList.add("pokemon-sprite");
// pokeCard1.appendChild(imgElement);

// //
// statsData1.forEach(stat=> {
//   const statsList = pokeCard1.querySelector(`#stats${pokemonData1.id}`);
//   const statItem = document.createElement("li");
//   statItem.textContent = `${stat.stat.name}: ${stat.base_stat}`;
//   statsList.appendChild(statItem);
// });

// // Display Pokémon stats
// const statsList = document.getElementById("statsList");
// statsData1.forEach(stat => {
//     const statItem = document.createElement("li");
//     statItem.textContent = `${stat.stat.name}: ${stat.base_stat}`;
//     statsList.appendChild(statItem);
// });
//   }
//   createPokecard1();
// }
