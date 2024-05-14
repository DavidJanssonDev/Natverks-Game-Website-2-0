const Random = require("crypto-random");
function randomNumber() {
  return Math.floor(
    Random.value() * Math.pow(10, Math.floor(Random.value() + 1))
  );
}

module.exports = {
  randomNumber,
};
