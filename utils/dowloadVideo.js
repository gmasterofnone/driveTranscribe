const fs = require('fs');

async function downloadVideo({ name, id: fileId }, drive) {
  return new Promise(async resolve => {
    const filePath = './temp/' + name;
    console.log(`Writing to ${filePath}`);
    const dest = fs.createWriteStream(filePath);
    const { data } = await drive.files.get({ fileId, alt: 'media' }, { responseType: 'stream' });
    let progress = 0;
    data
      .on('end', () => {
        console.log(' ---- DONE');
        resolve(filePath);
      })
      .on('error', err => {
        console.error('Error downloading file.');
        reject(err);
      })
      .on('data', d => {
        progress += d.length;
        if (process.stdout.isTTY) {
          process.stdout.clearLine();
          process.stdout.cursorTo(0);
          process.stdout.write(`Downloaded ${progress} bytes`);
        }
      })
      .pipe(dest);
  })
};

module.exports = downloadVideo;