// JavaScript file (e.g., audio.js)

// Create an AudioContext instance
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

// Get the reference to the audio element by its ID
const audioElement = document.getElementById('my-audio');

// Create a MediaElementAudioSourceNode from the audio element
const audioSource = audioContext.createMediaElementSource(audioElement);

// Create a GainNode to control volume
const gainNode = audioContext.createGain();
audioSource.connect(gainNode);
gainNode.connect(audioContext.destination);

// Get the reference to the button by its ID
const playButton = document.getElementById('play-button');
const pauseButton = document.getElementById('pause-button');
const resumeButton = document.getElementById('resume-button');

// Get the reference to the <h1> tag for displaying current time and duration
const currentTimeDisplay = document.getElementById('current-time');
const songDurationDisplay = document.getElementById('song-duration');

// Get the reference to the progress bar by its ID
const progressBar = document.getElementById('progress-bar');

// Function to format time in "MM:SS" format
function formatTime(timeInSeconds) {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Function to update the current time display and progress bar
function updateCurrentTimeDisplay() {
    const currentTime = audioElement.currentTime;
    const duration = audioElement.duration;

    const formattedCurrentTime = formatTime(currentTime);
    const formattedDuration = formatTime(duration);

    // Update the combined content for current time and duration
    currentTimeDisplay.textContent = `${formattedCurrentTime} / ${formattedDuration}`;

    // Update the progress bar value based on the current time and duration
    progressBar.value = currentTime / duration;
}

// Update the current time display and progress bar at regular intervals
audioElement.addEventListener('timeupdate', updateCurrentTimeDisplay);

// Add an event listener for the 'click' event on the play button
playButton.addEventListener('click', function () {
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }
    audioElement.play();

    // Hide the play button and show the pause button
    playButton.style.display = 'none';
    pauseButton.style.display = 'block';
});

// Add an event listener for the 'click' event on the pause button
pauseButton.addEventListener('click', function () {
    audioElement.pause();

    // Hide the pause button and show the resume button
    pauseButton.style.display = 'none';
    resumeButton.style.display = 'block';
});

// Add an event listener for the 'click' event on the resume button
resumeButton.addEventListener('click', function () {
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }
    audioElement.play();

    // Hide the resume button and show the pause button
    resumeButton.style.display = 'none';
    pauseButton.style.display = 'block';
});




// Get the reference to the mono button by its ID
const monoButton = document.getElementById('mono-button');

// Get the reference to the stereo button by its ID
const stereoButton = document.getElementById('stereo-button');

// Function to toggle between stereo and mono modes
function toggleStereoMono() {
    // Toggle the mode and update the button display
    monoButton.style.display = monoButton.style.display === 'none' ? 'block' : 'none';
    stereoButton.style.display = stereoButton.style.display === 'none' ? 'block' : 'none';
}

// Add event listener to the mono button for toggling stereo/mono
monoButton.addEventListener('click', toggleStereoMono);

// Add event listener to the stereo button for toggling stereo/mono
stereoButton.addEventListener('click', toggleStereoMono);












// Function to update the volume and percentage display when the volume slider is changed
function updateVolume() {
    const volumeValue = parseFloat(this.value);

    // Update the gainNode with the new volume value
    gainNode.gain.value = volumeValue;

    // Calculate the percentage value based on the volume position
    const percentageValue = Math.round(volumeValue * 100);

    // Update the volume percentage display
    const volumePercentage = document.getElementById('volume-percentage');
    volumePercentage.textContent = `${percentageValue}%`;
}

// Add an event listener for the 'input' event on the volume slider
const volumeSlider = document.getElementById('volume-slider');
volumeSlider.addEventListener('input', updateVolume);

// Trigger the initial update to display the default volume percentage (100%)
updateVolume.call(volumeSlider);





// Create a PannerNode for spatial audio positioning (panning)
const pannerNode = audioContext.createPanner();
audioSource.connect(pannerNode);
pannerNode.connect(gainNode);
pannerNode.panningModel = 'equalpower';

// Function to update the panning and percentage display when the panning slider is changed
function updatePanning() {
    const panningValue = parseFloat(this.value);
    pannerNode.setPosition(panningValue, 0, 1 - Math.abs(panningValue));

    // Calculate the percentage value based on the panning position
    const percentageValue = Math.round(panningValue * 100);

    // Update the panning percentage display
    const panningPercentage = document.getElementById('panning-percentage');
    panningPercentage.textContent = `${percentageValue}%`;
}

// Add an event listener for the 'input' event on the panning slider
const panningSlider = document.getElementById('panning-slider');
panningSlider.addEventListener('input', updatePanning);

// Trigger the initial update to display the default panning percentage (0%)
updatePanning.call(panningSlider);
