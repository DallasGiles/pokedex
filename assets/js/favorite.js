// Add event listener to search button
const searchSubmitButton = document.getElementById("searchSubmit");
// If the search button has an event listener, make the search buttons accept lowercase and fetch the pokemon data
if (searchSubmitButton) {
  searchSubmitButton.addEventListener("click", function() {
      const pokemonName = document.getElementById("searchInput").value.toLowerCase();
      fetchPokemonData(pokemonName);
  });
}

// Define the combined fetch function
async function fetchPokemonData(pokemonName) {
  try {
      // Fetch Pokémon details
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
      // If the response is not ok, throw an error
      if (!response.ok) {
          throw new Error("Could not fetch Pokémon details");
      }
      // Local variable to store the response data so it can be extracted
      const pokemonData = await response.json();

      // Local variable to store the response data so it can be extracted
      const statsData = pokemonData.stats;

      console.log(statsData);
      console.log(pokemonData);

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

// HTML content for the card, including the toggle button
pokeCard.innerHTML = `
    <p>Name: ${pokemonData.name}</p>
    <p>Type: ${pokemonData.types.map(type => type.type.name).join('/')}</p>
    <p>Generation: 1</p>
    <p>ID: ${pokemonData.id.toString().padStart(3, '0')}</p>
    <ul id="stats${pokemonData.id}"></ul>
    <button id="toggleFavButton">
        <img class="visible" style="width:20px;height:20px" id="defaultImage" src="./assets/images/starFav.png" alt="Default Image">
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
localStorage.setItem("pokemonData", JSON.stringify(pokemonData));

// Display Pokémon stats
statsData.forEach(stat => {
    const statsList = pokeCard.querySelector(`#stats${pokemonData.id}`);
    const statItem = document.createElement("li");
    statItem.textContent = `${stat.stat.name}: ${stat.base_stat}`;
    statsList.appendChild(statItem);
});

// Function to remove the Pokemon data
function removePokemon(pokemonData) {
    // Get the locally stored Pokemon data
    const storedPokemonData = JSON.parse(localStorage.getItem("pokemonData"));

    // Check if the stored data exists and matches the data to be removed
    if (storedPokemonData && storedPokemonData.name === pokemonData.name) {
        // Remove the stored Pokemon data
        localStorage.removeItem("pokemonData");
    }
}

// Toggle button visibility based on the favorite button's class
const toggleFavButton = document.getElementById("toggleFavButton");
toggleFavButton.addEventListener("click", function() {
    // Toggle the src attribute of the image between starFav.png and starNoFav.png
    const imgElement = toggleFavButton.querySelector("img");
    imgElement.src = imgElement.src.includes("starNoFav.png") ? "./assets/images/starNoFav.png" : "./assets/images/starFav.png";

    // Check if the button is in favorited state (starFav.png is displayed)
    const isFavorited = imgElement.src.includes("starFav.png");
    
    // Perform an action based on the toggle state
    if (isFavorited) {
        // Call a function to save the pokemon data
        savedPokemon(pokemonData);
    } else {
        // Call a function to remove the pokemon data
        removePokemon(pokemonData);
    }
});


  } catch (error) {
      console.error("Error fetching Pokémon data:", error);
  }
}

function savedPokemon(pokemonData) {
    const savedPokemon = JSON.parse(localStorage.getItem("savedPokemon")) || [];
    localStorage.setItem("savedPokemon", JSON.stringify(pokemonData));
}
// where would I put the code to remove the pokemon when unfavorited?
// Add event listener to the clearList button
const clearListButton = document.getElementById("clearList");
if (clearListButton) {
    clearListButton.addEventListener("click", function() {
        // Clear locally stored Pokémon data
        localStorage.removeItem("pokemonData");

        // Remove all Pokémon cards from the page
        const cardContainer = document.getElementById("pokemonCardContainer");
        cardContainer.innerHTML = ""; // Clear all child elements
    });
}
