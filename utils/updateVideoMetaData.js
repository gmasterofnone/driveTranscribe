async function updateVideoMetadata(drive, { name, id: fileId }, transcripts) {
  const response = await drive.files.update({ fileId, requestBody: { description: transcripts } }, { responseType: 'json' });
  console.log(`Video file ${name} description updated with transcript`);
}
module.exports = updateVideoMetadata;