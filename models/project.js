"use strict";

const mongoose = require("mongoose"),
  { Schema } = require("mongoose");

var projectSchema = new Schema(
  {
    proname: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String
    },
  }
);

module.exports = mongoose.model("Project", projectSchema);
