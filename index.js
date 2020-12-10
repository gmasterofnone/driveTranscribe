const authorize = require('./authorize');
const parseVideoFiles = require('./parseVideoFiles');
const { spawn } = require('child_process');
const transcribeAudio = require('./transcribeAudio');
const downloadVideo = require('./dowloadVideo');
const { google } = require('googleapis');

async function transcribeVideos() {
  const auth = await authorize();
  const drive = google.drive({version: 'v3', auth});
  const video = await parseVideoFiles(drive);
  const videoPath = await downloadVideo(video, drive);
  const transcodedVideoPath = await transcodeVideo(videoPath);
}

transcribeVideos();



async function transcodeVideo(videoPath) {
  return new Promise(async (resolve, reject) => {
    const transcodedVideoPath = videoPath.slice(0, -4) + '.flac';
    const args = ['-f', 'mp4', '-i', videoPath, '-f', 'flac', transcodedVideoPath]
    const ffmpeg = spawn('ffmpeg', args);
    console.log(`Transcoding ${videoPath.split(6)} to ${transcodedVideoPath.split(6,0)}`);
    ffmpeg.stderr.on('end', () => {
      console.log('done transcoding')
      resolve(transcodedVideoPath)
    })
  })
}

