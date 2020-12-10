async function parseVideoFiles(drive) {
  try {
    const { data: { files } } = await drive.files.list({ pageSize: 10, fields: 'nextPageToken, files(id, name)' })
    return files.filter(file => /.mp4/.exec(file.name))[0];
  } catch(e) {
    return console.log('The API returned an error: ' + e);
  }
};

module.exports = parseVideoFiles;