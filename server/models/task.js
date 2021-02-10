const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const taskSchema = new mongoose.Schema({
  project_id: {
    type: ObjectId,
    ref: "Project",
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  status_in_project: {
    type: String,
    required: true,
    default: "To do",
  },
  status_in_sprint: {
    type: Number,
    required: true,
    enum: [0, 1, 2, 3],
    default: 0,
  },
  story_points: {
    type: Number,
    required: true,
    default: 0,
  },
  sprint: {
    type: Number,
    required: true,
    default: 0,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Task", taskSchema);
