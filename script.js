
let recorder;
let screenStream; // Store screen stream separately
let audioStream; // Store audio stream separately
let dateStarted; // To track the start time of the recording
let durationInterval; // To store the interval for updating duration
const videoPreview = document.getElementById('video-preview');
const startButton = document.getElementById('start-recording');
const stopButton = document.getElementById('stop-recording');
const downloadButton = document.getElementById('download-recording');
const timeDuration = document.getElementById('time-duration');


// Function to calculate time duration
function calculateTimeDuration(secs) {
   const hr = Math.floor(secs / 3600);
   const min = Math.floor((secs - hr * 3600) / 60);
   const sec = Math.floor(secs - hr * 3600 - min * 60);

   const formattedMin = min < 10 ? `0${min}` : min;
   const formattedSec = sec < 10 ? `0${sec}` : sec;

   if (hr <= 0) {
       return `${formattedMin}:${formattedSec}`;
   }

   return `${hr}:${formattedMin}:${formattedSec}`;
}


startButton.addEventListener('click', async () => {
   try {
       screenStream = await navigator.mediaDevices.getDisplayMedia({
           video: {
               width: { ideal: 1920 }, // we can adjust video resolution to compress video
               height: { ideal: 720 }, 
               frameRate: { ideal: 30 }, 
           },
       });


       // Capture microphone audio stream
       audioStream = await navigator.mediaDevices.getUserMedia({
           audio: true, 
       });


       // Combine the screen and audio streams
       const combinedStream = new MediaStream([
           ...screenStream.getVideoTracks(),
           ...audioStream.getAudioTracks(),
       ]);


       // Initialize RecordRTC with the combined stream (screen + audio)
       recorder = new RecordRTC(combinedStream, {
           type: 'video',
           mimeType: 'video/webm', 
       });


       // Start recording
       recorder.startRecording();


       startButton.disabled = true;
       stopButton.disabled = false;
       downloadButton.disabled = true; // Disable download while recording


       // Track start time
       dateStarted = new Date().getTime();


       // Update duration display every second
       durationInterval = setInterval(() => {
           const elapsedSecs = (new Date().getTime() - dateStarted) / 1000;
           timeDuration.innerHTML = `${calculateTimeDuration(elapsedSecs)}`;
       }, 1000);


   } catch (error) {
       console.error("Error capturing screen and audio:", error);
       alert("Screen and audio recording failed. Please check permissions.");
   }
});


stopButton.addEventListener('click', () => {
   // Stop recording and display the video
   recorder.stopRecording(() => {
       const blob = recorder.getBlob();
       const videoURL = URL.createObjectURL(blob);
       videoPreview.src = videoURL;

       // Enable the download button once recording is stopped
       downloadButton.disabled = false;

       // Stop the media tracks (important for cleanup)
       stopMediaTracks(screenStream); // Stop screen sharing
       stopMediaTracks(audioStream); // Stop microphone usage

       stopButton.disabled = true;
       startButton.disabled = false;

       // Clear interval and reset the duration display
       clearInterval(durationInterval);
       timeDuration.innerHTML = "00:00";
   });
});


// Stop media tracks helper function
function stopMediaTracks(stream) {
   if (stream) {
       stream.getTracks().forEach(track => track.stop());
   }
}

// Handle download functionality
downloadButton.addEventListener('click', () => {
   const blob = recorder.getBlob();
   const url = URL.createObjectURL(blob);
   const a = document.createElement('a');
   a.href = url;
   a.download = 'recording.webm';
   a.click();
});
