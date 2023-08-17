const express = require("express");
const router = express.Router();

const transcribeController = require("../controllers/transcribeController");

router.post("/", async (req, res) => {
  try {
    if (!req.files || !req.files.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    const audioData = req.files.file.data;
    const transcription = await transcribeController.transcribeAudio(audioData);
    res.json({
      message: "Transcription sent",
      data: transcription,
    });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

module.exports = router;