let placeholderText = "He drinks because she scolds, he thinks; She thinks she scolds because he drinks; And neither will admit what's true, That he's a sot and she's a shrew.";
const placeholderContainer = document.getElementById("placeholderContainer");
const difficultySelect = document.getElementById("difficulty");
const customButton = document.getElementById("customButton");
const customInputContainer = document.getElementById("customInputContainer");
const customInput = document.getElementById("customInput");
const submitCustomText = document.getElementById("submitCustomText");

let startTime = null;
let correctCount = 0;
let totalCount = 0;
let characters; // Initialize characters here
let currentIndex = 0; // Initialize currentIndex here

// Function to render text based on selected difficulty
function renderText(difficulty) {
    placeholderContainer.innerHTML = ''; // Clear existing content
    Array.from(placeholderText).forEach(character => {
        const charDiv = document.createElement('div');

        if (character === ' ') {
            charDiv.classList.add('space');
            charDiv.innerText = ' ';
        } else {
            charDiv.classList.add('letter');

            if (difficulty === "easy") {
                charDiv.innerText = character;
            } else if (difficulty === "medium") {
                charDiv.innerText = '_';
            } else if (difficulty === "hard") {
                charDiv.innerText = '';
            }
        }
        
        placeholderContainer.appendChild(charDiv);
    });
    characters = document.querySelectorAll('.letter, .space'); // Initialize characters here after rendering
    applyPulseToCurrentChar(); // Start pulsing the first character
}

// Initialize with easy difficulty
renderText("easy");

// Update placeholder text when difficulty changes
difficultySelect.addEventListener("change", function() {
    renderText(this.value);
    currentIndex = 0; // Reset typing index on difficulty change
    startTime = null; // Reset start time
    correctCount = 0; // Reset correct count
    totalCount = 0;   // Reset total typed count
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
    startTime = null; // Reset start time
    correctCount = 0; // Reset correct count
    totalCount = 0;   // Reset total typed count
});

// Apply pulsing effect to the current character
function applyPulseToCurrentChar() {
    characters.forEach((char, index) => char.classList.remove('pulse')); // Remove pulse from all characters
    if (currentIndex < characters.length) {
        characters[currentIndex].classList.add('pulse'); // Add pulse to current character
    }
}

document.addEventListener("keydown", function(event) {
    // Prevent typing interaction with the dropdown or custom input when focused
    if (document.activeElement === difficultySelect || document.activeElement === customInput) return;

    // Start the timer on the first keystroke
    if (startTime === null) {
        startTime = new Date();
    }

    // Handle typing (forward input)
    if (event.key.length === 1 && !event.ctrlKey && currentIndex < characters.length) {
        const currentChar = characters[currentIndex];
        totalCount++; // Increment total characters typed

        if (event.key === " ") {
            if (currentChar.classList.contains('space')) {
                correctCount++; // Increment correct count for spaces
                currentChar.style.backgroundColor = "lightgreen"; // Add green flash for space
                setTimeout(() => {
                    currentChar.style.backgroundColor = "transparent";
                }, 200);
            } else if (currentChar.classList.contains('letter')) {
                currentChar.innerText = "_";
                currentChar.style.color = "red";
            }
        } else if (currentChar.classList.contains('letter')) {
            if (event.key.toLowerCase() === placeholderText[currentIndex].toLowerCase()) {
                correctCount++; // Increment correct count for correct letter
                currentChar.style.color = "black";
                currentChar.style.backgroundColor = "lightgreen"; // Add green flash
                setTimeout(() => {
                    currentChar.style.backgroundColor = "transparent";
                }, 200);
            } else {
                currentChar.style.color = "red"; // Incorrect letter
            }
            currentChar.innerText = event.key;
        }
        currentIndex++; // Move to the next character
        applyPulseToCurrentChar(); // Update pulse to new current character

        // Check if all characters have been typed
        if (currentIndex >= characters.length) {
            calculateStats(); // Calculate and display stats
        }
    }

    // Handle deleting (backward input)
    else if (event.key === "Backspace" && currentIndex > 0) {
        currentIndex--; // Move back to the previous character
        totalCount++; // Count backspace as an action in total characters
        const currentChar = characters[currentIndex];
        
        if (currentChar.classList.contains('space')) {
            currentChar.style.backgroundColor = "transparent";
        } else if (currentChar.classList.contains('letter')) {
            currentChar.innerText = placeholderText[currentIndex];
            currentChar.style.color = "#888";
            currentChar.style.backgroundColor = "transparent";
            if (difficultySelect.value === "medium") {
                currentChar.innerText = "_";
            } else if (difficultySelect.value === "hard") {
                currentChar.innerText = '';
            }
        }
        applyPulseToCurrentChar(); // Update pulse to new current character
    }
});

// Function to calculate and display typing stats
function calculateStats() {
    const endTime = new Date();
    const timeTaken = (endTime - startTime) / 1000; // Time in seconds
    const accuracy = (correctCount / totalCount) * 100;
    const lettersPerSecond = correctCount / timeTaken;

    // Dynamically create review box elements
    const reviewBox = document.createElement('div');
    reviewBox.classList.add('review-box');
    reviewBox.style.position = 'fixed';
    reviewBox.style.top = '0';
    reviewBox.style.left = '0';
    reviewBox.style.width = '100%';
    reviewBox.style.height = '100%';
    reviewBox.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    reviewBox.style.display = 'flex';
    reviewBox.style.alignItems = 'center';
    reviewBox.style.justifyContent = 'center';
    reviewBox.style.zIndex = '10';

    const reviewContent = document.createElement('div');
    reviewContent.style.backgroundColor = 'white';
    reviewContent.style.padding = '20px';
    reviewContent.style.textAlign = 'center';

    const statsMessage = `
        Time Taken (seconds): ${timeTaken.toFixed(2)}<br>
        Letters Per Second: ${lettersPerSecond.toFixed(2)}<br>
        Accuracy (%): ${accuracy.toFixed(2)}
    `;
    
    const statsText = document.createElement('p');
    statsText.innerHTML = statsMessage;
    statsText.style.marginBottom = '20px';
    statsText.style.fontSize = '1.2em';

    const closeButton = document.createElement('button');
    closeButton.innerText = 'Close';
    closeButton.style.margin = '5px';
    closeButton.style.padding = '10px 20px';
    closeButton.style.fontSize = '1em';
    closeButton.style.cursor = 'pointer';

    const increaseDifficultyButton = document.createElement('button');
    increaseDifficultyButton.innerText = 'Increase Difficulty';
    increaseDifficultyButton.style.margin = '5px';
    increaseDifficultyButton.style.padding = '10px 20px';
    increaseDifficultyButton.style.fontSize = '1em';
    increaseDifficultyButton.style.cursor = 'pointer';

    // Append elements to review box
    reviewContent.appendChild(statsText);
    reviewContent.appendChild(closeButton);
    reviewContent.appendChild(increaseDifficultyButton);
    reviewBox.appendChild(reviewContent);
    document.body.appendChild(reviewBox);

    // Event listeners for the review box buttons
    closeButton.addEventListener("click", function() {
        document.body.removeChild(reviewBox); // Remove review box from DOM
    });

    increaseDifficultyButton.addEventListener("click", function() {
        // Increase the difficulty level
        if (difficultySelect.value === "easy") {
            difficultySelect.value = "medium";
        } else if (difficultySelect.value === "medium") {
            difficultySelect.value = "hard";
        } else if (difficultySelect.value === "hard") {
            alert("You are already at the hardest difficulty!");
        }
        // Update the text with new difficulty
        renderText(difficultySelect.value);
        currentIndex = 0;
        startTime = null;
        correctCount = 0;
        totalCount = 0;
        document.body.removeChild(reviewBox); // Remove review box from DOM
    });
}
