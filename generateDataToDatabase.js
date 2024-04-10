const bcrypt = require("bcrypt");
const { randomNumber } = require("./randomStuff/randomNumber");

function hashUserPassword(password) {
  return bcrypt.hashSync(password, randomNumber());
}

async function createUser(username, password) {
  return {
    username: username,
    password: hashUserPassword(password),
  };
}

let user = createUser("user_1", "password_1");

console.log(user);
