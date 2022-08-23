"use strict";
//エクスプレスモジュールをロード
const express = require("express"),
  //レイアウト用ライブラリをロード
  layouts = require("express-ejs-layouts"),

  //エクスプレスを定数appへ代入してアプリオブジェクト生成
  app = express(),
  //経路設定用ライブラリをロードする。
  router = express.Router(),

  //各コントローラをロード
  homeController = require("./controllers/homeController"),
  errorController = require("./controllers/errorController"),
  tasksController = require("./controllers/tasksController.js"),
  usersController = require("./controllers/usersController.js"),
  projectsController = require("./controllers/projectsController.js"),

  //MongoDBのmongooseライブラリをロード
  mongoose = require("mongoose"),
  //method-overrideライブラリをロード
  methodOverride = require("method-override"),

  //認証関連ライブラリをロードし変数へ代入
  passport = require("passport"),
  cookieParser = require("cookie-parser"),
  expressSession = require("express-session"),
  expressValidator = require("express-validator"),
  //フラッシュメッセージ表示ライブラリをロード
  connectFlash = require("connect-flash"),

  //userモデルをロード
  User = require("./models/user");

//mongooseへ接続
mongoose.connect(
    //データベース名設定          ↓データベース名
  "mongodb://localhost:27017/gtdapp_db",
  //エラー対策用設定
  { useNewUrlParser: true }
);
mongoose.set("useCreateIndex", true);

//ポートを設定(ポートが定義されていれば変数portに入れる、無ければ値3000を入れる)
app.set("port", process.env.PORT || 3000);

app.set("view engine", "ejs");

//ルータにミドルウエア使用を設定
router.use(
  methodOverride("_method", {
    methods: ["POST", "GET"]
  })
);

router.use(layouts);
router.use(express.static("public"));
router.use(expressValidator());

//url等送信された内容を取り出せるよう変換
router.use(
  express.urlencoded({
    extended: false
  })
);
router.use(express.json());

//cokieParserへ秘密鍵設定
router.use(cookieParser("secretGtdapp123"));
router.use(
  expressSession({
    secret: "secretGtdapp123",
    cookie: {
      maxAge: 4000000
    },
    resave: false,
    saveUninitialized: false
  })
);

//ユーザー認証関連ライブラリ
router.use(connectFlash());
  //passportを初期化して使うよう設定。
router.use(passport.initialize());
  //passportへセッションを使うよう設定。
router.use(passport.session());
//ログインストラテジー設定。
passport.use(User.createStrategy());
//ユーザーデータの圧縮及び暗号化・複合化を実行するよう設定。
passport.serializeUser(User.serializeUser()); //データ圧縮
passport.deserializeUser(User.deserializeUser()); //圧縮データから抽出。

router.use((req, res, next) => {
  //userのログイン状態をローカル変数へ保存する。
  res.locals.loggedIn = req.isAuthenticated();
    //ログインしたuserに関するデータをローカル変数へ保存する。
  res.locals.currentUser = req.user;
  //フラッシュメッセージをローカル変数へ保存する。
  res.locals.flashMessages = req.flash();
  //関数のコードが完了したことをexpressへ通知
  next();
});

//ルート設定(コントローラと表示するページを関連付け) user関連
router.get("/", homeController.index);
router.get("/users", usersController.index, usersController.indexView);
router.get("/users/new", usersController.new);
router.post(
  "/users/create",
  usersController.validate,
  usersController.create,
  usersController.redirectView
);
router.get("/users/login", usersController.login);
router.post("/users/login", usersController.authenticate);
router.get("/users/logout", usersController.logout, usersController.redirectView);
router.get("/users/:id/edit", usersController.edit);
router.put("/users/:id/update", usersController.update, usersController.redirectView);
router.get("/users/:id", usersController.show, usersController.showView);
router.delete("/users/:id/delete", usersController.delete, usersController.redirectView);

//ルート設定(コントローラと表示するページを関連付け) task関連
router.get("/tasks", tasksController.index, tasksController.indexView);
router.get("/tasks/new", tasksController.new);
router.post(
  "/tasks/create",
  tasksController.create,
  tasksController.redirectView
);
router.get("/tasks/:id/edit", tasksController.edit);
router.put(
  "/tasks/:id/update",
  tasksController.update,
  tasksController.redirectView
);
router.get("/tasks/:id", tasksController.show, tasksController.showView);
router.delete(
  "/tasks/:id/delete",
  tasksController.delete,
  tasksController.redirectView
);

//ルート設定(コントローラと表示するページを関連付け) Project関連
router.get("/projects", projectsController.index, projectsController.indexView);
router.get("/projects/new", projectsController.new);
router.post("/projects/create", projectsController.create, projectsController.redirectView);
router.get("/projects/:id/edit", projectsController.edit);
router.put("/projects/:id/update", projectsController.update, projectsController.redirectView);
router.get("/projects/:id", projectsController.show, projectsController.showView);
router.delete("/projects/:id/delete", projectsController.delete, projectsController.redirectView);

//ルート設定(コントローラと表示するページを関連付け) error関連
router.use(errorController.pageNotFoundError);
router.use(errorController.internalServerError);

app.use("/", router);

//ポート監視を設定
app.listen(app.get("port"), () => {
  console.log(`Server running at http://localhost:${app.get("port")}`);
});
