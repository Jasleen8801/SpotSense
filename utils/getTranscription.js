import { SpeechClient } from "@google-cloud/speech";
import path from "path";

const keyfilePath = path.join(__dirname, "../google-cloud-credentials.json");

const client = new SpeechClient({
  keyFilename: keyfilePath,
});

export const getTranscription = async (audioUri) => {
  try {
    const audio = {
      uri: audioUri,
    };

    const config = {
      encoding: 'LINEAR16',
      sampleRateHertz: 44100,
      languageCode: 'en-US',
    };

    const request = {
      audio: audio,
      config: config,
    };

    const [response] = await client.recognize(request);
    const transcription = response.results.map((result) => result.alternatives[0].transcript).join('\n');

    return transcription;
  } catch (error) {
    console.error('Error transcribing audio:', error);
    return null;
  }
};
