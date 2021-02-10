const express = require("express");
const router = express.Router();
const isLoggedIn = require("../middleware/auth");
const Task = require("../models/task");
const Project = require("../models/project");

router.post("/:project_id/tasks/new", isLoggedIn, async (req, res, next) => {
  try {
    let { name, description, story_points } = req.body;

    let task = await new Task({
      project_id: req.params.project_id,
      name,
      description,
      story_points,
    }).save();

    await addTaskToProject(req.params.project_id, task._id);

    res.end(JSON.stringify(task));
  } catch (err) {
    next(err);
  }
});

router.delete(
  "/:project_id/tasks/:task_id",
  isLoggedIn,
  async (req, res, next) => {
    try {
      let task = await Task.findByIdAndRemove(req.params.task_id);
      await removeTaskFromProject(req.params.project_id, req.params.task_id);

      res.end(JSON.stringify(task));
    } catch (err) {
      next(err);
    }
  }
);

router.get("/:project_id", isLoggedIn, (req, res) => {
  Task.find({ project_id: req.params.project_id })
    .then((task) => res.json(task))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.get(
  "/:project_id/tasks/:task_id",
  isLoggedIn,
  async (req, res, next) => {
    try {
      let task = await Task.findById(req.params.task_id);
      res.end(JSON.stringify(task));
    } catch (err) {
      next(err);
    }
  }
);

router.put(
  "/:project_id/tasks/:task_id",
  isLoggedIn,
  async (req, res, next) => {
    try {
      let task = await Task.findByIdAndUpdate(req.params.task_id, req.body, {
        new: true,
      });
      res.end(JSON.stringify(task));
    } catch (err) {
      next(err);
    }
  }
);

router.put("/edit/:id", isLoggedIn, (req, res, next) => {
  Task.findByIdAndUpdate(
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

router.get("/:project_id", isLoggedIn, (req, res) => {
  Projects.findById(req.params.project_id)
    .then((tasks) =>
      res.json(
        tasks.filter((task) => task.project_id === req.params.project_id)
      )
    )
    .catch((err) => res.status(400).json("Error: " + err));
});

function addTaskToProject(project_id, task_id) {
  return Project.updateOne(
    { _id: project_id },
    { $addToSet: { tasks: task_id } }
  );
}

function removeTaskFromProject(project_id, task_id) {
  return Project.updateOne({ _id: project_id }, { $pull: { tasks: task_id } });
}

module.exports = router;
