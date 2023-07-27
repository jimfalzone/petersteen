// JavaScript file (e.g., audio.js)

// Get the reference to the audio element by its ID
const myAudio = document.getElementById('my-audio');

// Get the reference to the button by its ID
const playButton = document.getElementById('play-button');
const pauseButton = document.getElementById('pause-button');
const resumeButton = document.getElementById('resume-button');

// Get the reference to the <h1> tags for displaying current time and duration
const currentTimeDisplay = document.getElementById('current-time');
const songDurationDisplay = document.getElementById('song-duration');

// Function to format time in "MM:SS" format
function formatTime(timeInSeconds) {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Get the reference to the progress bar by its ID
const progressBar = document.getElementById('progress-bar');

// Function to update the current time display and progress bar
function updateCurrentTimeDisplay() {
    const currentTime = myAudio.currentTime;
    const duration = myAudio.duration;

    const formattedCurrentTime = formatTime(currentTime);
    const formattedDuration = formatTime(duration);

    // Update the combined content for current time and duration
    currentTimeDisplay.textContent = `${formattedCurrentTime} / ${formattedDuration}`;

    // Update the progress bar value based on the current time and duration
    progressBar.value = currentTime / duration;
}

// Update the current time display and duration at regular intervals
myAudio.addEventListener('timeupdate', updateCurrentTimeDisplay);

// Add an event listener for the 'click' event on the play button
playButton.addEventListener('click', function () {
    myAudio.play();

    // Hide the play button and show the pause button
    playButton.style.display = 'none';
    pauseButton.style.display = 'block';
});

// Add an event listener for the 'click' event on the pause button
pauseButton.addEventListener('click', function () {
    myAudio.pause();

    // Hide the pause button and show the resume button
    pauseButton.style.display = 'none';
    resumeButton.style.display = 'block';
});

// Add an event listener for the 'click' event on the resume button
resumeButton.addEventListener('click', function () {
    myAudio.play();

    // Hide the resume button and show the pause button
    resumeButton.style.display = 'none';
    pauseButton.style.display = 'block';
});
