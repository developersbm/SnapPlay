import { audios } from "./dataset.js";

// Extracting audioNames from the audios dataset
const availableKeywords = audios.data.map(audio => audio.audioName);

const resultbx = document.querySelector(".result-bx");
const inputBox = document.getElementById("input-box");

// When a key is pressed the search bar starts searching
inputBox.onkeyup = function() {
  let result = [];
  let input = inputBox.value;
  // Filter to see similarities
  if (input.length) {
    result = availableKeywords.filter((audioName) => {
      return audioName.toLowerCase().includes(input.toLowerCase());
    });
  }
  display(result);
  // If no value in result
  if (!result.length) {
    resultbx.innerHTML = '';
  }
}

// Display the result
function display(result) {
  const content = result.map((audioName) => {
    return "<li onclick=selectInput(this)>" + audioName + "</li>";
  });

  resultbx.innerHTML = "<ul>" + content.join('') + "</ul>";
}

// Hide the input when the user selects one
function selectInput(li) {
  inputBox.value = li.innerHTML;
  resultbx.innerHTML = '';
}

// Populate audio cards
for (let audio of audios.data) {

  // Card section (Shown depending on category)
  let card = document.createElement("div");
  card.classList.add("card", audio.category, "hide");

  // ImageContainer
  let imgContainer = document.createElement("div");
  imgContainer.classList.add("image-container");

  // Img tag
  let image = document.createElement("img");
  image.setAttribute("src", audio.image);
  imgContainer.appendChild(image);
  card.appendChild(imgContainer);

  // Container
  let container = document.createElement("div");
  container.classList.add("container");

  // Audio name
  let name = document.createElement("h5");
  name.classList.add("audio-name");
  name.innerText = audio.audioName.toUpperCase();
  container.appendChild(name);

  card.appendChild(container);
  document.getElementById("audios").appendChild(card);

}
  
// Initially display all audios
window.onload = () => {
  filterAudio("all");
};