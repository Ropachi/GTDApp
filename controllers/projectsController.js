"use strict";

const Project = require("../models/project"),
  getProjectParams = body => {
    return {
      proname: body.proname,
      description: body.description,
    };
  };

module.exports = {
  index: (req, res, next) => {
    Project.find()
      .then(projects => {
        res.locals.projects = projects;
        next();
      })
      .catch(error => {
        console.log(`Error fetching projects: ${error.message}`);
        next(error);
      });
  },
  indexView: (req, res) => {
    res.render("projects/index");
  },

  new: (req, res) => {
    res.render("projects/new");
  },

  create: (req, res, next) => {
    let projectParams = getProjectParams(req.body);
    Project.create(projectParams)
      .then(project => {
        res.locals.redirect = "/projects";
        res.locals.project = project;
        next();
      })
      .catch(error => {
        console.log(`Error saving project: ${error.message}`);
        next(error);
      });
  },

  redirectView: (req, res, next) => {
    let redirectPath = res.locals.redirect;
    if (redirectPath !== undefined) res.redirect(redirectPath);
    else next();
  },

  show: (req, res, next) => {
    let projectId = req.params.id;
    Project.findById(projectId)
      .then(project => {
        res.locals.project = project;
        next();
      })
      .catch(error => {
        console.log(`Error fetching project by ID: ${error.message}`);
        next(error);
      });
  },

  showView: (req, res) => {
    res.render("projects/show");
  },

  edit: (req, res, next) => {
    let projectId = req.params.id;
    Project.findById(projectId)
      .then(project => {
        res.render("projects/edit", {
          project: project
        });
      })
      .catch(error => {
        console.log(`Error fetching project by ID: ${error.message}`);
        next(error);
      });
  },

  update: (req, res, next) => {
    let projectId = req.params.id,
      projectParams = getProjectParams(req.body);

    Project.findByIdAndUpdate(projectId, {
      $set: projectParams
    })
      .then(project => {
        res.locals.redirect = `/projects/${projectId}`;
        res.locals.project = project;
        next();
      })
      .catch(error => {
        console.log(`Error updating project by ID: ${error.message}`);
        next(error);
      });
  },

  delete: (req, res, next) => {
    let projectId = req.params.id;
    Project.findByIdAndRemove(projectId)
      .then(() => {
        res.locals.redirect = "/projects";
        next();
      })
      .catch(error => {
        console.log(`Error deleting project by ID: ${error.message}`);
        next();
      });
  }
};
