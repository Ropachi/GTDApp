"use strict";

const express = require("express"),
  layouts = require("express-ejs-layouts"),
  app = express(),
  router = express.Router(),
  homeController = require("./controllers/homeController"),
  errorController = require("./controllers/errorController"),
  tasksController = require("./controllers/tasksController.js"),
  usersController = require("./controllers/usersController.js"),
  projectsController = require("./controllers/projectsController.js"),
  mongoose = require("mongoose"),
  methodOverride = require("method-override"),
  passport = require("passport"),
  cookieParser = require("cookie-parser"),
  expressSession = require("express-session"),
  expressValidator = require("express-validator"),
  connectFlash = require("connect-flash"),
  User = require("./models/user");

mongoose.connect(
  "mongodb://localhost:27017/gtdapp_db",
  { useNewUrlParser: true }
);
mongoose.set("useCreateIndex", true);

app.set("port", process.env.PORT || 3000);
app.set("view engine", "ejs");

router.use(
  methodOverride("_method", {
    methods: ["POST", "GET"]
  })
);

router.use(layouts);
router.use(express.static("public"));
router.use(expressValidator());
router.use(
  express.urlencoded({
    extended: false
  })
);
router.use(express.json());

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
router.use(connectFlash());

router.use(passport.initialize());
router.use(passport.session());
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

router.use((req, res, next) => {
  res.locals.loggedIn = req.isAuthenticated();
  res.locals.currentUser = req.user;
  res.locals.flashMessages = req.flash();
  next();
});

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

router.get("/projects", projectsController.index, projectsController.indexView);
router.get("/projects/new", projectsController.new);
router.post("/projects/create", projectsController.create, projectsController.redirectView);
router.get("/projects/:id/edit", projectsController.edit);
router.put("/projects/:id/update", projectsController.update, projectsController.redirectView);
router.get("/projects/:id", projectsController.show, projectsController.showView);
router.delete("/projects/:id/delete", projectsController.delete, projectsController.redirectView);

router.use(errorController.pageNotFoundError);
router.use(errorController.internalServerError);

app.use("/", router);

app.listen(app.get("port"), () => {
  console.log(`Server running at http://localhost:${app.get("port")}`);
});
