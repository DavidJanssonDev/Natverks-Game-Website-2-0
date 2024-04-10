function randomNumber() {
  return Math.floor(
    Math.random() * Math.pow(10, Math.floor(Math.random() + 1))
  );
}

module.exports = {
  randomNumber,
};
