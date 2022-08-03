"use strict";

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
    Task.find()
      .then(tasks => {
        res.locals.tasks = tasks;
        next();
      })
      .catch(error => {
        console.log(`Error fetching tasks: ${error.message}`);
        next(error);
      });
  },
  indexView: (req, res) => {
    res.render("tasks/index");
  },

  new: (req, res) => {
    res.render("tasks/new");
  },

  create: (req, res, next) => {
    let taskParams = getTaskParams(req.body);
    Task.create(taskParams)
      .then(task => {
        res.locals.redirect = "/tasks";
        res.locals.task = task;
        next();
      })
      .catch(error => {
        console.log(`Error saving task: ${error.message}`);
        next(error);
      });
  },

  redirectView: (req, res, next) => {
    let redirectPath = res.locals.redirect;
    if (redirectPath !== undefined) res.redirect(redirectPath);
    else next();
  },
  show: (req, res, next) => {
    let taskId = req.params.id;
    Task.findById(taskId)
      .then(task => {
        res.locals.task = task;
        next();
      })
      .catch(error => {
        console.log(`Error fetching task by ID: ${error.message}`);
        next(error);
      });
  },

  showView: (req, res) => {
    res.render("tasks/show");
  },

  edit: (req, res, next) => {
    let taskId = req.params.id;
    Task.findById(taskId)
      .then(task => {
        res.render("tasks/edit", {
          task: task
        });
      })
      .catch(error => {
        console.log(`Error fetching task by ID: ${error.message}`);
        next(error);
      });
  },

  update: (req, res, next) => {
    let taskId = req.params.id,
      taskParams = getTaskParams(req.body);

    Task.findByIdAndUpdate(taskId, {
      $set: taskParams
    })
      .then(task => {
        res.locals.redirect = `/tasks/${taskId}`;
        res.locals.task = task;
        next();
      })
      .catch(error => {
        console.log(`Error updating task by ID: ${error.message}`);
        next(error);
      });
  },

  delete: (req, res, next) => {
    let taskId = req.params.id;
    Task.findByIdAndRemove(taskId)
      .then(() => {
        res.locals.redirect = "/tasks";
        next();
      })
      .catch(error => {
        console.log(`Error deleting task by ID: ${error.message}`);
        next();
      });
  }
};
