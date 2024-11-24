# Video Transcoding

## Overview

Video transcoding is the process of converting a video file from one format or resolution to another. This can involve changing the video codec, adjusting the resolution, or altering other properties like the bitrate or frame rate. Transcoding is often used to ensure compatibility across various devices, reduce file sizes, or optimize for streaming. This project leverages **FFmpeg**, a powerful multimedia processing tool, to handle the transcoding process programmatically within a Node.js environment.

## Process Flow

1. **Input Video File**:
   - The user provides an input video file in various formats, including `.mp4`, `.avi`, `.mov`, or others supported by FFmpeg.

2. **Transcoding Operation**:
   - Using **fluent-ffmpeg**, a Node.js wrapper for FFmpeg, the input video is read and transcoded according to the desired output specifications. This can involve:
     - **Changing the video codec** (e.g., H.264, VP9)
     - **Adjusting the video resolution** (e.g., 1920x1080 for Full HD, 1280x720 for HD, 640x360 for low resolution)
     - **Re-encoding the audio** to a different format or bitrate
     - **Changing the container format** (e.g., from `.avi` to `.mp4`)
     - **Adding or removing metadata**

3. **Resolution Scaling**:
   - The transcoding process can involve scaling the video to multiple resolutions. Common use cases include generating:
     - **High Resolution** (1080p or higher) for optimal quality
     - **Medium Resolution** (720p or 480p) for streaming and mobile use
     - **Low Resolution** (360p or 240p) for bandwidth-limited scenarios or smaller file sizes

4. **FFmpeg Command Execution**:
   - Fluent-ffmpeg abstracts FFmpeg's command-line interface, enabling easy interaction in JavaScript. The desired encoding settings (e.g., codec, resolution, bitrate) are specified programmatically and passed to FFmpeg for execution.
   - FFmpeg then processes the input video, performs the necessary conversions, and outputs the resulting video in the specified format.

5. **Output Video File**:
   - Once the transcoding process is complete, the resulting video file is saved to a specified location or can be streamed or sent to a server for further processing (e.g., for video upload or live streaming).

6. **Error Handling**:
   - During the transcoding process, proper error handling ensures that issues (e.g., missing FFmpeg installation, incompatible input format, corrupted file) are gracefully managed. Clear error messages are provided to the user to aid in troubleshooting.

## Key Features

- **Multiple Format Support**: Convert between a variety of formats such as `.mp4`, `.avi`, `.mov`, `.mkv`, `.webm`, and others.
- **Custom Resolutions**: Transcode videos to specific resolutions, including high, medium, and low resolutions for different devices or use cases.
- **Audio Processing**: Modify the audio codec, bitrate, and channels to meet specific requirements.
- **Compression and Optimization**: Reduce the file size by adjusting the bitrate, resolution, and codec settings, ensuring efficient storage and streaming.
- **Batch Processing**: Process multiple videos in parallel using **worker threads** or asynchronous processes, allowing for scalable video transcoding.

## Technical Details

- **Main Dependencies**:
  - **fluent-ffmpeg**: A Node.js library that provides an abstraction layer for FFmpeg, allowing for easy video and audio processing.
  - **FFmpeg**: The core multimedia framework used to perform the actual transcoding.
  - **worker_threads** (Node.js): For parallelizing the transcoding process, improving performance when handling large video files or processing multiple videos simultaneously.

- **Key FFmpeg Commands**:
  - `ffmpeg -i input.mp4 -vcodec libx264 -acodec aac output.mp4`: Transcode video to MP4 with H.264 video codec and AAC audio codec.
  - `ffmpeg -i input.mp4 -vf scale=1280:720 -vcodec libx264 -acodec aac output_720p.mp4`: Resize video to 720p resolution while maintaining H.264 codec.
  - `ffmpeg -i input.mp4 -b:v 1000k -b:a 128k output.mp4`: Adjust video and audio bitrates for optimized streaming or smaller file sizes.

## How to Use

1. **Installation**:
   - Install **Node.js** (version 12 or higher) and **FFmpeg**.
   - Clone the repository and install the dependencies:
     ```bash
     git clone https://github.com/AyemunHossain/video-transcoding
     cd video-transcoding
     npm install
     ```

2. **Running the Transcoding Script**:
   - After installation, run the script with an input video file:
     ```bash
     node transcode.js
     ```
   - The script will transcode the video to the specified formats and resolutions, and the output files will be saved in the output directory.

3. **Using Worker Threads**:
   - The project can process multiple videos simultaneously using worker threads for better performance. To enable parallel transcoding, follow the instructions in the `worker-transcode.js` file.

## Example Code Snippet

```javascript
const ffmpeg = require('fluent-ffmpeg');

// Transcoding a video to a different resolution and format
ffmpeg('input_video.mp4')
  .output('output_video_720p.mp4')
  .videoCodec('libx264')
  .audioCodec('aac')
  .size('1280x720') // Change resolution to 720p
  .on('end', () => {
    console.log('Transcoding complete.');
  })
  .on('error', (err) => {
    console.log('Error during transcoding: ', err);
  })
  .run();
```
