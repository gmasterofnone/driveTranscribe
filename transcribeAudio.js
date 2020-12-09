// Imports the Google Cloud client library
const speech = require('@google-cloud/speech');
const fs = require('fs').promises;

// Creates a client
const client = new speech.SpeechClient();

async function transcribeAudio(filename) {
  console.log(filename)

  // Reads a local audio file and converts it to base64
  const file = await fs.readFile(filename);
  const audioBytes = file.toString('base64');

  // The audio file's encoding, sample rate in hertz, and BCP-47 language code
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
  console.log(`Transcription: ${transcription}`);
}

module.exports = transcribeAudio;