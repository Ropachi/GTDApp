"use strict";

//Projectsフォルダのindex.ejsファイル作図
module.exports = {
  index: (req, res) => {
    //メインページをレンダリングする。
    res.render("index");
  }
};
