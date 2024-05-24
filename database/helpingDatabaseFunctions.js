const mysql = require("mysql2/promise");
const bcrypt = require("bcrypt");
const { randomNumber } = require("../randomStuff/randomNumber");

async function createConectionDB() {
  /**
   * Asynchronously creates a connection to the database.
   *
   * @return {Promise} A Promise that resolves to a connection to the specified database.
   */

  return await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "betyggshogandeprojektdb",
    multipleStatements: true,
  });
}

async function getGeneralScoreData() {
  /**
   * Retrieves the top 10 scores from the database.
   *
   * @return {Promise} A Promise that resolves to an array of top 10 scores.
   */

  const connection = await createConectionDB();

  let sql = `SELECT username, score FROM users ORDER BY score DESC LIMIT 10`;
  let [result] = await connection.execute(sql);
  return result;
}

async function getPersonalScoreData(username) {
  /**
   * Retrieves the top 10 scores from the database for the specified username.
   *
   * @param {string} username - The username to retrieve scores for.
   * @return {Promise} A Promise that resolves to an array of top 10 scores for the specified username.
   */

  const connection = await createConectionDB();
  let sql = `SELECT id FROM users WHERE username = ?`;
  let [result] = await connection.execute(sql, [username]);

  sql = `SELECT * FROM score_table WHERE user_id = ? ORDER BY score DESC LIMIT 10`;

  let [result2] = await connection.execute(sql, [result[0].id]);

  return result2;
}

async function isUserInDB(connection, username) {
  /**
   * Check if a user exists in the database.
   *
   * @param {Object} connection - The database connection object.
   * @param {string} username - The username to check in the database.
   * @return {boolean} true if the user exists in the database, false otherwise.
   */

  //! BASE CASES - if connection or username is false, return false
  if (!connection) return false;
  if (!username) return false;

  let sql = `SELECT * FROM users WHERE username = ?`;
  let [result] = await connection.execute(sql, [username]);

  if (result.length > 0) {
    return true;
  } else {
    return false;
  }
}

async function getUserFromDB(connection, username) {
  /**
   * Retrieves user information from the database based on the provided username.
   *
   * @param {Object} connection - The database connection object.
   * @param {string} username - The username to search for in the database.
   * @return {Object|boolean} The user information if found, otherwise false.
   */

  //! BASE CASES - if connection or username is false, return false
  if (!connection) return false;
  if (!username) return false;

  let sql = `SELECT * FROM users WHERE username = ?`;

  let [result] = await connection.execute(sql, [username]);

  if (result.length > 0) {
    return result[0];
  } else {
    return false;
  }
}

async function createUserInDB(connection, username, password) {
  /**
   * A function that creates a user in the database.
   *
   * @param {Object} connection - the database connection
   * @param {string} username - the username of the user
   * @param {string} password - the password of the user
   * @return {boolean} true if user creation is successful, false otherwise
   */
  //! BASE CASES - if connection or username or password is false, return false
  if (!connection) return false;
  if (!username) return false;
  if (!password) return false;

  let hashedPassword = await bcrypt.hash(password, randomNumber());
  let sql = `INSERT INTO users (username, password) VALUES (?, ?)`;

  let result = await connection.execute(sql, [username, hashedPassword]);

  console.log(`result:  ${result}`);
  console.log(`result.length:  ${result.length}`);

  if (result.length > 0) {
    return true;
  } else {
    return false;
  }
}

module.exports = {
  createConectionDB,
  isUserInDB,
  getUserFromDB,
  createUserInDB,
  getGeneralScoreData,
  getPersonalScoreData,
};
