const mysql = require("mysql2/promise");

async function createConectionDB() {
  return await mysql.createConnection(
    JSON.parse(process.env.DB_CONECTION_DATA)
  );
}

async function isUserInDB(connection, username) {
  if (!connection) return false;

  if (!username) return false;

  return await connection.execute(
    "SELECT * FROM players WHERE username = ? AND password = ?",
    [username],
    function (err, result) {
      if (err) throw err;
      if (result.length > 0) {
        return true;
      } else {
        return false;
      }
    }
  );
}

async function getUserFromDB(connection, username) {
  if (!connection) return false;
  if (!username) return false;

  return await connection.execute(
    `SELECT * FROM ${process.env.DB_TABLE_NAME} WHERE username = ?`,
    [username],
    function (err, result) {
      if (err) throw err;
      if (result.length > 0) {
        return result[0];
      } else {
        return false;
      }
    }
  );
}

async function createUserInDB(connection, username, password) {
  if (!connection) return false;
  if (!username) return false;
  if (!password) return false;

  return await connection.execute(
    `INSERT INTO ${process.env.DB_TABLE_NAME} (username, password) VALUES (?, ?)`,
    [username, password],
    function (err, result) {
      if (err) throw err;
      if (result) {
        return true;
      } else {
        return false;
      }
    }
  );
}

module.exports = { createConectionDB, isUserInDB };
