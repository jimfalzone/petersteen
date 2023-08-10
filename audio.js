// Create an AudioContext instance if it doesn't exist
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

document.addEventListener('DOMContentLoaded', function () {

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
    audioElement.addEventListener('timeupdate', function () {
        updateCurrentTimeDisplay();
        const progress = audioElement.currentTime / audioElement.duration;
        updateProgressBar(progress);
    });

    // Update the progress bar width based on the current progress value
    function updateProgressBar(progress) {
        progressBar.style.width = `${progress * 100}%`;
    }






    // Function to update the button display based on the audio element state
    function updateButtonDisplay() {
        if (audioElement.paused) {
            playButton.style.display = 'block';
            pauseButton.style.display = 'none';
            resumeButton.style.display = 'none';
        } else {
            playButton.style.display = 'none';
            pauseButton.style.display = 'block';
            resumeButton.style.display = 'none';
            console.log('pause');
        }

    }

    // Add an event listener for the 'click' event on the play button
    playButton.addEventListener('click', function () {
        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }
        audioElement.play();

        // Update the button display
        updateButtonDisplay();
    });

    // Add an event listener for the 'click' event on the pause button
    pauseButton.addEventListener('click', function () {
        audioElement.pause();

        // Update the button display
        updateButtonDisplay();
    });

    // Add an event listener for the 'click' event on the resume button
    resumeButton.addEventListener('click', function () {
        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }
        audioElement.play();

        // Update the button display
        updateButtonDisplay();
    });

    // Add an event listener for the 'ended' event on the audio element
    audioElement.addEventListener('ended', function () {
        // When the song is over, update the button to "playButton"
        updateButtonDisplay();
    });











    // Function to update the volume and percentage display when the volume slider is changed
    function updateVolume() {
        const volumeValue = parseFloat(this.value);

        // Update the gainNode with the new volume value
        gainNode.gain.value = volumeValue;

        // Calculate the percentage value based on the volume position
        // const percentageValue = Math.round(volumeValue * 100);

        // Update the volume percentage display
        // const volumePercentage = document.getElementById('volume-percentage');
        // volumePercentage.textContent = `${percentageValue}%`;
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

    // Get the reference to the canvas element
    const canvas = document.getElementById('waveform');
    const canvasContext = canvas.getContext('2d');

    // Create an AnalyserNode to extract data for visualization
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 32768;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    // Connect the AnalyserNode to the audioContext
    audioSource.connect(analyser);
    analyser.connect(gainNode);

    // Function to draw the waveform on the canvas
    function drawWaveform() {
        analyser.getByteTimeDomainData(dataArray);

        canvasContext.fillStyle = 'rgb(0, 0, 0)';
        canvasContext.fillRect(0, 0, canvas.width, canvas.height);

        canvasContext.lineWidth = 2;
        canvasContext.strokeStyle = 'rgb(134, 132, 191)';
        canvasContext.beginPath();

        const sliceWidth = canvas.width * 1.0 / bufferLength;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
            const v = dataArray[i] / 128.0;
            const y = v * canvas.height / 2;

            if (i === 0) {
                canvasContext.moveTo(x, y);
            } else {
                canvasContext.lineTo(x, y);
            }

            x += sliceWidth;
        }

        canvasContext.lineTo(canvas.width, canvas.height / 2);
        canvasContext.stroke();

        requestAnimationFrame(drawWaveform);
    }

    // Start drawing the waveform
    drawWaveform();
});





// Function to log the Y-axis position of the DOM element on scroll
function logScrollPosition() {
    const element = document.documentElement; // Replace with the desired DOM element if needed
    const yPosition = element.scrollTop || window.pageYOffset;
    console.log('Y-axis position:', yPosition);
}

// Attach the scroll event listener to the window
window.addEventListener('scroll', logScrollPosition);
