const express = require("express");
const { SpeechClient } = require("@google-cloud/speech");
const { Storage } = require("@google-cloud/storage");
const path = require("path");
const cors = require("cors");
const axios = require("axios");
const dotenv = require("dotenv");
const fs = require("fs");
dotenv.config();

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

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("It Works!!");
});

app.post("/test", (req, res) => {
  try {
    console.log("Received a test POST request");
    const receivedData = req.body; // Get the data sent in the POST request
    res.json({
      message: "Test POST request received successfully",
      data: receivedData,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occurred" });
  }
});

app.post("/transcribe", async (req, res) => {
  try {
    const audioUri = req.body.key;
    // const localFilePath = audioUri.replace("file://", "");
    const audioData = await fs.promises.readFile(audioUri);

    const remoteFilePath = `audio-files/${Date.now()}.3gp`;
    const uploadOptions = {
      destination: remoteFilePath,
      contentType: "audio/3gp",
    };

    await storage.bucket(BUCKET_NAME).upload(audioData, uploadOptions);

    const gcsUri = `gs://${BUCKET_NAME}/${remoteFilePath}`;

    const audio = {
      uri: gcsUri,
    };

    const config = {
      encoding: "LINEAR16",
      sampleRateHertz: 16000,
      languageCode: "en-US",
    };

    const request = {
      audio: audio,
      config: config,
    };

    const [response] = await client.recognize(request);

    const transcription = response.results
      .map((result) => result.alternatives[0].transcript)
      .join("\n");

    res.json({ transcription });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occurred" });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
