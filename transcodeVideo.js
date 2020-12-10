const { spawn } = require('child_process');

async function transcodeVideo(videoPath) {
  return new Promise(async (resolve, reject) => {
    const transcodedVideoPath = videoPath.slice(0, -4) + '.flac';
    const args = ['-f', 'mp4', '-i', videoPath, '-f', 'flac', transcodedVideoPath]
    const ffmpeg = spawn('ffmpeg', args);
    console.log(`Transcoding ${videoPath.slice(7)} to ${transcodedVideoPath.slice(7)}`);
    let progress = 0;
    ffmpeg.stderr
        .on('end', () => {
          console.log(' ---- DONE');
          resolve(transcodedVideoPath)
        })
        .on('error', err => {
          console.error('Error transcoding file.');
          reject(err);
        })
        .on('data', d => {
          progress += d.length;
          if (process.stdout.isTTY) {
            process.stdout.clearLine();
            process.stdout.cursorTo(0);
            process.stdout.write(`Transcoded ${progress} bytes`);
          }
        })
  })
};

module.exports = transcodeVideo;


