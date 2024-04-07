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
    return `<li>${audioName}</li>`;  // Remove onclick attribute
  });

  resultbx.innerHTML = "<ul>" + content.join('') + "</ul>";

  // Add event listener to each <li> element after they are appended to the DOM
  const resultListItems = document.querySelectorAll('.result-bx ul li');
  resultListItems.forEach(item => {
    item.addEventListener('click', function() {
      fillInputBox(this);
    });
  });
}

// Function to fill input box with clicked item's text
function fillInputBox(li) {
  const selectedValue = li.innerHTML;
  inputBox.value = selectedValue; // Populate input box with clicked item's text
  resultbx.innerHTML = ''; // Clear result box

  // Trigger search after autofilling
  inputBox.dispatchEvent(new Event('keyup'));
}

// Search the Audio
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
      // Hide the others
      cards[index].classList.add("hide");
    }
  });
});

// Array of liked
let likedAudios = [];

// Like an audio
function toggleLike(index) {
  const audio = audios.data[index];
  const likeBtn = document.getElementById(`like-btn-${index}`);

  // Check if audio is already liked
  const isLiked = likedAudios.some(item => item === audio);
  
  if (!isLiked) {
    // Add to liked audios
    likedAudios.push(audio);
    likeBtn.src = "img/red-heart.png";
    document.querySelector(`.card:nth-child(${index + 1})`).classList.add("liked");
  } else {
    // Remove from liked audios
    const audioIndex = likedAudios.findIndex(item => item === audio);
    likedAudios.splice(audioIndex, 1);
    likeBtn.src = "img/empty-heart.png";
    document.querySelector(`.card:nth-child(${index + 1})`).classList.remove("liked");
  }

  likeBtn.style.cursor = "pointer";
  
  updateLikedUI();
}

// Function to update the UI for liked items
function updateLikedUI() {
  const likesContainer = document.querySelector('.likes');
  likesContainer.innerHTML = ''; // Clear previous content
  
  const liked = likedAudios.length;
  
  if (liked > 0) {
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
  card.classList.add("card", audio.myLikes, "hide");

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
  let name = document.createElement("h3");
  name.classList.add("audio-name");
  name.innerText = audio.audioName;
  container.appendChild(name);

  // Audio category
  let category = document.createElement("h4");
  category.classList.add("audio-category");
  category.innerText = audio.category;
  container.appendChild(category);

  // Like button
  let likeBtn = document.createElement('img');
  likeBtn.classList.add('like-btn');
  likeBtn.setAttribute('id', `like-btn-${i}`);
  likeBtn.setAttribute('src', 'img/empty-heart.png');
  likeBtn.style.width = '30px';
  likeBtn.style.height = '30px';
  likeBtn.addEventListener('click', () => toggleLike(i));
  container.appendChild(likeBtn);

  // Audio
  let audioElement = document.createElement("audio");
  audioElement.setAttribute("controls", "");
  audioElement.classList.add("audio-control");
  let sourceElement = document.createElement("source");
  sourceElement.setAttribute("src", audio.audioToPlay);
  sourceElement.setAttribute("type", "audio/mpeg");
  audioElement.appendChild(sourceElement);
  container.appendChild(audioElement);

  card.appendChild(container);
  document.getElementById("audios").appendChild(card);

}

// Initially display all audios
window.onload = () => {
  filterAudio("all");
  updateLikedUI();
};
