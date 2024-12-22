# RecordRTC Demo
**Overview**

This project demonstrates screen and audio recording using the RecordRTC library. It enables users to capture their screen with audio and download the recording.

# Key Methods and Concepts

1. Capturing the Screen Stream

```
screenStream = await navigator.mediaDevices.getDisplayMedia({
    video: { width: { ideal: 1920 }, height: { ideal: 1080 }, frameRate: { ideal: 30 } },
})
```



2. Capturing Microphone Audio

```audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });```



3. Combining Streams

```
const combinedStream = new MediaStream([
    ...screenStream.getVideoTracks(),
    ...audioStream.getAudioTracks(),
])
```



4. Recording with RecordRTC
```
recorder = new RecordRTC(combinedStream, { type: 'video', mimeType: 'video/webm' });
recorder.startRecording();
```



5. Stopping the Recording

```
recorder.stopRecording(() => {
    const blob = recorder.getBlob();
    const videoURL = URL.createObjectURL(blob);
    videoPreview.src = videoURL;
});
```



6. Downloading the Recording
   
```
const blob = recorder.getBlob();
const a = document.createElement('a');
a.href = URL.createObjectURL(blob);
a.download = 'recording.webm';
a.click();
```
