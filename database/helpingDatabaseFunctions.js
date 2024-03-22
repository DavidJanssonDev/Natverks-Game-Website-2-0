const mysql = require("mysql2/promise");

async function createConectionDB() {
  return await mysql.createConnection(process.env.DB_CONECTION_DATA);
}

async function isUserInDB(connection, username) {
  return await connection.execute(
    "SELECT * FROM players WHERE username = ?",
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

module.exports = { createConectionDB, isUserInDB };
