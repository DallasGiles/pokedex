// Accessing the joke api 
const jokeContainer = document.getElementById("jokeText");
const btn = document.getElementById("jokeButton");
const url = "https://v2.jokeapi.dev/joke/Programming?blacklistFlags=nsfw,religious,political,racist,sexist,explicit&type=single";
// Getting the joke and then displaying only the item.joke cleanly onto the page. Getting new joke when button is clicked
let getJoke = () => {
    fetch(url)
    .then(data => data.json())
    .then (item =>{
        jokeContainer.textContent = `${item.joke}`;
    });
}
btn.addEventListener("click",getJoke);
getJoke();

