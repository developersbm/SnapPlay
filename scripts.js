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
    return `<li onclick="fillInputBox(this)">${audioName}</li>`; 
  });

  resultbx.innerHTML = "<ul>" + content.join('') + "</ul>";
}

// Function to fill input box with clicked item's text
function fillInputBox(li) {
  const selectedValue = li.innerHTML;
  inputBox.value = selectedValue; // Populate input box with clicked item's text
  resultbx.innerHTML = ''; // Clear result box

  inputBox.dispatchEvent(new Event('keyup'));
}


// Search the Audio
//Search button click
document.getElementById("search").addEventListener("click", () => {
  // Variables
  let searchInput = document.getElementById("input-box").value;
  let elements = document.querySelectorAll(".audio-name");
  let cards = document.querySelectorAll(".card");

  // Loop through the elements
  elements.forEach((element, index) => {
    // If text includes the search value
    if (element.innerText.includes(searchInput.toUpperCase())) {
      // Display the matching card
      cards[index].classList.remove("hide");
    } else {
      // Hide the others & hide the resultbx
      cards[index].classList.add("hide");
      resultbx.classList.add("hide");
    }
  });
});

// Like an audio
function toggleLike(index) {
  const audio = audios.data[index];
  const likeBtn = document.getElementById(`like-btn-${index}`);
  
  if (audio.myLikes === "NA") {
    // Add to liked audios
    audio.myLikes = "liked";
    likeBtn.style.color = "red"; // Change button color to red to indicate liked
  } else {
    // Remove from liked audios
    audio.myLikes = "NA";
    likeBtn.style.color = "black"; // Change button color to black to indicate not liked
  }

  likeBtn.style.cursor = "pointer";
  
  updateLikedUI();
}

// Function to update the UI for liked items
function updateLikedUI() {
  const likesContainer = document.querySelector('.likes');
  likesContainer.innerHTML = ''; // Clear previous content
  
  const likedAudios = audios.data.filter(audio => audio.myLikes === "liked");
  
  if (likedAudios.length > 0) {
    likedAudios.forEach((audio, index) => {
      const likedItem = document.createElement('div');
      likedItem.innerText = audio.audioName;
      likesContainer.appendChild(likedItem);
    });
  } else {
    const noLikesMessage = document.createElement('p');
    noLikesMessage.innerText = 'No liked audios yet.';
    likesContainer.appendChild(noLikesMessage);
  }
}

// Populate audio cards
for (let i = 0; i < audios.data.length; i++) {
  const audio = audios.data[i];
  
  // Card section
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

  // Like button
  let likeBtn = document.createElement('button');
  likeBtn.innerHTML = "O";
  likeBtn.setAttribute('id', `like-btn-${i}`);
  likeBtn.addEventListener('click', () => toggleLike(i));
  container.appendChild(likeBtn);

  card.appendChild(container);
  document.getElementById("audios").appendChild(card);
}

// Initially display all audios
window.onload = () => {
  filterAudio("all");
  updateLikedUI();
};
