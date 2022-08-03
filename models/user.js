"use strict";

const mongoose = require("mongoose"),
  { Schema } = require("mongoose"),
  passportLocalMongoose = require("passport-local-mongoose"),
  Task = require("./task");

var userSchema = new Schema(
  {
    name: {
        type: String,
        required: true
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength:5,
      maxlength:10,
    },
    section: {
      type: String,
      required: true,
    }
  }
);

userSchema.plugin(passportLocalMongoose, {
  usernameField: "email"
});

module.exports = mongoose.model("User", userSchema);
