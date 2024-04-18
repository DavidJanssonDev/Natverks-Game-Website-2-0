export function updateDriection(event, player) {
  switch (event.key) {
    case "a":
      player.movementData.keys.KeyLeft = true;
      break;

    case "d":
      player.movementData.keys.KeyRight = true;
      break;

    case "w":
      player.movementData.keys.KeyUp = true;
      break;

    case "s":
      player.movementData.keys.KeyDown = true;
      break;

    case "ArrowLeft":
      player.movementData.keys.LeftArrow = true;
      break;

    case "ArrowRight":
      player.movementData.keys.RightArrow = true;
      break;

    case "ArrowUp":
      player.movementData.keys.UpArrow = true;
      break;

    case "ArrowDown":
      player.movementData.keys.DownArrow = true;
      break;

    case " ":
      player.shoot();
      break;
  }
}

export function resetDirection(event, player) {
  switch (event.key) {
    case "a":
      player.movementData.keys.KeyLeft = false;
      break;

    case "d":
      player.movementData.keys.KeyRight = false;
      break;

    case "w":
      player.movementData.keys.KeyUp = false;
      break;

    case "s":
      player.movementData.keys.KeyDown = false;
      break;

    case "ArrowLeft":
      player.movementData.keys.LeftArrow = false;
      break;
    case "ArrowRight":
      player.movementData.keys.RightArrow = false;
      break;
    case "ArrowUp":
      player.movementData.keys.UpArrow = false;
      break;
    case "ArrowDown":
      player.movementData.keys.DownArrow = false;
      break;
  }
}
