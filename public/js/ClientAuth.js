const subBnt = document.getElementById("submitButton");

subBnt.addEventListener("click", (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  fetch("/loginScripts/athucation.js", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });
  location.assign();
});
