export function updateDriection(event, player) {
  switch (event.key) {
    case "a":
      player.movementData.keys.left = true;
      break;

    case "d":
      player.movementData.keys.right = true;
      break;

    case "w":
      player.movementData.keys.up = true;
      break;

    case "s":
      player.movementData.keys.down = true;
      break;

    case "ArrowLeft":
      player.movementData.keys.left = true;
      break;

    case "ArrowRight":
      player.movementData.keys.right = true;
      break;

    case "ArrowUp":
      player.movementData.keys.up = true;
      break;

    case "ArrowDown":
      player.movementData.keys.down = true;
      break;
  }
}

export function resetDirection(event, player) {
  switch (event.key) {
    case "a":
      player.movementData.keys.left = false;
      break;

    case "d":
      player.movementData.keys.right = false;
      break;

    case "w":
      player.movementData.keys.up = false;
      break;

    case "s":
      player.movementData.keys.down = false;
      break;

    case "ArrowLeft":
      player.movementData.keys.left = false;
      break;
    case "ArrowRight":
      player.movementData.keys.right = true;
      break;
    case "ArrowUp":
      player.movementData.keys.up = true;
      break;
    case "ArrowDown":
      player.movementData.keys.down = true;
      break;
  }
}
