export function updateDriection(event, player, bulletList) {
  switch (event.key) {
    case "a":
      player.movementData.keys.KeyLeft = true;
      player.movementData.KeysPressed++;
      break;

    case "d":
      player.movementData.keys.KeyRight = true;
      player.movementData.KeysPressed++;
      break;

    case "w":
      player.movementData.keys.KeyUp = true;
      player.movementData.KeysPressed++;
      break;

    case "s":
      player.movementData.keys.KeyDown = true;
      player.movementData.KeysPressed++;
      break;

    case "ArrowLeft":
      player.movementData.keys.LeftArrow = true;
      player.movementData.KeysPressed++;
      break;

    case "ArrowRight":
      player.movementData.keys.RightArrow = true;
      player.movementData.KeysPressed++;
      break;

    case "ArrowUp":
      player.movementData.keys.UpArrow = true;
      player.movementData.KeysPressed++;
      break;

    case "ArrowDown":
      player.movementData.keys.DownArrow = true;
      player.movementData.KeysPressed++;
      break;

    case " ":
      if (bulletList.Count > player.statsData.maximumAmoutOfBulletsToRender)
        return;
      console.table(player.movementData.direction.latestDirection);
      console.log(player);
      console.log(bulletList);
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
