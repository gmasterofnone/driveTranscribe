const fs = require('fs');
const credentials = require('./credentials.json');
const { google } = require('googleapis');
const authorize = require('./authorize');
const parseVideoFiles = require('./parseVideoFiles');
const { spawn } = require('child_process');
const transcribeAudio = require('./transcribeAudio');
require('./transcribeAudio');


async function transcribeVideos() {
  const auth = await authorize(credentials);
  const drive = google.drive({version: 'v3', auth});
  const videoFiles = await parseVideoFiles(drive);
  console.log(videoFiles)
  videoFiles.forEach(async video => downloadVideo(video, drive))
}

transcribeVideos();

async function downloadVideo({ name, id: fileId }, drive) {
  try {
    const dest = fs.createWriteStream('./temp/' + name);
    const { data } = await drive.files.get({fileId, alt: 'media'}, {responseType: 'stream'});
    data
      .on('end', () => transcodeVideo(name, fileId))
      .pipe(dest);
  } catch(e) {
    return console.log('The API returned an error: ' + e);
  }
};

function transcodeVideo(name, fileId) {
  const args = ['-f', 'mp4', '-i', './temp/' + name, '-f', 'flac', './temp/' + name.split('.')[0] + '.flac']
  const ffmpeg = spawn('ffmpeg', ['-f', 'mp4', '-i', './temp/' + name, '-f', 'flac', './temp/' + name.split('.')[0] + '.flac']);
  console.log('Spawning ffmpeg ' + args.join(' '));
  ffmpeg.on('exit', e => !e && transcribeAudio('./temp/' + name.split('.')[0] + '.flac'))
  ffmpeg.stderr.on('end', () => {
    console.log('done transcoding')
  })
}

