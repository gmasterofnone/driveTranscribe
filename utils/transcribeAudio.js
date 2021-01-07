const speech = require('@google-cloud/speech');
const fs = require('fs').promises;


async function transcribeAudio(filename) {
  const client = new speech.SpeechClient();
  const file = await fs.readFile(filename);
  const audioBytes = file.toString('base64');

  const audio = {
    content: audioBytes,
  };
  const config = {
    encoding: 'FLAC',
    sampleRateHertz: 32000,
    languageCode: 'en-US',
  };
  const request = {
    audio: audio,
    config: config,
  };

  // Detects speech in the audio file
  const [response] = await client.recognize(request);
  const transcription = response.results
    .map(result => result.alternatives[0].transcript)
    .join('\n');
  console.log(`Transcribed ${filename.split(7)}`)
  return transcription.replace(/(\r\n|\n|\r)/gm, "");
}

module.exports = transcribeAudio;