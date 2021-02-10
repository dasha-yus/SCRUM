const User = require("./models/user");
const Project = require("./models/project");
const Task = require("./models/task");

let users = [
  {
    name: "admin",
    email: "admin@mail.ru",
    password: "$2a$10$UWr5YCW6gweRQFk3bxKZMeZnpkR82liSDS.MXwvVzKqxeiItAm6VS", // 1234567
    role: "admin",
  },
  {
    name: "user",
    email: "user@mail.ru",
    password: "$2a$10$BzDM/aX062knpsOXMwxKMOC8Cfs.ICQ8wShDcTgHAvG8Ttk1r4AKa", // 12345
    role: "user",
  },
];

function seedDB() {
  User.remove({}, (err) => {
    if (err) console.log(err);
    console.log("removed users!");
    users.forEach((seed) => {
      User.create(seed, (err, users) => {
        if (err) {
          console.log(err);
        } else {
          console.log("added a user");
        }
      });
    });
  });

  Project.remove({}, (err) => {
    if (err) console.log(err);
    console.log("removed projects!");
  });

  Task.remove({}, (err) => {
    if (err) console.log(err);
    console.log("removed tasks!");
  });
}

module.exports = seedDB;
