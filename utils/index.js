const authorize = require('./authorize');
const parseVideoFiles = require('./parseVideoFiles');
const downloadVideo = require('./dowloadVideo');
const transcodeVideo = require('./transcodeVideo');
const transcribeAudio = require('./transcribeAudio');
const updateVideoMetaData = require('./updateVideoMetaData');


module.exports = {
  authorize,
  parseVideoFiles,
  downloadVideo,
  transcodeVideo,
  transcribeAudio,
  updateVideoMetaData
};