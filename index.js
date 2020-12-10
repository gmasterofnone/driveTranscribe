const { google } = require('googleapis');
const authorize = require('./authorize');
const parseVideoFiles = require('./parseVideoFiles');
const downloadVideo = require('./dowloadVideo');
const transcodeVideo = require('./transcodeVideo');
const transcribeAudio = require('./transcribeAudio');
const updateVideoMetaData = require('./updateVideoMetaData');

async function transcribeVideos() {
  const auth = await authorize();
  const drive = google.drive({ version: 'v3', auth });
  const video = await parseVideoFiles(drive);
  const videoPath = await downloadVideo(video, drive);
  const transcodedVideoPath = await transcodeVideo(videoPath);
  const transcripts = await transcribeAudio(transcodedVideoPath);
  await updateVideoMetaData(drive, video, transcripts);
}

transcribeVideos();