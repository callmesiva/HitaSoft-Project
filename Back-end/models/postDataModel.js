const mongoose = require("mongoose");
const { Schema } = mongoose;

const postDataModel = new Schema({
  userId: Number,
  id: Number,
  title: String,
  body: String,
  image: String,
  isDeleted: { type: Boolean, default: false },
});

module.exports = mongoose.model("PostData", postDataModel);
