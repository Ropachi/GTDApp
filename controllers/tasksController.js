"use strict";
//taskモデルをロード。
const Task = require("../models/task"),
  getTaskParams = body => {
    return {
      taskname: body.taskname,
      project: body.project,
      worker: body.worker,
      limit: body.limit,
      status: body.status,
    };
  };

module.exports = {
  index: (req, res, next) => {
    //タスクのデータを全て探す
    Task.find()
        //taskに関する情報をthenで次に処理する。
      .then(tasks => {
        //taskに関するデータをローカル変数へ保存する。
        res.locals.tasks = tasks;
        //関数のコードが完了したことをexpressへ通知
        next();
      })
      //エラーを補足して表示する。
      .catch(error => {
        console.log(`Error fetching tasks: ${error.message}`);
        //エラーを次の関数に渡す。
        next(error);
      });
  },
  indexView: (req, res) => {
    //タスクの一覧表示ページをレンダリングする。
    res.render("tasks/index");
  },

  new: (req, res) => {
    //タスクの新規入力ページをレンダリングする。
    res.render("tasks/new");
  },

  create: (req, res, next) => {
    //パラメータを変数へ代入する。
    let taskParams = getTaskParams(req.body);
    Task.create(taskParams)
      //taskに関する情報をthenで次に処理する。
      .then(task => {
        //タスクページへのルートをローカル変数へ保存
        res.locals.redirect = "/tasks";
        //taskに関するデータをローカル変数へ保存する。
        res.locals.task = task;
        //関数のコードが完了したことをexpressへ通知
        next();
      })
        //エラーを補足して表示する。
      .catch(error => {
        console.log(`Error saving task: ${error.message}`);
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
    let taskId = req.params.id;
    //上記idから該当タスクを検索
    Task.findById(taskId)
        //taskに関する情報をthenで次に処理する。
      .then(task => {
        //taskに関するデータをローカル変数へ保存する。
        res.locals.task = task;
        next();
      })
        //エラーを補足して表示する。
      .catch(error => {
        console.log(`Error fetching task by ID: ${error.message}`);
        //エラーを次の関数に渡す。
        next(error);
      });
  },

  showView: (req, res) => {
    //タスクの情報表示ページをレンダリングする。
    res.render("tasks/show");
  },

  edit: (req, res, next) => {
    //パラメータからidを取り出す
    let taskId = req.params.id;
    //上記idから該当タスクを検索
    Task.findById(taskId)
      //taskに関する情報をthenで次に処理する。
      .then(task => {
        //タスクの編集ページをレンダリングする。
        res.render("tasks/edit", {
          task: task
        });
      })
        //エラーを補足して表示する。
      .catch(error => {
        console.log(`Error fetching task by ID: ${error.message}`);
        next(error);
      });
  },

  update: (req, res, next) => {
    //パラメータからidを取り出す
    let taskId = req.params.id,
      //パラメータを変数へ代入する。
      taskParams = getTaskParams(req.body);
    //Idから該当タスクを検索し、パラメータから取得した情報で更新する。
    Task.findByIdAndUpdate(taskId, {
      $set: taskParams
    })
      //taskに関する情報をthenで次に処理する。
      .then(task => {
        //該当idタスクへのルートをローカル変数へ保存
        res.locals.redirect = `/tasks/${taskId}`;
        //taskモデルデータをローカル変数へ保存する。
        res.locals.task = task;
        //関数のコードが完了したことをexpressへ通知
        next();
      })
        //エラーを補足して表示する。
      .catch(error => {
        console.log(`Error updating task by ID: ${error.message}`);
        //エラーを次の関数に渡す。
        next(error);
      });
  },

  delete: (req, res, next) => {
    //パラメータからidを取り出す
    let taskId = req.params.id;
    //上記idから該当タスクを検索し削除する。
    Task.findByIdAndRemove(taskId)
      .then(() => {
        //タスクページへのルートをローカル変数へ保存する。
        res.locals.redirect = "/tasks";
        //関数のコードが完了したことをexpressへ通知
        next();
      })
        //エラーを補足して表示する。
      .catch(error => {
        console.log(`Error deleting task by ID: ${error.message}`);
        next();
      });
  }
};
