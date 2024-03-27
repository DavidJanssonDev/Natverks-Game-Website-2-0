const subBnt = document.getElementById("submitButton");

subBnt.addEventListener("click", async (event) => {
  console.log("SERVER GETTING THE DATA");
  event.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const server_response = await fetch("/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });
  const data = await server_response.json();
  console.log(data);
});
