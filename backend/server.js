import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import downloadController from "./controllers/downloadController.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Routes
app.post("/download", downloadController);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
