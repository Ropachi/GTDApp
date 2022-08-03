"use strict";

const mongoose = require("mongoose"),
  { Schema } = mongoose;

var taskSchema = new Schema(
  {
    taskname: {
      type: String,
      required: true,
    },
    project: {
      type: String,
      required: true,
    },
    worker: {
      type: String,
      required: true,
    },
    limit: {
      type: String
    },
    status: {
      type: String,
      required: true,
    }
  }
);

module.exports = mongoose.model("Task", taskSchema);
