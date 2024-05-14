const bcrypt = require("bcrypt");

const { randomNumber } = require("./randomStuff/randomNumber");

function hashUserPassword(password) {
  return bcrypt.hashSync(password);
}

async function createUser(username, password) {
  return {
    username: username,
    password: hashUserPassword(password),
  };
}

let user = createUser("user_1", "123");

console.log(user);
