const deleteButtons = document.querySelectorAll(".delete-button");

deleteButtons.forEach((button) => {
  button.addEventListener("click", async (event) => {
    event.preventDefault();

    let result = await fetch("/scores/:id", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: button.value,
      }),
    });
    if (result.status === 200) {
      location.reload();
    }
  });
});
