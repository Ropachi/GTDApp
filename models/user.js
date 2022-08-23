"use strict";
//mongooseライブラリをロードする。
const mongoose = require("mongoose"),
  { Schema } = require("mongoose"),
  //passportライブラリをロードする。
  passportLocalMongoose = require("passport-local-mongoose"),
  //taskモデルをロードする。
  Task = require("./task");

//データベースのテーブル:userのスキーマ設定
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

//passportLocalMongooseプラグインをスキーマに設定する。
userSchema.plugin(passportLocalMongoose, {
  usernameField: "email"
});

module.exports = mongoose.model("User", userSchema);
