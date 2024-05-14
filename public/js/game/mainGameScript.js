import {
  DrawingClass,
  GameList,
  Player,
  MonsterWave,
} from "./gameClassObjects.js";
import { updateDriection, resetDirection } from "./userController.js";

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

async function gameSetUp() {
  //* Setting up drawing tool
  const canvas = document.getElementById("canvas");

  DrawingClass.setCanvas(canvas);
  DrawingClass.setDrawingTool();

  // Getting the data from the server
  const serverResponse = await fetch("/gameSetup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  });

  const data = await serverResponse.json();
  const player_data = await JSON.parse(data);

  const player = new Player(player_data);
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

  // Wave System
  if (!MonsterWave.waveOnGoing) {
    console.log(MonsterWave.currentWave);

    MonsterWave.updateWave();
    console.log(MonsterWave.currentWave);
    MonsterWave.spawnWave(MonsterWave.currentWave);
  }
  requestAnimationFrame(gameLoop);
}

gameSetUp();
