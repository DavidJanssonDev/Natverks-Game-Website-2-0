// ---------------------------------------------------------------------
// SERVER SET UPP

const express = require("express");
const mysql = require("mysql2/promise");
const Handelbars = require("express-handlebars");
const { createConectionDB } = require("./database/helpingDatabaseFunctions");

const {
  switch: handelbars_switch,
  case: handelbars_case,
} = require("./helpers/swistchCase");
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

// ---------------------------------------------------------------------
// VARIABLES

const USER_IS_LOGED_IN = false;

app.get("/", async function (_req, res) {
  res.render("home", {
    title: "Game Home Page",
    username: "John Doe",
    isLoggedIn: USER_IS_LOGED_IN,
  });
});

app.get("/game", async function (_req, res) {
  if (!USER_IS_LOGED_IN) res.redirect("/");
  res.render("game", {
    title: "Game Page",
    containFooter: false,
    css: "game",
  });
});

app.get("/about", async function (_req, res) {
  if (!USER_IS_LOGED_IN) res.redirect("/");
  res.render("about", {
    title: "About Page",
    containFooter: true,
    css: "about",
  });
});

app.get("/login", async function (_req, res) {
  res.render("login", {
    title: "Login Page",
  });
});

app.post("/login", async function (_req, res) {
  const connection = await createConectionDB();
  const { username, password } = _req.body;

  if (await isUserInDB(connection, username)) {
    

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
