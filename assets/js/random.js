const pokemon = ['Pokemon1', 'Pokemon2', 'Pokemon3'];
const getPokemon = document.getElementById("get-pokemon");

getPokemon.onclick = function() {
    document.getElementById("get-pokemon-result").innerText = getRandomPokemon(pokemon);
}

function getRandomPokemon(arr) {
    const randomIndex = Math.floor(Math.random() * arr.length);
    const item = arr[randomIndex];

    return item;
}
