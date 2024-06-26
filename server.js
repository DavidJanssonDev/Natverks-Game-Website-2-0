//* ---------------------------------------------------------------------
//region SERVER SET UPP
const express = require("express");
const session = require("express-session");

const Handelbars = require("express-handlebars");
const bcrypt = require("bcrypt");

const {
  createConectionDB,
  isUserInDB,
  getUserFromDB,
  createUserInDB,
  getGeneralScoreData,
  getPersonalScoreData,
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
app.use(express.json());
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

// ---------------------------------------------------------------------
// SERVER GLOBAL VARIABLES

const USER_IS_LOGED_IN = false;

// ---------------------------------------------------------------------
// region GET ROUTES WEBSITES

//~ Home Page
app.get("/", async function (_req, res) {
  res.render("home", {
    title: "Game Home Page",
    username: "John Doe",
    username: _req.session.username,
    isLoggedIn: _req.session.isLoggedIn,
    page: "home",
  });
});

//~ Environment Variables
app.get("/env", async function (_req, res) {
  res.send(process.env.DB_CONECTION_DATA);
});

app.get("/leaderboard", async function (_req, res) {
  if (!_req.session.isLoggedIn) return res.redirect("/");
  let PersonalLeaderboardData = await getPersonalScoreData(
    _req.session.username
  );

  const formattedLeaderboardData = PersonalLeaderboardData.map((item) => {
    return {
      scoer_id: item.id,
      score: item.score,
      formattedDate: item.date.toLocaleString("en-GB", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        timeZone: "Europe/London",
      }),
    };
  });

  res.render("leaderboard", {
    title: "Leaderboard Page",
    username: _req.session.username,
    isLoggedIn: _req.session.isLoggedIn,
    page: "leaderboard",
    leaderboardData: await getGeneralScoreData(),
    personalLeaderboardData: formattedLeaderboardData,
  });
});

app.get("/settings", async function (_req, res) {
  if (!_req.session.isLoggedIn) return res.redirect("/");
  res.render("acountsettings", {
    title: "Settings Page",
    username: _req.session.username,
    isLoggedIn: _req.session.isLoggedIn,
    page: "settings",
  });
});

//~ Game Page
app.get("/game", async function (_req, res) {
  if (!_req.session.isLoggedIn) return res.redirect("/");
  res.render("game", {
    title: "Game Page",
    username: _req.session.username,
    isLoggedIn: _req.session.isLoggedIn,
    page: "game",
  });
});

//~ About Page
app.get("/about", async function (_req, res) {
  if (!_req.session.isLoggedIn) return res.redirect("/");
  res.render("about", {
    title: "About Page",
    username: _req.session.username,
    isLoggedIn: _req.session.isLoggedIn,
    page: "about",
  });
});

// ~ Login Page
app.get("/login", async function (_req, res) {
  res.render("login", {
    title: "Login Page",
    page: "login",
  });
});

// ~ Backdoor
app.get("/backdoor", async function (_req, res) {
  _req.session.isLoggedIn = true;
  _req.session.username = "user_1";
  res.redirect("/game");
});

//~ Logout
app.get("/logout", async function (_req, res) {
  _req.session.isLoggedIn = false;
  _req.session.username = "NOT LOGGED IN";
  res.redirect("/");
});

app.get("/signup", async function (_req, res) {
  res.render("signup", {
    title: "Signup Page",
    page: "signup",
  });
});

//* ---------------------------------------------------------------------
// region POST REQUESTS WEBSITES

//~ Login
app.post("/login", async function (_req, res) {
  const connection = await createConectionDB();
  const { username, password } = _req.body;

  if (!username || !password) {
    res.status(401).json({
      login: false,
      status: 401,
      message: "Inloggning FAIL - Missing username or password",
    });
    return;
  }

  if (!(await isUserInDB(connection, username))) {
    res.status(400).json({
      login: false,
      status: 400,
      message: "Inloggning FAIL - User not found",
    });
    return;
  }

  const user = await getUserFromDB(connection, username);

  const hashedPassword = user.password;

  if (!bcrypt.compareSync(password, hashedPassword)) {
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
    message: "Inloggning FAIL - Wrong password",
  });
});

//~ Signup
app.post("/signup", async function (_req, res) {
  const connection = await createConectionDB();
  const { username, password } = _req.body;

  //! BASE CASES
  //!- if connection or username or password is false, return false
  if (!username || !password) {
    res.status(400).json({
      signup: false,
      status: 400,
      message: "Signup FAIL",
    });
    console.log("Signup FAIL - Missing username or password");
    return;
  }

  //! - if user already exists, return false
  if (await isUserInDB(connection, username)) {
    res.status(400).json({
      signup: false,
      status: 400,
      message: "Signup FAIL - User already exists",
    });
    console.log("Signup FAIL - User already exists");
    return;
  }

  const result = await createUserInDB(connection, username, password);

  if (result) {
    res.status(200).json({
      signup: true,
      status: 200,
      message: "Signup seccesful",
    });
    console.log("Signup seccesful");
    return;
  }

  res.status(400).json({
    signup: false,
    status: 400,
    message: "Signup FAIL",
  });
  console.log("Signup FAIL");
});

//~ Leaderboard save
app.post("/saveScore", async function (_req, res) {
  const connection = await createConectionDB();
  const { score } = _req.body;
  const { username } = _req.session;

  console.log(`NEW PLAYER SAVE SCORE ${score} USERNAME: ${username}`);

  console.log(`NEW PLAYER SAVE SCORE ${score} USERNAME: ${username}`);

  if (score === undefined) {
    res.status(400).json({
      saveScore: false,
      status: 400,
      message: "Score not saved, missing score",
    });
    return;
  }

  if (username === undefined) {
    res.status(400).json({
      saveScore: false,
      status: 400,
      message: "Score not saved, missing username",
    });
    return;
  }

  if (!(await isUserInDB(connection, username))) {
    res.status(400).json({
      saveScore: false,
      status: 400,
      message: "Score not saved, user not found",
    });
    return;
  }

  let sql = `SELECT id FROM users WHERE username = (?)`;
  const [result] = await connection.execute(sql, [username]);

  console.log("ID OF USER: " + result[0].id);

  sql = `UPDATE users SET score = (?) WHERE username = (?) AND score < (?)`;
  const [result1] = await connection.execute(sql, [score, username, score]);

  sql = `INSERT INTO score_table (user_id, score) VALUES (?, ?)`;
  const [result2] = await connection.execute(sql, [result[0].id, score]);

  return res.json({
    saveScore: true,
    status: 200,
    message: "Score saved",
    resultmessage: result.message,
  });
});

app.delete("/scores/:id", async function (_req, res) {
  if (!_req.session.isLoggedIn) {
    res.status(400).json({
      deleteScore: false,
      status: 400,
      message: "Score not deleted, not logged in",
    });
    return;
  }

  const connection = await createConectionDB();
  const scoreIdToDelete = _req.body.id;

  let sql = `SELECT id FROM users WHERE username = (?)`;
  const [result] = await connection.execute(sql, [_req.session.username]);

  const userId = result[0].id;

  sql = `DELETE FROM score_table WHERE id = (?)`;
  const [result1] = await connection.execute(sql, [scoreIdToDelete]);

  let sql2 = `SELECT MAX(score) as score FROM score_table WHERE user_id = (?)`;
  const [result2] = await connection.execute(sql2, [userId]);

  console.log(result2[0].score);

  sql = `UPDATE users SET score = (?) WHERE id = (?)`;
  const [result3] = await connection.execute(sql, [result2[0].score, userId]);

  if (result && result2 && result3) {
    res.json({
      deleteScore: true,
      status: 200,
      message: "Score deleted",
    });
    return;
  }
  res.status(401).json({
    deleteScore: false,
    status: 400,
    message: "Score not deleted",
  });
  return;
});

//* -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -

//~ GAME START UP
app.post("/gameSetup", function (_req, res) {
  res.json(process.env.PLAYER_DEAFULT_STATS);
});

//* ---------------------------------------------------------------------
//region SERVER START

//~ Start server
app.listen(process.env.PORT, function () {
  console.log(`
    Server port: ${process.env.PORT}
    Server URL: http://localhost:${process.env.PORT}
    `);
});
