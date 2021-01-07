const { google } = require('googleapis');
const {
  authorize,
  parseVideoFiles,
  downloadVideo,
  transcodeVideo,
  transcribeAudio,
  updateVideoMetaData
} = require('./utils');

async function transcribeVideos() {
  // how auth with TW Admin
  const auth = await authorize();
  const drive = google.drive({ version: 'v3', auth });
  const video = await parseVideoFiles(drive);
  // parse out non-transcribed videos
  // check perms for public access
  const videoPath = await downloadVideo(video, drive);
  const transcodedVideoPath = await transcodeVideo(videoPath);
  const transcripts = await transcribeAudio(transcodedVideoPath);
  await updateVideoMetaData(drive, video, transcripts);
  // adding caption tracks
  // Notify owner asset has been updated for accessibility and discoverable
  // clean cache
};

// Architecture
// Event-drive i.e webhooks
// Time based cron drop
// Scan for files that don't have a marker i.e no transcripts

// Another serivce - user utility connect video services to google drive

transcribeVideos();