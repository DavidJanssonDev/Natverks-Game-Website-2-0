import { Player, GameList } from "./gameClassObjects.js";
import { resetDirection, updateDriection } from "./userController.js";

const CANVAS_CONTEXT = document.getElementById("game-element").getContext("2D");

//? PLayer UPDATE

document.addEventListener("keydown", (event) =>
  updateDriection(
    event,
    gameObjects.playerAndMonsters.find(
      (object) => object.constructor.name === "Player"
    )
  )
);
document.addEventListener("keyup", (event) =>
  resetDirection(
    event,
    gameObjects.playerAndMonsters.find(
      (object) => object.constructor.name === "Player"
    )
  )
);

//* GAME UPDATE LOOP

async function gameSetUp() {
  const server_response = await fetch("/gameSetup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  });
  const data = JSON.parse(await server_response.json());

  console.log(data);

  const player = new Player(data);
  GameList.setPlayerObjectList(player);

  console.log(player);

  // gameLoop();
}

function gameLoop() {
  Object.values(gameObjects).forEach((object_list) => {
    object_list.forEach((object) => {
      object.update();
      object.draw();
    });
  });
  requestAnimationFrame(gameLoop);
}

// gameLoop();

gameSetUp();
