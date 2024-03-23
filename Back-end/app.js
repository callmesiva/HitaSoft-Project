const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./dbConfig");
const helmet = require("helmet");

const app = express();
app.use(express.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(helmet());
app.use(cors());

// Health check API
app.get("/app/status", async (req, res) => {
  if (db.readyState === 1) {
    res
      .status(200)
      .json({ serverStatus: "OK", database: "Connection successful" });
  } else {
    res.status(500).json({ serverStatus: "Error", error: "Connection error" });
  }
});

const postData = require("./SRC/route/postRoute");
app.use("/", postData);

const PORT = process.env.PORT || 3800;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
