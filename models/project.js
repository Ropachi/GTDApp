"use strict";
//mongodb用ライブラリをロード。
const mongoose = require("mongoose"),
  { Schema } = require("mongoose");

//データベースのテーブル:projectのスキーマ設定
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
