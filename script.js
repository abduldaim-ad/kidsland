const colors = ["red", "pink", "blue", "grey", "yellow", "orange", "green", "purple"];
const backgrounds = ["https://miro.medium.com/v2/resize:fit:587/1*K4ftlEr6o_vZp82WeQsOYA.png"]; // Add URLs of your background images here
let currentNumber = 0;

function getRandomBackground() {
    const randomIndex = Math.floor(Math.random() * backgrounds.length);
    return backgrounds[randomIndex];
}

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomColor() {
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
}

function speak(message) {
    const utterance = new SpeechSynthesisUtterance(message);
    window.speechSynthesis.speak(utterance);
}

document.addEventListener("DOMContentLoaded", function() {
    const numberContainer = document.getElementById("number-container");
    const randomNumberElement = document.getElementById("random-number");
    const minInput = document.getElementById("min");
    const maxInput = document.getElementById("max");
    const sequenceModeCheckbox = document.getElementById("sequence-mode");

    function getRandomLetter(language) {
        let alphabet;
        console.log(language,"djflsd")
        if (language === 'englishcaps') {
            alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        } else if (language === 'englishsmall') {
            alphabet = 'abcdefghijklmnopqrstuvwxyz';
        } else if (language === 'urdu') {
            alphabet = ['ا', 'ب', 'پ', 'ت', 'ٹ', 'ث', 'ج', 'چ', 'ح', 'خ', 'د', 'ڈ', 'ذ', 'ر', 'ڑ', 'ز', 'ژ', 'س', 'ش', 'ص', 'ض', 'ط', 'ظ', 'ع', 'غ', 'ف', 'ق', 'ک', 'گ', 'ل', 'م', 'ن', 'و', 'ہ', 'ھ', 'ء', 'ی', 'ے'];
        }

        const randomIndex = Math.floor(Math.random() * alphabet.length);
        return alphabet[randomIndex];
    }

    function updateNumberAndColor() {
        const min = parseInt(minInput.value);
        const max = parseInt(maxInput.value);
        const isSequence = sequenceModeCheckbox.checked;
        const selectedType = document.querySelector('input[name="type"]:checked').value;
        let randomValue;
        let randomNum;

        const randomBackground = getRandomBackground();
        numberContainer.style.backgroundImage = randomBackground;

        if (sequenceModeCheckbox.checked) {
            currentNumber++;
            if (currentNumber > max) currentNumber = min;
            randomNum = currentNumber;
        } else {
            randomNum = getRandomNumber(min, max);
        }

        const randomColor = getRandomColor();
        randomNumberElement.textContent = randomNum;
        numberContainer.style.backgroundColor = randomColor;

        if (selectedType === 'numbers') {
            randomValue = isSequence ? getNextSequenceNumber(min, max) : getRandomNumber(min, max);
        } else if (selectedType === 'englishsmall' || selectedType === 'englishcaps' || selectedType === 'urdu-letters') {
            const language = selectedType.split('-')[0];
            randomValue = isSequence ? getNextSequenceLetter(language) : getRandomLetter(language);
        }

        randomNumberElement.textContent = randomValue;

        // Add animation class
        randomNumberElement.classList.add('animate');

        // Remove animation class after the transition ends
        setTimeout(() => {
            randomNumberElement.classList.remove('animate');
        }, 500);
    }

    let currentNumber = 0;
    let currentLetterIndex = 0;

    function getNextSequenceNumber(min, max) {
        currentNumber++;
        if (currentNumber > max) currentNumber = min;
        return currentNumber;
    }

    function getNextSequenceLetter(language) {
        const alphabetLength = (language === 'english') ? 52 : 10; // 52 for English, 10 for Urdu
        currentLetterIndex++;
        if (currentLetterIndex >= alphabetLength) currentLetterIndex = 0;
        return getRandomLetter(language);
    }

    numberContainer.addEventListener("click", updateNumberAndColor);

    // Initialize with a random number and color
    updateNumberAndColor();

    // Speech Recognition
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = function(event) {
        const spokenNumber = event.results[0][0].transcript;
        const currentNumber = randomNumberElement.textContent;
        if (spokenNumber == currentNumber) {
            const compliments = ["Good job!", "Excellent!", "Well done!", "Perfect!"];
            const compliment = compliments[Math.floor(Math.random() * compliments.length)];
            speak(compliment);
        } else {
            speak("Try again.");
        }
    }

    recognition.onspeechend = function() {
        recognition.stop();
    }

    recognition.onerror = function(event) {
        alert('Error occurred in recognition: ' + event.error);
    }

    // Start speech recognition on click
    numberContainer.addEventListener('click', () => {
        recognition.start();
    });
});