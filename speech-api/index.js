const express = require("express");
const { SpeechClient } = require("@google-cloud/speech");
const path = require("path");
const cors = require("cors");

const app = express();
app.use(cors());

const keyFilePath = path.join(__dirname, "google-cloud-credentials.json");

const client = new SpeechClient({
  keyFilename: keyFilePath,
});

app.get("/", (req, res) => {
  res.send("It Works!!");
});

app.post("/transcribe", async (req, res) => {
  try {
    const audioUri = req.body.audioUri;

    const audio = {
      uri: audioUri,
    };

    const config = {
      encoding: "LINEAR16",
      sampleRateHertz: 44100,
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
