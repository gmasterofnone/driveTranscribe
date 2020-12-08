const fs = require('fs');
const credentials = require('./credentials.json');
const { google } = require('googleapis');
const authorize = require('./authorize');
const parseVideoFiles = require('./parseVideoFiles');

async function transcribeVideos() {
  const auth = await authorize(credentials);
  const drive = google.drive({version: 'v3', auth});
  const videoFiles = await parseVideoFiles(drive);
  console.log(videoFiles)
  videoFiles.forEach(async video => download(video, drive))
}

transcribeVideos();

async function download({name, id: fileId}, drive) {
  try {
    const dest = fs.createWriteStream(name);
    const { data } = await drive.files.get({fileId, alt: 'media'}, {responseType: 'stream'});
    data.pipe(dest);
  } catch(e) {
    return console.log('The API returned an error: ' + e);
  }
};