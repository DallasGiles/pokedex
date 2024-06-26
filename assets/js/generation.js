

  /* Set the width of the side navigation to 250px */
function openNav() {
  document.getElementById("mySidenav").style.width = "250px";
}

/* Set the width of the side navigation to 0 */
function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
}

//search functions hopefully
const searchButtonSubmit = document.getElementById("form1");
searchButtonSubmit.addEventListener("submit", function(event) {
  event.preventDefault();
  const pokemonName = document.getElementById("searchInput1").value.toLowerCase();
  fetchPokemonData1(pokemonName);
  console.log("button clicked");
})

 async function fetchPokemonData1(pokemonName){
  const responseGen1 = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
  if(!responseGen1.ok){
    throw new Error("Could not fetch Pokemon stats");
  }
  const pokemonData1 = await responseGen1.json();
  const statsData1 = pokemonData1.stats;
  console.log(statsData1);
  console.log(pokemonData1); 

  function createPokecard1(){
    const pokeCard1 = document.createElement("div");

    // Apply styles to the card element
    pokeCard1.style.display = "inline-block";
    pokeCard1.style.margin = "10px";
    pokeCard1.style.padding = "10px";
    pokeCard1.style.backgroundImage = "linear-gradient(to right, #FFB6C1, #FFB6C1)";
    pokeCard1.style.border = "2px solid #111";
    pokeCard1.style.borderRadius = "5px";
    pokeCard1.style.width = "200px";
    

    pokeCard1.innerHTML = `
        <p>Name: ${pokemonData1.name}</p>
        <p>Type: ${pokemonData1.types.map(type => type.type.name).join('/')}</p>
        <p>ID: ${pokemonData1.id.toString().padStart(3, '0')}</p>
        <ul id="stats${pokemonData1.id}"></ul>
    `;
    // Append the card to a container
const cardContainer = document.getElementById("pokemonCardContainer");
cardContainer.appendChild(pokeCard1);

// Set the sprite image
const pokemonSprite = pokemonData1.sprites.front_default;
const imgElement = document.createElement("img");
imgElement.src = pokemonSprite;
imgElement.classList.add("pokemon-sprite");
pokeCard1.appendChild(imgElement);


//
statsData1.forEach(stat=> {
  const statsList = pokeCard1.querySelector(`#stats${pokemonData1.id}`);
  const statItem = document.createElement("li");
  statItem.textContent = `${stat.stat.name}: ${stat.base_stat}`;
  statsList.appendChild(statItem);
});

// Display Pokémon stats
const statsList = document.getElementById("statsList");
statsData1.forEach(stat => {
    const statItem = document.createElement("li");
    statItem.textContent = `${stat.stat.name}: ${stat.base_stat}`;
    statsList.appendChild(statItem);
});
  }
  createPokecard1();
}
