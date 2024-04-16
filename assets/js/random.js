function getRandomPokemon(arr) {
    const randomIndex = Math.floor(Math.random() * arr.length);

    const item= arr[randomIndex];

    return item;
}

const pokemon = ['Pokemon1', 'Pokemon2', 'Pokemon3'];

const result= getRandomPokemon(pokemon);
console.log(result)

const button = document.getElementById("button");
var randomIndex = pokemon [Math.random() * pokemon.length | 0]

button.onclick = function() {
    randomIndex = [Math.random()* pokemon.length |  0]
    document.getElementsByClassName('text')[0]  = randomIndex
}