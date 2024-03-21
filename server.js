const express = require("express");
const mysql = require("mysql2/promise");
const Handelbars = require("express-handlebars");

const {
  switch: handelbars_switch,
  case: handelbars_case,
} = require("./helpers/swistch_case");
const { extension } = require("mime");

const app = express();

app.engine(
  "handlebars",
  Handelbars.engine({
    helpers: {
      switch: handelbars_switch,
      case: handelbars_case,
    },
  })
);

app.set("view engine", "handlebars");
app.set("views", "./views");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.get("/", async function (_req, res) {
  res.render("home", {
    title: "Game Home Page",
    containFooter: true,
    css: "css",
    loggedIn: true,
  });
});

app.get("/game", async function (_req, res) {
  res.render("game", {
    title: "Game Page",
    containFooter: false,
    css: "game",
  });
});

app.get("/about", async function (_req, res) {
  res.render("about", {
    title: "About Page",
    containFooter: true,
    css: "about",
  });
});

app.get("/login", async function (_req, res) {
  res.render("login", {
    title: "Login Page",
    containFooter: true,
    css: "login",
  });
});

app.get("/logout", async function (_req, res) {
  res.render("logout", {
    title: "Logout Page",
    containFooter: true,
    css: "logout",
  });
});

app.get("/signup", async function (_req, res) {
  res.render("signup", {
    title: "Signup Page",
    containFooter: true,
    css: "signup",
  });
});

app.listen(process.env.PORT, function () {
  console.log(`
    Server port: ${process.env.PORT}
    Server URL: http://localhost:${process.env.PORT}
    `);
});
