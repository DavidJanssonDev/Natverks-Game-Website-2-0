export function updateDriection(event, Player) {
  switch (event.key) {
    case "ArrowLeft" | "a":
      Player.playerDirection.x = -1;
      Player.playerDirection.y = 0;
      break;
    case "ArrowRight" | "d":
      Player.playerDirection.x = 1;
      Player.playerDirection.y = 0;
      break;
    case "ArrowUp" | "w":
      Player.playerDirection.x = 0;
      Player.playerDirection.y = -1;
      break;
    case "ArrowDown" | "s":
      Player.playerDirection.x = 0;
      Player.playerDirection.y = 1;
      break;
  }
}

export function resetDirection(event, Player) {
  switch (event.key) {
    case "ArrowLeft" | "a":
      Player.playerDirection.x = 0;
      break;
    case "ArrowRight" | "d":
      Player.playerDirection.x = 0;
      break;
    case "ArrowUp" | "w":
      Player.playerDirection.y = 0;
      break;
    case "ArrowDown" | "s":
      Player.playerDirection.y = 0;
      break;
  }
}
