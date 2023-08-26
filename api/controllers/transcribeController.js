const { SpeechClient } = require("@google-cloud/speech");
const { Storage } = require("@google-cloud/storage");
const path = require("path");
const fs = require("fs");
const os = require("os");
const { v4: uuidv4 } = require("uuid");
const dotenv = require("dotenv");
dotenv.config();

const PROJECT_ID = process.env.PROJECT_ID;
const BUCKET_NAME = process.env.BUCKET_NAME;
const keyFilePath = path.join(__dirname, "../google-cloud-credentials.json");

const storage = new Storage({
  projectId: PROJECT_ID,
  keyFilename: keyFilePath,
});

const client = new SpeechClient({
  keyFilename: keyFilePath,
});

const transcribeAudio = async (audioData) => {
  try {
    const tempFilePath = path.join(os.tmpdir(), `${uuidv4()}.wav`);
    await fs.promises.writeFile(tempFilePath, audioData);
    const remoteFilePath = `audio-files/${path.basename(tempFilePath)}`;
    const uploadOptions = {
      destination: remoteFilePath,
      contentType: "audio/wav",
    };

    await storage.bucket(BUCKET_NAME).upload(tempFilePath, uploadOptions);
    const gcsUri = `gs://${BUCKET_NAME}/${remoteFilePath}`;
    console.log(gcsUri);
    // const gcsUri = "gs://cloud-samples-data/speech/brooklyn_bridge.raw";
    // const gcsUri = "gs://spotsense/audio-files/M_0025_11y10m_1.wav"

    const audio = {
      uri: gcsUri,
    };

    const config = {
      encoding: "LINEAR16",
      sampleRateHertz: 20000,
      languageCode: "en-US",
    };

    const request = {
      audio: audio,
      config: config,
    };

    const [operation] = await client.longRunningRecognize(request);
    const [response] = await operation.promise();
    console.log(response);

    const transcription = response.results
      .map((result) => result.alternatives[0].transcript)
      .join("\n");
    console.log(transcription)
    await fs.promises.unlink(tempFilePath); // Clean up the temporary file

    return transcription;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports = {
  transcribeAudio,
};
