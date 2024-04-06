import { audios } from "./dataset.js";

document.addEventListener("DOMContentLoaded", function() {

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
      console.log(result);
    }
    display(result);
    // If no value in result
    if (!result.length) {
      resultbx.innerHTML = '';
    }
  }

  // Diplay the result
  function display(result) {
    const content = result.map((audioName) => {
      return "<li onclick=selectInput(this)>" + audioName + "</li>";
    });

    resultbx.innerHTML = "<ul>" + content.join('') + "</ul>";
  }

  // Hide the input when the user selected one
  function selectInput(li) {
    inputBox.value = li.innerHTML;
    resultbx.innerHTML = '';
  }
});
