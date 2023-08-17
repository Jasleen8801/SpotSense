const express = require("express");
const cors = require("cors");
const transcribeRoutes = require("./routes/transcribeRoutes");
const dotenv = require("dotenv");
const fileUpload = require("express-fileupload");
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());

app.get("/", (req, res) => {
  res.send("It Works!!");
});

app.post("/test", async (req, res) => {
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

app.use("/transcribe", transcribeRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
