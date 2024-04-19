const url = "https://pokeapi.co/api/v2/pokemon/";
const card = document.getElementById("card");
const btn = document.getElementById("btn");

let getPokeData = () => {
    //Generate a random pokemon id between 1 and 150
    let id = Math.floor(Math.random() * 150) + 1;
    const combinedUrl = url + id;
    fetch(combinedUrl) 
        .then((response) => response.json())
        .then((data) => {
            generateCard(data);
            
        });
    };
    
//Get data to display onto the card
let generateCard = (data) => {
    const spriteImg = data.sprites.front_default;
    const name = data.name;
    const heldItem = data.held_items[1];
    console.log(data);

//inner html to be able to call the elements that populate the card
card.innerHTML = `
    <img src = ${spriteImg}/>
    <h2 class = "pokeName">${name}</h2>
    <div class = "types">
    </div>
    <div class = "heldItem">
        <p>${heldItem}</p>
    </div>    
    `;
//get the pokemons type each time the card is generated
appendTypes(data.types);
};


let appendTypes = (types) => {
  types.forEach ((item) => {
    let span = document.createElement("SPAN");
    span.textContent = item.type.name;
    document.querySelector(".types").appendChild(span);
  }); 
};

btn.addEventListener("click", getPokeData);
window.addEventListener("load", getPokeData);

