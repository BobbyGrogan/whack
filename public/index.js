let placeholderText = "He drinks because she scolds, he thinks; She thinks she scolds because he drinks; And neither will admit what's true, That he's a sot and she's a shrew.";
const placeholderContainer = document.getElementById("placeholderContainer");
const difficultySelect = document.getElementById("difficulty");
const customButton = document.getElementById("customButton");
const customInputContainer = document.getElementById("customInputContainer");
const customInput = document.getElementById("customInput");
const revealButton = document.getElementById("revealButton");
const submitCustomText = document.getElementById("submitCustomText");

let startTime = null;
let correctCount = 0;
let totalCount = 0;
let characters;
let currentIndex = 0;
let pulseTimeout; // Timeout for controlling pulse

// Function to render text based on selected difficulty
function renderText(difficulty) {
    placeholderContainer.innerHTML = ''; // Clear existing content

    placeholderText.split('').forEach(character => {
        const charDiv = document.createElement('div');

        if (character === ' ') {
            charDiv.classList.add('space');
            charDiv.innerText = ' ';
        } else if (character === '\t') {
            charDiv.classList.add('tab');
            charDiv.innerText = '\t'; // Preserves tabs as well
        } else {
            charDiv.classList.add('letter');

            if (difficulty === "easy") {
                charDiv.innerText = character;
            } else if (difficulty === "medium") {
                charDiv.innerText = '_';
            } else if (difficulty === "hard") {
                charDiv.innerText = ''; // Leave character blank in hard mode
            }
        }

        placeholderContainer.appendChild(charDiv);
    });

    characters = document.querySelectorAll('.letter, .space, .tab'); // Initialize characters with tabs as well
    applyPulseToCurrentChar(); // Start pulsing the first character if inactive
}

// Initialize with easy difficulty
renderText("easy");

// Reveal word when the reveal button is clicked
revealButton.addEventListener("click", function() {
    
});

// Update placeholder text when difficulty changes
difficultySelect.addEventListener("change", function() {
    renderText(this.value);
    currentIndex = 0; // Reset typing index on difficulty change
    startTime = null; // Reset start time
    correctCount = 0; // Reset correct count
    totalCount = 0;   // Reset total typed count
    applyPulseToCurrentChar(); // Restart pulse for the new difficulty level
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
    applyPulseToCurrentChar(); // Restart pulse
});

// Apply pulsing effect to the current character if no typing occurs within 0.5 seconds
function applyPulseToCurrentChar() {
    clearTimeout(pulseTimeout); // Clear any existing pulse timeout

    pulseTimeout = setTimeout(() => {
        characters.forEach((char) => char.classList.remove('pulse')); // Remove pulse from all characters
        if (currentIndex < characters.length) {
            characters[currentIndex].classList.add('pulse'); // Add pulse to current character
        }
    }, 500); // Wait 0.5 seconds to apply pulse
}

document.addEventListener("keydown", function(event) {
    // Prevent typing interaction with the dropdown or custom input when focused
    if (document.activeElement === difficultySelect || document.activeElement === customInput) return;

    // Clear the pulse effect immediately on typing
    characters.forEach(char => char.classList.remove('pulse'));
    clearTimeout(pulseTimeout); // Stop pulsing immediately on typing

    // Start the timer on the first keystroke
    if (startTime === null) {
        startTime = new Date();
    }

    // Handle Tab key for autocomplete
    if (event.key === "Tab") {
        event.preventDefault(); // Prevent default tab behavior

        // Find the next word from the current index
        let endIndex = currentIndex;
        while (endIndex < placeholderText.length && placeholderText[endIndex] !== ' ') {
            endIndex++;
        }

        // Autocomplete the characters in the current word
        for (let i = currentIndex; i < endIndex; i++) {
            if (i >= characters.length) break;
            const currentChar = characters[i];
            currentChar.innerText = placeholderText[i];
            currentChar.style.color = "black"; // Mark as correctly filled
            correctCount++; // Increment correct count for each auto-filled character
        }

        // Move currentIndex to the end of the autocompleted word
        currentIndex = endIndex + 1;
        applyPulseToCurrentChar(); // Update pulse timer
        return;
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
        applyPulseToCurrentChar(); // Reset pulse timer

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
                currentChar.innerText = ''; // Ensure it stays blank in hard mode
            }
        }
        applyPulseToCurrentChar(); // Reset pulse timer
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
