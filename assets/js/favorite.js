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

      // Fetch Pokémon stats
      const statsResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
      // If the response is not ok, throw an error
      if (!statsResponse.ok) {
          throw new Error("Could not fetch Pokémon stats");
      }
      // Local variable to store the response data so it can be extracted
      const statsData = await statsResponse.json();

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
    <button id="toggleFavButton" class="hidden">
        <img class="visible" style="width:20px;height:20px" id="defaultImage" src="./assets/images/starNoFav.png" alt="Default Image">
        <img class="hidden" style="width:20px;height:20px" id="clickedImage" src="./assets/images/starFav.png" alt="Clicked Image">
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

// Display Pokémon stats
const statsList = document.getElementById("statsList");
statsData.stats.forEach(stat => {
    const statItem = document.createElement("li");
    statItem.textContent = `${stat.stat.name}: ${stat.base_stat}`;
    statsList.appendChild(statItem);
});

// Toggle button visibility based on the favorite button's class
const toggleFavButton = document.getElementById("toggleFavButton");
if (toggleFavButton) {
    toggleFavButton.classList.toggle("visible");
    toggleFavButton.classList.toggle("hidden");
}



  } catch (error) {
      console.error("Error fetching Pokémon data:", error);
  }
}
