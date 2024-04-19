import { Player, GameList, DrawingClass } from "./gameClassObjects.js";
import { resetDirection, updateDriection } from "./userController.js";

//? PLayer UPDATE

document.addEventListener("keydown", (event) =>
  updateDriection(
    event,
    GameList.getPlayerObjectList(),
    GameList.getBulletObjectList()
  )
);
document.addEventListener("keyup", (event) =>
  resetDirection(event, GameList.getPlayerObjectList())
);

//* GAME UPDATE LOOP

async function gameSetUp() {
  //* Setting up drawing tool

  const canvas = document.getElementById("canvas");

  DrawingClass.setCanvas(canvas);
  DrawingClass.setDrawingTool();

  //* Setting up player
  const serverResponse = await fetch("/gameSetup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  });

  const data = await serverResponse.json();
  const json_data = JSON.parse(data);

  console.table(json_data);
  const player = new Player(json_data);

  GameList.addPlayerObject(player);

  gameLoop();
}
function gameLoop() {
  // GET A LIST WITH ALL THE OBJECTS
  const ObjectList = GameList.getObjectList();

  // CLEAR THE CANVAS
  DrawingClass.clearCanvas();

  //* Rendering of the objects and updateing of the objects
  ObjectList.forEach((object) => {
    object.update();
    DrawingClass.draw(object);
  });

  requestAnimationFrame(gameLoop);
}

gameSetUp();
