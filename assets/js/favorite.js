// Get the button element
const favButton = document.getElementById('toggleFavButton');

// Get the images
const defaultImage = document.getElementById('defaultImage');
const clickedImage = document.getElementById('clickedImage');

// Add event listener to the button
favButton.addEventListener('click', function() {
  // Toggle the visibility of the images
  defaultImage.classList.toggle('hidden');
  defaultImage.classList.toggle('visible');
  clickedImage.classList.toggle('hidden');
  clickedImage.classList.toggle('visible');
});