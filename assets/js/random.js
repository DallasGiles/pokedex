var totalPokemCnt;
var pokemonData;

const getPokemon = document.getElementById("get-pokemon");
var getPokemonResult = document.getElementById("get-pokemon-result");
var getPokemonResultName = document.getElementById("pokemon-result-name");
var getPokemonResultImage = document.getElementById("pokemon-result-image");

async function setupTotalPokemonCnt() {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon` // Fetch the total count of pokemon
    );
    
    if (!response.ok) {
      throw new Error("Could not fetch resource");
    }

    const data = await response.json();

    totalPokemCnt = data.count; // Set the total count
}

async function getPokemonDetails(id) {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${id}` // Fetch the details of the pokemon
    );
    
    if (!response.ok) {
        getPokemonDetails(getRandomPokemon());
    }

    pokemonData = await response.json();

    console.log(pokemonData);

    getPokemonResult.classList.remove("hidden");
    getPokemonResult.classList.add("active");

    getPokemonResultName.innerText = pokemonData.name;
    getPokemonResultImage.src = pokemonData.sprites.front_shiny;
    getPokemonResultImage.setAttribute('alt', pokemonData.name);
}

function getRandomPokemon() {
    return Math.floor(Math.random() * totalPokemCnt);
}

getPokemon.onclick = function() {
    getPokemonDetails(getRandomPokemon());
}

// runtime
setupTotalPokemonCnt();
