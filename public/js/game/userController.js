export function updateDriection(event, player, bulletList) {
  switch (event.key) {
    case "a":
      player.playerControll.keys.KeyA = true;

      break;

    case "d":
      player.playerControll.keys.KeyD = true;

      break;

    case "w":
      player.playerControll.keys.KeyW = true;

      break;

    case "s":
      player.playerControll.keys.KeyS = true;

      break;

    case "ArrowLeft":
      player.playerControll.arrowKeys.ArrowLeft = true;
      break;

    case "ArrowRight":
      player.playerControll.arrowKeys.ArrowRight = true;
      break;

    case "ArrowUp":
      player.playerControll.arrowKeys.ArrowUp = true;
      break;

    case "ArrowDown":
      player.playerControll.arrowKeys.ArrowDown = true;
      break;

    case " ":
      player.playerControll.shotingKey.Space = true;
      break;
  }
}

export function resetDirection(event, player) {
  switch (event.key) {
    case "a":
      player.playerControll.keys.KeyA = false;
      break;

    case "d":
      player.playerControll.keys.KeyD = false;
      break;

    case "w":
      player.playerControll.keys.KeyW = false;
      break;

    case "s":
      player.playerControll.keys.KeyS = false;
      break;

    case "ArrowLeft":
      player.playerControll.arrowKeys.ArrowLeft = false;
      break;
    case "ArrowRight":
      player.playerControll.arrowKeys.ArrowRight = false;
      break;
    case "ArrowUp":
      player.playerControll.arrowKeys.ArrowUp = false;
      break;
    case "ArrowDown":
      player.playerControll.arrowKeys.ArrowDown = false;
      break;

    case " ":
      player.playerControll.shotingKey.Space = false;
      break;
  }
}
