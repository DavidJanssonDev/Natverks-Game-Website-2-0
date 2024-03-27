// ---------------------------------------------------------------------
// SERVER SET UPP

const express = require("express");
const session = require("express-session");
const mysql = require("mysql2/promise");

const Handelbars = require("express-handlebars");

const {
  createConectionDB,
  isUserInDB,
} = require("./database/helpingDatabaseFunctions");

const {
  handelbars_switch_function,
  handelbars_case_function,
} = require("./helpers/swistchCase");

const app = express();

app.engine(
  "handlebars",
  Handelbars.engine({
    defaultLayout: "main",
    helpers: {
      switch: handelbars_switch_function,
      case: handelbars_case_function,
    },
  })
);

app.set("view engine", "handlebars");
app.set("views", "./views");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

// ---------------------------------------------------------------------
// VARIABLES

const USER_IS_LOGED_IN = false;

app.get("/", async function (_req, res) {
  res.render("home", {
    title: "Game Home Page",
    username: "John Doe",
    isLoggedIn: _req.session.isLoggedIn,
    page: "home",
  });
});

app.get("/env", async function (_req, res) {
  res.send(process.env.DB_CONECTION_DATA);
});

app.get("/game", async function (_req, res) {
  if (!USER_IS_LOGED_IN) res.redirect("/");
  res.render("game", {
    title: "Game Page",
    page: "game",
  });
});

app.get("/about", async function (_req, res) {
  if (!USER_IS_LOGED_IN) res.redirect("/");
  res.render("about", {
    title: "About Page",
    page: "about",
  });
});

app.get("/login", async function (_req, res) {
  res.render("login", {
    title: "Login Page",
    page: "login",
  });
});

app.post("/login", async function (_req, res) {
  const connection = await createConectionDB();
  const { username, password } = _req.body;

  if (!username || !password) {
    res.status(401).json({
      login: false,
      status: 401,
      message: "Inloggning FAIL",
    });
    return;
  }

  const user = await getUserFromDB(connection, username);

  if (!user) {
    res.status(400).json({
      login: false,
      status: 400,
      message: "Inloggning FAIL - User not found",
    });
    return;
  }

  const hashedPassword = user.password;

  if (!(await bcrypt.compare(password, hashedPassword))) {
    res.status(400).json({
      login: false,
      status: 400,
      message: "Inloggning FAIL - Wrong password",
    });
    return;
  }

  if (user && (await bcrypt.compare(password, hashedPassword))) {
    _req.session.username = username;
    _req.session.isLoggedIn = true;

    res.json({
      login: true,
      status: 200,
      message: "Inloggning seccesful",
    });
    return;
  }
  res.status(400).json({
    login: false,
    status: 400,
    message: "Inloggning FAIL",
  });
});

app.get("/logout", async function (_req, res) {
  res.render("logout", {
    title: "Logout Page",
    page: "logout",
  });
});

app.get("/signup", async function (_req, res) {
  res.render("signup", {
    title: "Signup Page",
    page: "signup",
  });
});

app.listen(process.env.PORT, function () {
  console.log(`
    Server port: ${process.env.PORT}
    Server URL: http://localhost:${process.env.PORT}
    `);
});
