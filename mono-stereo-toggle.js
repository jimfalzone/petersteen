(function (audioContext, audioSource) {
    // Create a ChannelMergerNode to merge stereo channels to mono
    let channelMerger = audioContext.createChannelMerger(2); // Two inputs for stereo
    audioSource.connect(channelMerger);

    // Create a GainNode to control volume (for mono output)
    let monoGainNode = audioContext.createGain();
    channelMerger.connect(monoGainNode);
    monoGainNode.connect(audioContext.destination);

    // Flag to track the current mode (stereo or mono)
    let isStereoMode = true;

    // Function to toggle between stereo and mono playback
    function toggleStereoMono() {
        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }

        // Toggle the mode and update the button texts and display
        if (isStereoMode) {
            // Switch to mono mode
            channelMerger.disconnect();
            audioSource.connect(monoGainNode);
            monoGainNode.gain.value = 1; // Reset the gain to full volume
            monoButton.textContent = 'Switch to Stereo';
            stereoButton.style.display = 'block'; // Show the stereo button
        } else {
            // Switch to stereo mode
            audioSource.disconnect();
            audioSource.connect(channelMerger);
            monoGainNode.gain.value = 1; // Reset the gain to full volume
            monoButton.textContent = 'Merge to Mono';
            stereoButton.style.display = 'none'; // Hide the stereo button
        }

        // Toggle the mode flag
        isStereoMode = !isStereoMode;
    }

    // Get the reference to the mono button by its ID
    let monoButton = document.getElementById('mono-button');

    // Add event listener to the mono button for toggling stereo/mono
    monoButton.addEventListener('click', toggleStereoMono);

    // Get the reference to the stereo button by its ID
    let stereoButton = document.getElementById('stereo-button');

    // Add event listener to the stereo button for toggling stereo/mono
    stereoButton.addEventListener('click', toggleStereoMono);

    // Initialize the button display on page load
    if (!isStereoMode) {
        stereoButton.style.display = 'block'; // Show the stereo button
    } else {
        monoButton.style.display = 'block'; // Show the mono button
    }
})(audioContext, audioSource);
