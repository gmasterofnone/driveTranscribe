async function parseVideoFiles(drive) {
  try {
    const { data: { files } } = await drive.files.list({ pageSize: 10, fields: 'nextPageToken, files(id, name)' })
    const videoFiles = files.filter(file => /.mp4/.exec(file.name));
    console.log(`Found ${videoFiles.length} video file in Drive`)
    return videoFiles[0];
  } catch(e) {
    return console.log('The API returned an error: ' + e);
  }
};

module.exports = parseVideoFiles;