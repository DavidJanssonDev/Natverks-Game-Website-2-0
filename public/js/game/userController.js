export function updateDriection(event, player, bulletList) {
  switch (event.key) {
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
      player.playerShoot();
      break;
  }
}

export function resetDirection(event, player) {
  switch (event.key) {
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
