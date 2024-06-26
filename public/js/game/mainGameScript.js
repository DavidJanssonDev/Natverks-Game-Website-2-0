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
    GameList.getPlayerObject(),
    GameList.getBulletObjectList()
  )
);

document.addEventListener("keyup", (event) =>
  resetDirection(event, GameList.getPlayerObject())
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

  MonsterWave.startSpawningOfMonsters();
  gameLoop();
}

async function saveScoreToDB() {
  const player = GameList.getPlayerObject();
  console.table({ Player: player, Score: player.score });

  const server_response = await fetch("/saveScore", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ score: player.score }),
  });

  const data = await server_response.json();

  if (data.saveScore) {
    console.log("Score saved");
    location.href = "/leaderboard";
  } else {
    console.log("Score not saved");
  }
}

function gameLoop() {
  console.log(GameList.getPlayerObject().stats.health);
  if (GameList.getPlayerObject().stats.health <= 0) {
    console.log("YOU DIED");
    saveScoreToDB();
    return;
  }

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

  requestAnimationFrame(gameLoop);
}

gameSetUp();
