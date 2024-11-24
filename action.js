const { Worker } = require('worker_threads');
const path = require('path');

// Function to create a worker for transcoding
function runTranscodingWorker(inputPath, outputPath, format) {
  return new Promise((resolve, reject) => {
    const worker = new Worker(path.join(__dirname, 'transcode-worker.js'));

    // Send the task to the worker
    worker.postMessage({ inputPath, outputPath, format });

    // Handle the response from the worker
    worker.on('message', (result) => {
      if (result.success) {
        resolve(result.outputFile);
      } else {
        reject(new Error(result.error));
      }
      worker.terminate();
    });

    worker.on('error', (err) => {
      reject(err);
      worker.terminate();
    });

    worker.on('exit', (code) => {
      if (code !== 0) {
        reject(new Error(`Worker stopped with exit code ${code}`));
      }
    });
  });
}

// Example usage: Transcoding video to multiple resolutions in parallel
const inputPath = path.join(__dirname, 'input_video.mp4');
const resolutions = [
  { size: '1920x1080', format: 'mp4', fileName: 'output_1080p.mp4' },
  { size: '1280x720', format: 'mp4', fileName: 'output_720p.mp4' },
  { size: '640x360', format: 'mp4', fileName: 'output_360p.mp4' },
];

async function transcodeVideos() {
  const promises = resolutions.map(resolution => {
    const outputPath = path.join(__dirname, resolution.fileName);

    return runTranscodingWorker(inputPath, outputPath, resolution.format);
  });

  try {
    const results = await Promise.all(promises);
    console.log('All videos transcoded successfully:', results);
  } catch (err) {
    console.error('Error during transcoding:', err);
  }
}

// Run the transcoding process
transcodeVideos();
