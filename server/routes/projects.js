const express = require("express");
const router = express.Router();
const isLoggedIn = require("../middleware/auth");

const Project = require("../models/project");
const Task = require("../models/task");

router.post("/new-project", isLoggedIn, async (req, res, next) => {
  try {
    let project = await new Project({
      author: req.body.author,
      name: req.body.name,
      description: req.body.description,
    }).save();

    res.end(JSON.stringify(project));
  } catch (err) {
    next(err);
  }
});

router.get("/:project_id", isLoggedIn, (req, res) => {
  Project.findById(req.params.project_id)
    .then((project) => res.json(project))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.get("/", isLoggedIn, (req, res) => {
  Project.find()
    .then((projects) => res.json(projects))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.delete("/:project_id", isLoggedIn, async (req, res, next) => {
  try {
    let project = await Project.findByIdAndRemove(req.params.project_id);
    await removeTasksFromProject(req.params.project_id);

    res.end(JSON.stringify(project));
  } catch (err) {
    next(err);
  }
});

router.put("/:project_id/tasks/add", isLoggedIn, (req, res) => {
  Project.findByIdAndUpdate(
    req.params.project_id,
    {
      $push: { tasks: req.body._id },
    },
    {
      new: true,
    }
  ).exec((err, result) => {
    if (err) {
      return res.status(422).json({ error: err });
    } else {
      res.json(result);
    }
  });
});

router.put("/:project_id/tasks/delete", isLoggedIn, (req, res) => {
  Project.findByIdAndUpdate(
    req.params.project_id,
    {
      $pull: { tasks: req.body._id },
    },
    {
      new: true,
    }
  ).exec((err, result) => {
    if (err) {
      return res.status(422).json({ error: err });
    } else {
      res.json(result);
    }
  });
});

router.put("/edit/:id", isLoggedIn, (req, res, next) => {
  Project.findByIdAndUpdate(
    req.params.id,
    {
      $set: req.body,
    },
    (error, data) => {
      if (error) {
        return next(error);
      } else {
        res.json(data);
      }
    }
  );
});

function removeTasksFromProject(project_id) {
  return Task.deleteMany({ project_id: project_id });
}

module.exports = router;
