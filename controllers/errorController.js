//エラー発生の処理
"use strict";

//http-status-codesライブラリをロード
const httpStatus = require("http-status-codes");

//エラーがあればログ出力
module.exports = {
  logErrors: (error, req, res, next) => {
    //エラーの内容をログ出力
    console.error(error.stack);
    //エラーを次の関数に渡す。
    next(error);
  },

  //ページが見つからない場合
  pageNotFoundError: (req, res) => {
    //ファイルが無い(404)エラー処理
    let errorCode = httpStatus.NOT_FOUND;
    //statusコードを渡す
    res.status(errorCode);
    //ビューへエラーをレンダリングする。
    res.render("error");
  },

  //Webサーバー側でエラー(500)を発生した場合の処理
  internalServerError: (error, req, res, next) => {
    let errorCode = httpStatus.INTERNAL_SERVER_ERROR;
    //ログ出力
    console.log(`ERROR occurred: ${error.stack}`);
    //statusコードを渡す
    res.status(errorCode);
    //ビューへエラー表示を出力
    res.send(`${errorCode} | Sorry, our application is experiencing a problem!`);
  }
};
