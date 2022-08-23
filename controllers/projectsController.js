//Projectsフォルダの
"use strict";

//projectモデルをロードする。
const Project = require("../models/project"),
  getProjectParams = body => {
    return {
      proname: body.proname,
      description: body.description,
    };
  };

module.exports = {
  index: (req, res, next) => {
    //プロジェクトのデータを全て探す
    Project.find()
      //projectに関する情報をthenで次に処理する。
      .then(projects => {
        //projectに関するデータをローカル変数へ保存する。
        res.locals.projects = projects;
        //関数のコードが完了したことをexpressへ通知
        next();
      })
        //エラーを補足して表示する。
      .catch(error => {
        console.log(`Error fetching projects: ${error.message}`);
        //エラーを次の関数に渡す。
        next(error);
      });
  },
  indexView: (req, res) => {
    //プロジェクトの一覧表示ページをレンダリングする。
    res.render("projects/index");
  },

  new: (req, res) => {
    //プロジェクトの新規入力ページををレンダリングする。
    res.render("projects/new");
  },

  create: (req, res, next) => {
    //パラメータを変数へ代入する.
    let projectParams = getProjectParams(req.body);
    Project.create(projectParams)
      //projectに関する情報をthenで次に処理する。
      .then(project => {
        //プロジェクへのルートをローカル変数へ保存。
        res.locals.redirect = "/projects";
        //projectに関するデータをローカル変数へ保存する。
        res.locals.project = project;
        //関数のコードが完了したことをexpressへ通知
        next();
      })
        //エラーを補足して表示する。
      .catch(error => {
        console.log(`Error saving project: ${error.message}`);
        //エラーを次の関数に渡す。
        next(error);
      });
  },

  redirectView: (req, res, next) => {
    //ローカル変数のパス情報を変数へ保存する。
    let redirectPath = res.locals.redirect;
    //パスが設定されていればそのページへ移動する。
    if (redirectPath !== undefined) res.redirect(redirectPath);
    //関数のコードが完了したことをexpressへ通知
    else next();
  },

  show: (req, res, next) => {
    //パラメータからidを取り出す
    let projectId = req.params.id;
    //上記idから該当プロジェクトを検索
    Project.findById(projectId)
      //projectに関する情報をthenで次に処理する。
      .then(project => {
        //projectに関するデータをローカル変数へ保存する。
        res.locals.project = project;
        //関数のコードが完了したことをexpressへ通知
        next();
      })
        //エラーを補足して表示する。
      .catch(error => {
        console.log(`Error fetching project by ID: ${error.message}`);
        //エラーを次の関数に渡す。
        next(error);
      });
  },

  showView: (req, res) => {
    //該当プロジェクトの情報表示ページをレンダリングする。
    res.render("projects/show");
  },

  edit: (req, res, next) => {
    //パラメータからidを取り出す
    let projectId = req.params.id;
    //上記idから該当プロジェクトを検索する。
    Project.findById(projectId)
        //projectに関する情報をthenで次に処理する。
      .then(project => {
        //プロジェクトの編集ページをレンダリングする。
        res.render("projects/edit", {
          project: project
        });
      })
        //エラーを補足して表示する。
      .catch(error => {
        console.log(`Error fetching project by ID: ${error.message}`);
        //エラーを次の関数に渡す。
        next(error);
      });
  },

  update: (req, res, next) => {
    //パラメータからidを取り出す
    let projectId = req.params.id,
      projectParams = getProjectParams(req.body);
    //Idから該当プロジェクトを検索し、パラメータから取得した情報で更新する。
    Project.findByIdAndUpdate(projectId, {
      $set: projectParams
    })
      //projectに関する情報をthenで次に処理する。
      .then(project => {
        //該当idのプロジェクトページ位置をローカル変数へ保存
        res.locals.redirect = `/projects/${projectId}`;
        project = project;
        //関数のコードが完了したことをexpressへ通知
        next();
      })
        //エラーを補足して表示する。
      .catch(error => {
        console.log(`Error updating project by ID: ${error.message}`);
        next(error);
      });
  },

  delete: (req, res, next) => {
    //パラメータからidを取り出す
    let projectId = req.params.id;
    //上記idから該当プロジェクトを検索し削除する。
    Project.findByIdAndRemove(projectId)
      .then(() => {
        //プロジェクトページへのルートをローカル変数へ保存
        res.locals.redirect = "/projects";
        //関数のコードが完了したことをexpressへ通知
        next();
      })
        //エラーを補足して表示する。
      .catch(error => {
        console.log(`Error deleting project by ID: ${error.message}`);
        //関数のコードが完了したことをexpressへ通知
        next();
      });
  }
};
