/*********************************************************************************
*  WEB700 – Assignment 04
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part 
*  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: Beatriz Alves Student ID: 112419247 Date: 2025-03-10
*
*  Online (Vercel) Link: ________________________________________________________
*
********************************************************************************/ 
const express = require("express");
const path = require("path");
require("pg");
const collegeData = require("./modules/collegeData.js");
const app = express();
const HTTP_PORT = process.env.PORT || 8080;

app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));
app.set("views", __dirname + "/views");

app.get("/students/add", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "addStudent.html"));
});

app.post("/students/add", (req, res) => {
  collegeData.addStudent(req.body)
    .then(() => {
      res.redirect("/students");
    })
    .catch(err => {
      res.json({ message: err });
    });
});

app.get("/students", (req, res) => {
  if (req.query.course) {
    collegeData.getStudentsByCourse(req.query.course)
      .then(data => res.json(data))
      .catch(err => res.json({ message: "no results" }));
  } else {
    collegeData.getAllStudents()
      .then(data => res.json(data))
      .catch(err => res.json({ message: "no results" }));
  }
});

app.get("/tas", (req, res) => {
  collegeData.getTAs()
    .then(data => res.json(data))
    .catch(err => res.json({ message: "no results" }));
});

app.get("/courses", (req, res) => {
  collegeData.getCourses()
    .then(data => res.json(data))
    .catch(err => res.json({ message: "no results" }));
});

app.get("/student/:num", (req, res) => {
  collegeData.getStudentByNum(req.params.num)
    .then(data => res.json(data))
    .catch(err => res.json({ message: "no results" }));
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "home.html"));
});

app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "about.html"));
});

app.get("/htmlDemo", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "htmlDemo.html"));
});

app.use((req, res) => {
  res.status(404).send("Page Not Found");
});

collegeData.initialize()
  .then(() => {
    app.listen(HTTP_PORT, () => {
      console.log("server listening on port: " + HTTP_PORT);
    });
  })
  .catch(err => {
    console.log("Failed to initialize data: " + err);
  });
