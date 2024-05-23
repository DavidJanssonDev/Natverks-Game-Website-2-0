// #region General Game Class Object
class GeneralObject {
  constructor(stats) {
    this.stats = {
      health: stats.health,
      speed: stats.speed,
      color: stats.color,
      size: stats.size,
    };

    this.postion = stats.postion;

    this.movement = {
      direction: {
        x: 0,
        y: 0,
      },

      speed: {
        x: this.stats.speed,
        y: this.stats.speed,
      },
    };
  }
  draw(ctx) {
    const drawingInfo = {
      x: this.postion.x,
      y: this.postion.y,
      width: this.stats.size.width,
      height: this.stats.size.height,
    };

    ctx.fillStyle = this.stats.color;

    ctx.fillRect(
      drawingInfo.x,
      drawingInfo.y,
      drawingInfo.width,
      drawingInfo.height
    );
  }
}
// #region CLASS PLAYER

export class Player extends GeneralObject {
  constructor(playerData) {
    super({
      health: playerData.Health,
      speed: playerData.Speed,
      color: playerData.playerColor,
      size: {
        width: playerData.width,
        height: playerData.height,
      },
      postion: {
        x: playerData.startXPos,
        y: playerData.startYPos,
      },
    });

    this.movement.shootingDirection = {
      x: 1,
      y: 0,
    };

    this.playerControll = {
      arrowKeys: {
        ArrowUp: false,
        ArrowDown: false,
        ArrowLeft: false,
        ArrowRight: false,
      },

      // SHOOTING KEY
      shotingKey: {
        Space: false,
      },
    };

    // THIS IS DETERMENT HOW FREQUENT THE PLAYER CAN SHOOT
    this.acrivBulletLimit = playerData.acrivBulletLimit;

    this.bulletColor = playerData.bulletColor;
    this.bulletSpeed = playerData.bulletSpeed;
    this.bulletSize = playerData.bulletSize;

    this.playerCompleatedWaves = {
      one: false,
      two: false,
      three: false,
      four: false,
      five: false,
    };
    this.score = 0;
    this.kills = 0;
  }

  playerShoot() {
    this.currentTime = this.startTime;

    let BulletStats = {
      color: this.bulletColor,
      size: {
        width: this.bulletSize,
        height: this.bulletSize,
      },
      speed: this.bulletSpeed,
      x: null,
      y: null,
      direction: {
        x: 1,
        y: 0,
      },
      player: this,
    };

    if (
      this.playerControll.shotingKey.Space &&
      GameList.getBulletObjectList().length < this.acrivBulletLimit
    ) {
      if (this.isMoving()) {
        BulletStats.direction = Object.assign({}, this.movement.direction);
      } else {
        BulletStats.direction = Object.assign(
          {},
          this.movement.shootingDirection
        );
      }

      BulletStats.x =
        this.postion.x + this.stats.size.width / 2 - BulletStats.size.width / 2;
      BulletStats.y =
        this.postion.y +
        this.stats.size.height / 2 -
        BulletStats.size.height / 2;

      const bullet = new Bullet(BulletStats);

      GameList.addBulletObject(bullet);
    }
  }

  setDirection() {
    if (this.isMoving()) {
      this.shootingDirection = Object.assign({}, this.movement.direction);
    }

    this.movement.direction = {
      x:
        this.playerControll.arrowKeys.ArrowRight -
        this.playerControll.arrowKeys.ArrowLeft,

      y:
        this.playerControll.arrowKeys.ArrowDown -
        this.playerControll.arrowKeys.ArrowUp,
    };
  }

  move() {
    this.setDirection();
    let speedX;
    let speedY;

    if (this.movement.direction.x === this.movement.direction.y) {
      speedX = this.movement.speed.x / Math.SQRT2;
      speedY = this.movement.speed.y / Math.SQRT2;
    } else {
      speedX = this.movement.speed.x;
      speedY = this.movement.speed.y;
    }

    this.postion.x += Math.round(this.movement.direction.x * speedX);
    this.postion.y += Math.round(this.movement.direction.y * speedY);
  }

  update() {
    this.move();
    Collistion.CheckCanvasBounds(this, DrawingClass.canvas);
    this.checkCollitionWithOtherObjects();
  }

  checkCollitionWithOtherObjects() {
    GameList.monsterObjectList.forEach((monster) => {
      if (Collistion.ObjectTouching(this, monster) && !monster.dealtDamage) {
        this.stats.health -= 1;
        monster.dealtDamage = true;
      }
      if (monster.dealtDamage) {
        GameList.removeMonsterObject(monster);
      }
    });
  }

  isMoving() {
    return !(
      this.movement.direction.x === 0 && this.movement.direction.y === 0
    );
  }

  middelPos() {
    return {
      x: this.postion.x + this.stats.size.width / 2,
      y: this.postion.y + this.stats.size.height / 2,
    };
  }
}

// #region CLASS BULLET

class Bullet {
  constructor(bulletStats) {
    this.stats = {
      color: bulletStats.color,
      size: {
        width: bulletStats.size.width,
        height: bulletStats.size.height,
      },
      speed: bulletStats.speed,
      player: bulletStats.player,
    };
    this.objectHit = false;
    this.movement = {
      direction: bulletStats.direction,
    };

    this.postion = {
      x: bulletStats.x,
      y: bulletStats.y,
    };
  }

  move() {
    this.postion.x += this.movement.direction.x * this.stats.speed;
    this.postion.y += this.movement.direction.y * this.stats.speed;
  }

  handleCollisionWithOtherObjects() {
    if (Collistion.CheckCanvasBounds(this, DrawingClass.canvas))
      GameList.removeBulletObject(this);

    for (let i = 0; i < GameList.monsterObjectList.length; i++) {
      if ((Collistion.ObjectTouching(GameList.monsterObjectList[i]), this)) {
        this.objectHit = true;
        GameList.playerObjectList[0].score +=
          GameList.monsterObjectList[i].stats.scoreWorth;

        console.log("hit", GameList.playerObjectList[0].score);
      }
      if (this.objectHit) {
        GameList.removeMonsterObject(GameList.monsterObjectList[i]);
      }

      break;
    }
  }

  update() {
    this.move();
    this.handleCollisionWithOtherObjects();
  }
  draw(ctx) {
    ctx.fillStyle = "green";

    ctx.fillRect(
      this.postion.x,
      this.postion.y,
      this.stats.size.width,
      this.stats.size.height
    );
  }
}

//#region MonsterWave Class

export class MonsterWave {
  static typeOfMonster = [
    {
      type: "normal",
      monsterStats: {
        type: "normal",
        speed: 1,
        scoreWorth: 1,
        color: "red",
        size: {
          width: 3,
          height: 3,
        },
      },
    },
  ];
  static currentMonster = MonsterWave.typeOfMonster[0];
  static spawnRate = MonsterWave.currentMonster.spawnRate;
  static amoutOfSpawning = 0;

  static getMonsterPos(type) {
    let x, y;
    let side = Math.floor(Math.random() * 4);

    if (type == "boss") {
      x = DrawingClass.canvas.width / 2 - 7.5;
      y = DrawingClass.canvas.height / 2 - 7.5;
    }

    switch (side) {
      case 0:
        x = 0;
        y = Math.floor(Math.random() * DrawingClass.canvas.height);
        break;
      case 1:
        x =
          DrawingClass.canvas.width -
          MonsterWave.currentMonster.monsterStats.size.width;
        y = Math.floor(Math.random() * DrawingClass.canvas.height);
        break;
      case 2:
        x = Math.floor(Math.random() * DrawingClass.canvas.width);
        y = 0;
        break;
      case 3:
        x = Math.floor(Math.random() * DrawingClass.canvas.width);
        y =
          DrawingClass.canvas.height -
          MonsterWave.currentMonster.monsterStats.size.height;
        break;
    }

    return [x, y];
  }

  static startSpawningOfMonsters() {
    setInterval(() => {
      // THE SPAWNING OF THE MONSTER

      let monsterStartX;
      let monsterStartY;
      let timer = 1000;

      while (timer > 0) {
        timer -= 1;
      }

      [monsterStartX, monsterStartY] = MonsterWave.getMonsterPos(
        MonsterWave.currentMonster.type
      );

      let monster = new Monster(MonsterWave.currentMonster.monsterStats);

      monster.postion = {
        x: monsterStartX,
        y: monsterStartY,
      };
      GameList.addMonsterObject(monster);
      MonsterWave.amoutOfSpawning++;
    }, 100);
  }
}
// #region CLASS MONSTER
class Monster extends GeneralObject {
  constructor(monsterStats) {
    super({
      speed: monsterStats.speed,
      color: monsterStats.color,
      size: {
        width: monsterStats.size.width,
        height: monsterStats.size.height,
      },
      postion: {
        x: monsterStats.xStart,
        y: monsterStats.yStart,
      },
    });

    this.stats.size = {
      width: monsterStats.size.width,
      height: monsterStats.size.height,
    };
    this.stats.typeMonster = monsterStats.type;
    this.stats.dealtDamage = false;

    this.stats.scoreWorth = monsterStats.scoreWorth;
    this.movement = {
      direction: {
        x: 0,
        y: 0,
      },
    };
  }

  update() {
    this.move();
  }

  move() {
    let angel;
    let monsterAngel = {
      x: 0,
      y: 0,
    };
    let playerPos = GameList.playerObjectList[0].middelPos();

    angel = Math.atan2(
      playerPos.y - this.postion.y - this.stats.size.height / 2,
      playerPos.x - this.postion.x - this.stats.size.width / 2
    );

    monsterAngel.x = Math.cos(angel);
    monsterAngel.y = Math.sin(angel);

    this.postion.x += Math.round(monsterAngel.x * this.stats.speed);
    this.postion.y += Math.round(monsterAngel.y * this.stats.speed);
  }
}

// #region  GameList

export class GameList {
  static playerObjectList = [];
  static monsterObjectList = [];
  static bulletsObjectList = [];

  static addPlayerObject(...objects) {
    for (const obj of objects) {
      if (!(obj instanceof Player)) continue;
      GameList.playerObjectList.push(obj);
    }
  }
  static addMonsterObject(...objects) {
    for (const obj of objects) {
      GameList.monsterObjectList.push(obj);
    }
  }

  static addBulletObject(object) {
    if (!(object instanceof Bullet)) return;
    GameList.bulletsObjectList.push(object);
  }

  static getPlayerObject() {
    return GameList.playerObjectList.find((player) => player instanceof Player);
  }
  static removeMonsterObject(object) {
    if (!(object instanceof Monster)) return;

    let MonsterIndex = GameList.monsterObjectList.findIndex(
      (monster) => monster === object
    );

    GameList.monsterObjectList.splice(MonsterIndex, 1);
  }

  static getBulletObjectList() {
    return GameList.bulletsObjectList;
  }

  static removeBulletObject(object) {
    if (!(object instanceof Bullet)) return;

    let BulletIndex = GameList.bulletsObjectList.findIndex(
      (bullet) => bullet === object
    );

    GameList.bulletsObjectList.splice(BulletIndex, 1);
  }

  static getObjectList() {
    return [].concat(
      GameList.bulletsObjectList,
      GameList.playerObjectList,
      GameList.monsterObjectList
    );
  }
}

// #region Drawing
export class DrawingClass {
  static drawingTool = null;
  static canvas = null;

  static draw(object) {
    if (this.drawingTool === null)
      return console.error("Drawing tool to use is not defined");

    if (
      !(
        object instanceof Player ||
        object instanceof Monster ||
        object instanceof Bullet
      )
    )
      return console.error(
        "Drawing tool can only draw Player, Monster or Bullet"
      );

    object.draw(this.drawingTool);
  }

  static clearCanvas() {
    this.drawingTool.clearRect(0, 0, canvas.width, canvas.height);
  }

  static setCanvas(canvas) {
    this.canvas = canvas;
  }

  static setDrawingTool() {
    this.drawingTool = this.canvas.getContext("2d");
  }
}

// #region Collistion
class Collistion {
  /**
   * This function checks if the object is out of bounds of the canvas
   * and if so, adjusts its position so that it stays within the canvas bounds.
   *
   * @param {Object} object - The object to check and adjust.
   * @param {Object} canvas - The canvas to check against.
   */

  static ObjectTouching(object1, object2) {
    if (!object1 || !object2) {
      return false;
    }
    const object1Bounds = {
      left: object1.postion.x,
      top: object1.postion.y,
      right: object1.postion.x + object1.stats.size.width,
      bottom: object1.postion.y + object1.stats.size.height,
    };

    const object2Bounds = {
      left: object2.postion.x,
      top: object2.postion.y,
      right: object2.postion.x + object2.stats.size.width,
      bottom: object2.postion.y + object2.stats.size.height,
    };

    return (
      object1Bounds.left < object2Bounds.right &&
      object1Bounds.right > object2Bounds.left &&
      object1Bounds.top < object2Bounds.bottom &&
      object1Bounds.bottom > object2Bounds.top
    );
  }

  static CheckCanvasBounds(object, canvas) {
    let bordersColided;
    // If the object is out of bounds on the y-axis (top), move it to the top   of the canvas
    if (object.postion.y < 0) {
      object.postion.y = 0;
      bordersColided = true;
    }
    // If the object is out of bounds on the x-axis (left), move it to the left of the canvas
    if (object.postion.x < 0) {
      object.postion.x = 0;
      bordersColided = true;
    }
    // If the object is out of bounds on the y-axis (bottom), move it to the bottom of the canvas
    if (object.postion.y + object.stats.size.height > canvas.height) {
      object.postion.y = canvas.height - object.stats.size.height;
      bordersColided = true;
    }
    // If the object is out of bounds on the x-axis (right), move it to the right of the canvas
    if (object.postion.x + object.stats.size.width > canvas.width) {
      object.postion.x = canvas.width - object.stats.size.width;
      bordersColided = true;
    }

    return bordersColided;
  }
}
