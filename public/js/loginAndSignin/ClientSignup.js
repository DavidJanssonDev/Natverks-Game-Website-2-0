const subBnt = document.getElementById("submit-button");

subBnt.addEventListener("click", async (event) => {
  event.preventDefault();
  const username = document.getElementById("username-feild").value;
  const password = document.getElementById("password-feild").value;

  const server_response = await fetch("/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });
  const data = await server_response.json();

  console.log(data.signup);

  if (data.signup) {
    await swal("Signup seccesful", "You have signed up", "success");
    window.location.href = "/";
  } else [swal("Signup failed", "Your username is already taken", "warning")];
});
