import { audios } from "./dataset.js";

// Function to fill input box with clicked item's text
function fillInputBox(li) {
  const selectedValue = li.innerHTML;
  inputBox.value = selectedValue; // Populate input box with clicked item's text
  resultbx.innerHTML = ''; // Clear result box

  // Trigger search after autofilling
  inputBox.dispatchEvent(new Event('keyup'));
}

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

// Search the Audio
document.getElementById("search").addEventListener("click", () => {
  let searchInput = document.getElementById("input-box").value.toLowerCase(); // Convert input to lowercase for case-insensitive search
  let elements = document.querySelectorAll(".audio-name");

  elements.forEach((element) => {
    let card = element.closest('.card'); 
    if (element.textContent.toLowerCase().includes(searchInput)) { 
      card.classList.remove("hide"); // Show the card
    } else {
      card.classList.add("hide"); // Hide the card
    }
  });

  // Clear input box after search
  document.getElementById("input-box").value = "";
  document.querySelector(".result-bx").innerHTML = "";
});

// Display the result
function display(result) {
  const content = result.map((audioName) => {
    return `<li onclick="fillInputBox(this)">${audioName}</li>`; 
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

// Array of liked
let likedAudios = [];

// Function to update the UI for liked items
function updateLikedUI() {
  const likesContainer = document.querySelector('.likes');
  
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

// Likes empty handler
const errorHandler = document.getElementById("error-handler");

// Function to display liked audios
document.getElementById("like-btn").addEventListener("click", () => {
  const cards = document.querySelectorAll('.card');
  cards.forEach(card => card.classList.add('hide')); // Hide all cards initially
  errorHandler.innerHTML = "";

  // Check if likedAudios array is empty
  if (likedAudios.length === 0) {
    errorHandler.innerHTML = "There are no elements inside of your liked list!";
    errorHandler.classList.add("show");
  }
  else {
    likedAudios.forEach(audio => {
      const index = audios.data.indexOf(audio);
      if (index !== -1) {
        const card = document.querySelector(`.card:nth-child(${index + 1})`);
        if (card) {
          card.classList.remove('hide');
          const likeBtn = card.querySelector(".heart-icon");
          if (likeBtn) { 
            likeBtn.src = 'img/red-heart.png';
          }
        }
      }
    });
  }
});

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

// PopUp
var popUp = document.getElementById("pop-up");
var btn = document.getElementById("add-button");
var span = document.getElementsByClassName("close")[0];

// Open PopUp
btn.onclick = function() {
  popUp.style.display = "block";
}

// Close PopUp with x
span.onclick = function() {
  popUp.style.display = "none";
}

// Outside of the PopUp
window.onclick = function(event) {
    if (event.target == popUp) {
      popUp.style.display = "none";
    }
}

// Submitting to add
document.getElementById("add-form").addEventListener("submit", function(event) {

    var audioName = document.getElementById("audio-name").value;
    var category = document.getElementById("category").value;
    var emoji = document.getElementById("emoji").value;
    var audioUrl = document.getElementById("audio-url").value;

    var newAudio = {
        audioName: audioName,
        category: category,
        emoji: emoji,
        audioToPlay: audioUrl
    };

    audios.data.push(newAudio);

    // Close the popUp
    popUp.style.display = "none";

    filterAudio("all");
    
    // Testing
    console.log("The length is :" + audios.data.length);
});


// Populate audio cards
function createCards() {

  for (let i = 0; i < audios.data.length; i++) {
    const audio = audios.data[i];
    
    // Card section
    let card = document.createElement("div");
    card.classList.add("card", audio.category, "hide");
    card.classList.add("card", audio.myLikes, "hide");

    // EmojiContainer
    let imgContainer = document.createElement("div");
    imgContainer.classList.add("emoji-container");

    // Emoji tag
    let emoji = document.createElement("span");
    emoji.innerText = audio.emoji;
    imgContainer.appendChild(emoji);
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
    likeBtn.addEventListener('click', () => toggleLike(i));
    container.appendChild(likeBtn);

    // Ratings
    let rating = document.createElement("h3");
    rating.classList.add("audio-rating");
    rating.innerText = audio.rating;
    container.appendChild(rating);

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
}

// Initially display all audios
window.onload = () => {
  createCards();
  filterAudio("all");
};
