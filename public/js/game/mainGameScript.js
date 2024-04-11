import { Player, GameList, DrawingClass } from "./gameClassObjects.js";
import { resetDirection, updateDriection } from "./userController.js";

//? PLayer UPDATE

document.addEventListener("keydown", (event) =>
  updateDriection(event, GameList.getPlayerObjectList())
);
document.addEventListener("keyup", (event) =>
  resetDirection(event, GameList.getPlayerObjectList())
);

//* GAME UPDATE LOOP

async function gameSetUp() {
  //* Setting up drawing tool

  const canvas = document.getElementById("canvas");
  const canvasDrawingTool = canvas.getContext("2d");

  canvasDrawingTool.fillRect(190, 190, 100, 100);

  DrawingClass.setDrawingTool(canvasDrawingTool);

  //* Setting up player
  const serverResponse = await fetch("/gameSetup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  });
  const data = JSON.parse(await serverResponse.json());

  const player = new Player(data);
  GameList.addPlayerObject(player);

  DrawingClass.draw(player);

  // gameLoop();
}

function gameLoop() {
  const ObjectList = GameList.getObjectList();

  ObjectList.forEach((object) => {
    object.update();
    DrawingClass.draw(object);
  });
  requestAnimationFrame(gameLoop);
}

// gameLoop();

gameSetUp();
