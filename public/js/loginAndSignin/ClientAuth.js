const subBnt = document.getElementById("submit-button");

subBnt.addEventListener("click", async (event) => {
  event.preventDefault();
  const username = document.getElementById("username-feild").value;
  const password = document.getElementById("password-feild").value;

  console.log(`

  Username: ${username}
  Password: ${password}
  
  `);
  const server_response = await fetch("/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });
  const data = await server_response.json();

  if (data.login) {
    await swal("Login seccesful", "You have loged in successfully", "success");
    window.location.href = "/";
  } else {
    swal("Login failed", "Your username or password is wrong", "error");
  }
});
