const { SpeechClient } = require("@google-cloud/speech");
const { Storage } = require("@google-cloud/storage");
const path = require("path");
const fs = require("fs");
const os = require("os");
const { v4: uuidv4 } = require("uuid");

const PROJECT_ID = process.env.PROJECT_ID;
const BUCKET_NAME = process.env.BUCKET_NAME;
const keyFilePath = path.join(__dirname, "google-cloud-credentials.json");

const storage = new Storage({
  projectId: PROJECT_ID,
  keyFilename: keyFilePath,
});

const client = new SpeechClient({
  keyFilename: keyFilePath,
});

const transcribeAudio = async (audioData) => {
  try {
    const tempFilePath = path.join(os.tmpdir(), `${uuidv4()}.3gp`);
    await fs.promises.writeFile(tempFilePath, audioData);
    const remoteFilePath = `audio-files/${path.basename(tempFilePath)}`;
    const uploadOptions = {
      destination: remoteFilePath,
      contentType: "audio/3gp",
    };

    await storage.bucket(BUCKET_NAME).upload(tempFilePath, uploadOptions);
    // const gcsUri = `gs://${BUCKET_ NAME}/${remoteFilePath}`;
    // console.log(gcsUri);
    const gcsUri = `gs://${BUCKET_NAME}/${remoteFilePath}`;

    const audio = {
      uri: gcsUri,
    };

    const config = {
      encoding: "LINEAR16",
      sampleRateHertz: 16000,
      languageCode: "en-US",
    };

    const [response] = await client.recognize({ audio: audio, config: config });

    const transcription = response.results
      .map((result) => result.alternatives[0].transcript)
      .join("\n");

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
