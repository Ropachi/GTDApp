"use strict";

//userモデルをロード
const User = require("../models/user"),
  //passportライブラリをロード
  passport = require("passport"),
  getUserParams = body => {
    return {
      name: body.name,
      email: body.email,
      password: body.password,
      section: body.section
    };
  };

module.exports = {
  index: (req, res, next) => {
    //ユーザーのデータを全て探す
    User.find()
      //userに関する情報をthenで次に処理する。
      .then(users => {
        //userモデル情報をローカル変数へ保存する。
        res.locals.users = users;
        //関数のコードが完了したことをexpressへ通知
        next();
      })
        //エラーを補足して表示する。
      .catch(error => {
        console.log(`Error fetching users: ${error.message}`);
        //エラーを次の関数に渡す。
        next(error);
      });
  },
  indexView: (req, res) => {
    //ユーザーの一覧表示ページをレンダリングする。
    res.render("users/index");
  },

  new: (req, res) => {
    //ユーザーの新規入力ページをレンダリングする。
    res.render("users/new");
  },

  create: (req, res, next) => {
    req.check("name","Hi, you must input your name").isEmpty();
                   //関数のコードが完了したことをexpressへ通知
    if (req.skip) next();
    //新しいuserインスタンスを生成する。user情報はパラメータから取得。
    let newUser = new User(getUserParams(req.body));
    //ユーザー新規登録
    User.register(newUser, req.body.password, (e, user) => {
      if (user) {
        //userモデルが確定されたことを受けてそれをフラッシュメッセージ表示する。
        req.flash("success", `${user.name}'様のアカウントが作成されました!`);
        //userへのルートをローカル変数へ保存
        res.locals.redirect = "/users";
        //関数のコードが完了したことをexpressへ通知
        next();
      } else {
        //新規登録エラー発生をフラッシュメッセージ表示する。
        req.flash("error", `アカウント作成、エラーが発生しました。: ${e.message}.`);
        //新規入力ページへのルートをローカル変数へ保存する。
        res.locals.redirect = "/users/new";
        //関数のコードが完了したことをexpressへ通知
        next();
      }
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
    let userId = req.params.id;
    //上記idから該当ユーザーを検索
    User.findById(userId)
        //userに関する情報をthenで次に処理する。
      .then(user => {
        //userに関するデータをローカル変数へ保存する。
        res.locals.user = user;
        //関数のコードが完了したことをexpressへ通知
        next();
      })
        //エラーを補足して表示する。
      .catch(error => {
        console.log(`Error fetching user by ID: ${error.message}`);
        //エラーを次の関数に渡す。
        next(error);
      });
  },

  showView: (req, res) => {
    //ユーザーの情報表示ページをレンダリングする。
    res.render("users/show");
  },

  edit: (req, res, next) => {
    //パラメータからidを取り出す
    let userId = req.params.id;
    //上記idから該当ユーザーを検索
    User.findById(userId)
        //userに関する情報をthenで次に処理する。
      .then(user => {
        //上記IDユーザーの編集頁ページをレンダリングする。
        res.render("users/edit", {
          user: user
        });
      })
        //エラーを補足して表示する。
      .catch(error => {
        console.log(`Error fetching user by ID: ${error.message}`);
        //エラーを次の関数に渡す。
        next(error);
      });
  },

  update: (req, res, next) => {
    //パラメータからidを取り出す
    let userId = req.params.id,
      //パラメータを変数へ代入する。
      userParams = getUserParams(req.body);
    //Idから該当ユーザーを検索し、パラメータから取得した情報で更新する。
    User.findByIdAndUpdate(userId, {
      $set: userParams
    })
        //userに関する情報をthenで次に処理する。
      .then(user => {
        //該当idユーザーへのルートをローカル変数へ保存
        res.locals.redirect = `/users/${userId}`;
        //userに関するデータをローカル変数へ保存する。
        res.locals.user = user;
        //関数のコードが完了したことをexpressへ通知
        next();
      })
        //エラーを補足して表示する。
      .catch(error => {
        console.log(`Error updating user by ID: ${error.message}`);
        //エラーを次の関数に渡す。
        next(error);
      });
  },

  delete: (req, res, next) => {
    //パラメータからidを取り出す
    let userId = req.params.id;
    //上記idから該当ユーザーを検索し削除する。
    User.findByIdAndRemove(userId)
      .then(() => {
        //ユーザーページへのルートをローカル変数へ保存
        res.locals.redirect = "/users";
        //関数のコードが完了したことをexpressへ通知
        next();
      })
        //エラーを補足して表示する。
      .catch(error => {
        console.log(`Error deleting user by ID: ${error.message}`);
        //関数のコードが完了したことをexpressへ通知
        next();
      });
  },
  login: (req, res) => {
    //ユーザーのログインページをレンダリングする。
    res.render("users/login");
  },
  //入力時にデータをサニタイズ
  validate: (req, res, next) => {
    req
      //Emailをサニタイズ(空白除去/データの型変更)する。
      .sanitizeBody("email")
      //emailの文字を小文字化
      .normalizeEmail({
        all_lowercase: true
      })
      //前後の空白を削除。
      .trim();

    //エラーメッセージをカスタム定義
    req.check("email", "メールアドレスを入力してください!").isEmail();
    req.check("password", "パスワードを入力してください!").notEmpty();
    req.check("password","文字数は 5文字以上〜10文字以下で入力してください!").isLength({min:5, max:10});
    req.check("section", "所属部署を入力してください!").notEmpty();

    req.getValidationResult().then(error => {
      //エラーがあった場合の処理。
      if (!error.isEmpty()) {
        let messages = error.array().map(e => e.msg);
        //バリデーションでエラーがあったら次の処理をせずスキップ。
        req.skip = true;
        //エラーをフラッシュメッセージ表示する。
        req.flash("error", messages.join(" and "));
        //新規ユーザー登録へのルートをローカル変数へ保存
        res.locals.redirect = "/users/new";
        //関数のコードが完了したことをexpressへ通知
        next();
      } else {
        //関数のコードが完了したことをexpressへ通知
        next();
      }
    });
  },
  //passportでユーザー認証。
  authenticate: passport.authenticate("local", {
    //登録失敗用の設定
    failureRedirect: "/users/login",
    failureFlash: "Failed to login.",
    //登録成功用の設定
    successRedirect: "/",
    successFlash: "ログインしました!"
  }),
  logout: (req, res, next) => {
    req.logout();
    //ログアウトをフラッシュメッセージ表示する。
    req.flash("success", "ログアウトしました!");
    //メインページへのルートをローカル変数へ保存
    res.locals.redirect = "/";
    //関数のコードが完了したことをexpressへ通知
    next();
  }
};
