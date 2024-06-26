import { audios } from "./dataset.js";

// Error handler
function displayErrorMessage(message) {
  alert(message);
}

// Add event listeners to buttons
document.querySelectorAll(".btn-val").forEach(button => {
  button.addEventListener("click", function(event) {
    filterAudio(event);
  });
});

// Sorting Options
document.getElementById('sort-select').addEventListener('change', function() {
  let value = this.value;
  if (value === 'name-random') {
    sortByRandom();
  } else if (value === 'name-asc') {
    sortByNameAsc();
  } else if (value === 'name-desc') {
    sortByNameDesc();
  }
  filterAudio({ target: { dataset: { value: "all" } } });
});

// Update the cards when sorted
function updateCards() {
  const cardElements = document.querySelectorAll(".card");

  cardElements.forEach((cardElement, index) => {
    const audio = audios.data[index];
    if (audio) {
      
      // Update emoji
      const emojiSpan = cardElement.querySelector('.emoji');
      if (emojiSpan) {
        emojiSpan.innerText = audio.emoji;
      }

      // Update audio name
      const name = cardElement.querySelector('.audio-name');
      if (name) {
        name.innerText = audio.audioName;
      }

      // Update audio category
      const category = cardElement.querySelector('.audio-category');
      if (category) {
        category.innerText = audio.category;
      }

      // Update rating
      const rating = cardElement.querySelector('.audio-rating');
      if (rating) {
        rating.innerText = audio.rating;
      }

      // Update audio source
      const audioElement = cardElement.querySelector('.audio-control');
      if (audioElement) {
        audioElement.setAttribute('src', audio.audioToPlay);
      }

      // Update like button
      const likeBtn = cardElement.querySelector('.like-btn');
      if (likeBtn) {
        likeBtn.src = likedAudios.some(item => item === audio) ? 'img/red-heart.png' : 'img/empty-heart.png';
        likeBtn.addEventListener('click', () => toggleLike(index));
      }

      // Update card class based on liked status
      if (likedAudios.some(item => item === audio)) {
        cardElement.classList.add('liked');
      } else {
        cardElement.classList.remove('liked');
      }
    }
  });
  createCards();
}

// Display cards in random order
function sortByRandom() {
  audios.data.sort(() => Math.random() - 0.5);
  updateCards();
}

// Display cards in ascending order
function sortByNameAsc() {
  audios.data.sort(function(first, second) {
    if (first.audioName < second.audioName) {
      return -1;
    } else if (first.audioName > second.audioName) {
      return 1;
    } else {
      return 0;
    }
  });
  updateCards();
}

// Display cards in descending order
function sortByNameDesc() {
  audios.data.sort(function(first, second) {
    if (first.audioName > second.audioName) {
      return -1;
    } else if (first.audioName < second.audioName) {
      return 1;
    } else {
      return 0;
    }
  });
  updateCards();
}

// Search button
document.querySelector("#search").addEventListener("click", function() {
  const searchValue = document.getElementById("input-box").value.toLowerCase();
  const cards = document.querySelectorAll(".card");

  cards.forEach(card => {
    const audioName = card.querySelector(".audio-name").innerText.toLowerCase();
    if (audioName.includes(searchValue)) {
      card.classList.remove("hide");
    } else {
      card.classList.add("hide");
    }
  });
    // Clear the input-box & result-bx
    document.getElementById("input-box").value = "";
    document.querySelector(".result-bx").innerHTML = "";
});

// Filter
function filterAudio(event) {
  let value = event.target.dataset.value;

  // Button class code
  let buttons = document.querySelectorAll(".btn-val");
  buttons.forEach((button) => {
    // Check if value equals data-value attribute
    if (value.toUpperCase() == button.dataset.value.toUpperCase()) {
      button.classList.add("active");
    } else {
      button.classList.remove("active");
    }
  });

  let elements = document.querySelectorAll(".card");

  // Only hide cards if the value is not "all"
  if (value !== "all") {
    elements.forEach((element) => element.classList.add("hide"));
  }

  elements.forEach((element) => {
    if (value === "all" ||  
      (element.classList.contains(value) && !element.classList.contains("liked")) ||  
      (value === "Likes" && element.classList.contains("liked")) 
    ) {
      element.classList.remove("hide");
    }
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

// Submitting to add a card
document.getElementById("add-form").addEventListener("submit", function(event) {
  event.preventDefault(); // Prevent form submission from refreshing the page

  // Get values from form fields
  var audioName = document.getElementById("audio-name").value;
  var emoji = document.getElementById("emoji").value;
  var category = document.getElementById("category").value;
  var rating = document.getElementById("rating-cat").value;
  var audioUrl = document.getElementById("audio-url").value;

  // Construct new audio object
  var newAudio = {
      audioName: audioName,
      category: category,
      rating: rating,
      emoji: emoji,
      audioToPlay: audioUrl
  };

  // Add new audio to the dataset
  audios.data.push(newAudio);

  // Close the pop-up
  document.getElementById("pop-up").style.display = "none";

  // Update UI to reflect the changes
  createCards();
  filterAudio({ target: { dataset: { value: "all" } } });
  alert("Your new audio has been added at the end of the list!");
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
  }
}

// Function to display liked audios
document.getElementById("like-btn").addEventListener("click", () => {
  const cards = document.querySelectorAll('.card');

  // Check if likedAudios array is empty
  if (likedAudios.length === 0) {
    displayErrorMessage("There are no elements inside of your liked list!");
  }
  else {
    cards.forEach(card => card.classList.add('hide')); // Hide all cards initially
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
  const audioContainer = document.getElementById("audios");
  audioContainer.innerHTML - '';

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

// Initially display all audios
window.onload = () => {
  sortByRandom();
  filterAudio({ target: { dataset: { value: "all" } } });
  createCards(); // Create cards initially
};

// Populate audio cards
function createCards() {
  const audiosContainer = document.getElementById("audios");
  audiosContainer.innerHTML = ""; // Clear existing cards

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
    emoji.classList.add("emoji");
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
    audiosContainer.appendChild(card);

    if (!availableKeywords.includes(audio.audioName)) {
      availableKeywords.push(audio.audioName);
    }

    // Event listener for like button
    likeBtn.addEventListener('click', () => toggleLike(i));
  }
}

// Initially display all audios
window.onload = () => {
  sortByRandom();
  filterAudio({ target: { dataset: { value: "all" } } });
};