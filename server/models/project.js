const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const projectSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  tasks: [
    {
      type: ObjectId,
      ref: "User",
    },
  ],
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  sprint: {
    type: Number,
    required: true,
    default: 1,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Project", projectSchema);
