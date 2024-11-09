let placeholderText = "He drinks because she scolds, he thinks; She thinks she scolds because he drinks; And neither will admit what's true, That he's a sot and she's a shrew.";
const placeholderContainer = document.getElementById("placeholderContainer");
const difficultySelect = document.getElementById("difficulty");
const customButton = document.getElementById("customButton");
const customInputContainer = document.getElementById("customInputContainer");
const customInput = document.getElementById("customInput");
const submitCustomText = document.getElementById("submitCustomText");

// Function to render text based on selected difficulty
function renderText(difficulty) {
    placeholderContainer.innerHTML = ''; // Clear existing content
    
    Array.from(placeholderText).forEach(character => {
        const charDiv = document.createElement('div');

        if (character === ' ') {
            charDiv.classList.add('space');
            charDiv.innerText = ' '; // Ensures space character is rendered
        } else {
            charDiv.classList.add('letter');

            if (difficulty === "easy") {
                charDiv.innerText = character; // Show actual character
            } else if (difficulty === "medium") {
                charDiv.innerText = '_'; // Show underscores
            } else if (difficulty === "hard") {
                charDiv.innerText = ''; // Hide letters completely
            }
        }
        
        placeholderContainer.appendChild(charDiv);
    });
}

// Initialize with easy difficulty
renderText("easy");

// Update placeholder text when difficulty changes
difficultySelect.addEventListener("change", function() {
    renderText(this.value);
    currentIndex = 0; // Reset typing index on difficulty change
});

// Show custom input overlay when the custom button is clicked
customButton.addEventListener("click", function() {
    customInputContainer.style.display = "flex";
    customInput.value = ''; // Clear input field
    customInput.focus(); // Focus on input field
});

// Submit custom text and update the display
submitCustomText.addEventListener("click", function() {
    placeholderText = customInput.value || placeholderText; // Use entered text or keep original
    renderText(difficultySelect.value); // Render with current difficulty
    customInputContainer.style.display = "none"; // Hide input overlay
    currentIndex = 0; // Reset typing index
});

// Track the index of the next character to replace
let currentIndex = 0;
let characters;

document.addEventListener("keydown", function(event) {
    // Prevent typing interaction with the dropdown or custom input when focused
    if (document.activeElement === difficultySelect || document.activeElement === customInput) return;

    characters = document.querySelectorAll('.letter, .space'); // Update character list

    // Handle typing (forward input)
    if (event.key.length === 1 && !event.ctrlKey && currentIndex < characters.length) {
        const currentChar = characters[currentIndex];
        
        if (event.key === " ") {
            if (currentChar.classList.contains('space')) {
                // Correctly typed space
                currentChar.style.backgroundColor = "lightgreen"; // Add green flash for space
                setTimeout(() => {
                    currentChar.style.backgroundColor = "transparent";
                }, 200);
            } else if (currentChar.classList.contains('letter')) {
                // If space is typed where a letter is expected, show underscore
                currentChar.innerText = "_";
                currentChar.style.color = "red";
            }
        } else if (currentChar.classList.contains('letter')) {
            // Compare the typed character with the placeholder character, ignoring case
            if (event.key.toLowerCase() === placeholderText[currentIndex].toLowerCase()) {
                currentChar.style.color = "black"; // Correct letter
                currentChar.style.backgroundColor = "lightgreen"; // Add green flash

                // Remove the flash effect after a delay
                setTimeout(() => {
                    currentChar.style.backgroundColor = "transparent";
                }, 200);
            } else {
                currentChar.style.color = "red"; // Incorrect letter
            }
            currentChar.innerText = event.key;
        }
        currentIndex++; // Move to the next character
    }

    // Handle deleting (backward input)
    else if (event.key === "Backspace" && currentIndex > 0) {
        currentIndex--; // Move back to the previous character
        const currentChar = characters[currentIndex];
        
        // Check if current character is a space or letter before resetting
        if (currentChar.classList.contains('space')) {
            currentChar.style.backgroundColor = "transparent"; // Reset background for spaces
        } else if (currentChar.classList.contains('letter')) {
            currentChar.innerText = placeholderText[currentIndex];
            currentChar.style.color = "#888"; // Reset color to placeholder color
            currentChar.style.backgroundColor = "transparent"; // Reset background color

            // Re-render based on difficulty if medium or hard
            if (difficultySelect.value === "medium") {
                currentChar.innerText = "_";
            } else if (difficultySelect.value === "hard") {
                currentChar.innerText = '';
            }
        }
    }
});