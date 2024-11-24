const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const { parentPort } = require('worker_threads');

// Function to transcode video
function transcodeVideo(inputPath, outputPath, format = 'mp4') {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .output(outputPath)
      .videoCodec('libx264') // Video codec
      .audioCodec('aac') // Audio codec
      .format(format) // Output format
      .on('start', commandLine => {
        console.log(`FFmpeg command: ${commandLine}`);
      })
      .on('end', () => {
        console.log('Transcoding completed');
        resolve(outputPath);
      })
      .on('error', (err) => {
        console.error('Error during transcoding:', err);
        reject(err);
      })
      .run();
  });
}

// Listen for messages from the main thread
parentPort.on('message', (data) => {
  const { inputPath, outputPath, format } = data;
  
  // Perform the transcoding task
  transcodeVideo(inputPath, outputPath, format)
    .then((outputFile) => {
      parentPort.postMessage({ success: true, outputFile });
    })
    .catch((err) => {
      parentPort.postMessage({ success: false, error: err.message });
    });
});
