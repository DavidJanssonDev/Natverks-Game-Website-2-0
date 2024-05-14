// #region General Game Class Object
class GeneralObject {
  constructor(stats) {
    this.stats = {
      health: stats.health,
      damage: stats.damage,
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

    // console.table(drawingInfo);

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
      damage: playerData.Damage,
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
      // WASD MOVEMENT KEYS
      keys: {
        KeyW: false,
        KeyS: false,
        KeyA: false,
        KeyD: false,
      },
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
      damage: this.stats.damage,
      x: null,
      y: null,
      direction: {
        x: 1,
        y: 0,
      },
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
    console.log(GameList.bulletsObjectList);
  }

  setDirection() {
    if (this.isMoving()) {
      this.shootingDirection = Object.assign({}, this.movement.direction);
    }

    this.movement.direction.x =
      (this.playerControll.keys.KeyD ||
        this.playerControll.arrowKeys.ArrowRight) -
      (this.playerControll.keys.KeyA ||
        this.playerControll.arrowKeys.ArrowLeft);

    this.movement.direction.y =
      (this.playerControll.keys.KeyS ||
        this.playerControll.arrowKeys.ArrowDown) -
      (this.playerControll.keys.KeyW || this.playerControll.arrowKeys.ArrowUp);
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
    console.table(this.movement.speed);

    this.postion.x += this.movement.direction.x * speedX;
    this.postion.y += this.movement.direction.y * speedY;
  }

  update() {
    this.move();
    Collistion.CheckCanvasBounds(this, DrawingClass.canvas);
  }

  isMoving() {
    return !(
      this.movement.direction.x === 0 && this.movement.direction.y === 0
    );
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
      damage: bulletStats.damage,
      speed: bulletStats.speed,
    };

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
    console.log("bullet list", GameList.bulletsObjectList);
    GameList.bulletsObjectList.forEach((bulletObject) => {
      if (!Collistion.CheckCanvasBounds(bulletObject, DrawingClass.canvas)) {
        GameList.monsterObjectList.forEach((monsterObject) => {
          if (Collistion.ObjectOverlapping(monsterObject, this)) {
            GameList.removeMonsterObject(monsterObject);
            GameList.removeBulletObject(bulletObject);
            GameList.getPlayerObjectList()[0].score +=
              monsterObject.scorePoints;
            GameList.getPlayerObjectList()[0].kills += 1;
            return;
          }
        });
      }
      GameList.removeBulletObject(bulletObject);
      GameList.getPlayerObjectList()[0].score += monsterObject.scorePoints;
      GameList.getPlayerObjectList()[0].kills += 1;
      return;
    });
  }

  update() {
    this.move();
    this.handleCollisionWithOtherObjects();
  }
  draw(ctx) {
    ctx.fillStyle = this.stats.color;
    ctx.fillRect(
      this.postion.x,
      this.postion.y,
      this.stats.size.width,
      this.stats.size.height
    );
  }
}

// #region CLASS MONSTER

export class MonsterWave {
  static waveOnGoing = false;
  static currentWave = 0;

  static typeOfMonster = {
    normal: {
      type: "hard",
      monsterStats: {
        health: 10,
        damage: 1,
        speed: 1,
        scoreWorth: 1,
        color: "red",
        size: {
          width: 15,
          height: 15,
        },
      },
    },
    hard: {
      type: "hard",
      monsterStats: {
        health: 35,
        damage: 2,
        speed: 1.5,
        scoreWorth: 2,
        color: "blue",
        size: {
          width: 30,
          height: 30,
        },
      },
    },
    boss: {
      type: "boss",
      monsterStats: {
        health: 35,
        damage: 2,
        speed: 1.5,
        scoreWorth: 2,
        color: "green",
        size: {
          width: 30,
          height: 30,
        },
      },
    },
  };

  static waves = [
    {
      monster: {
        typeMonster: MonsterWave.typeOfMonster.normal.type,
        monsterData: MonsterWave.typeOfMonster.normal.monsterStats,
        timeBetweenMonster: 10,
        amoutPerSpawn: 5,
      },
    },
    {
      monster: {
        typeMonster: MonsterWave.typeOfMonster.hard.type,
        monsterData: MonsterWave.typeOfMonster.hard.monsterStats,
        timeBetweenMonster: 10,
        amoutPerSpawn: 5,
      },
    },
    {
      monster: {
        typeMonster: MonsterWave.typeOfMonster.boss.type,
        monsterData: MonsterWave.typeOfMonster.boss.monsterStats,
        timeBetweenMonster: 10,
        amoutPerSpawn: 5,
      },
    },
  ];

  static updateWave() {
    if (GameList.monsterObjectList.length === 0) {
      switch (MonsterWave.currentWave) {
        case 0:
          MonsterWave.currentWave = 1;
          break;
        case 1:
          MonsterWave.currentWave = 2;
          break;
        case 2:
          MonsterWave.currentWave = 3;
          break;
        case 3:
          console.log("GAME IS ALL DONE U WON");
          break;
      }
    }
  }

  static spawnWave(wave) {
    MonsterWave.waveOnGoing = true;
    console.table(MonsterWave.waves);
    let waveindex = wave - 1;
    let waveData = MonsterWave.waves[waveindex];
    console.table(waveData);
    debugger;
    let dataStats = waveData.monsterData;

    if (waveData.typeMonster === "boss") {
      GameList.addMonsterObject(new Boss(dataStats));
    } else {
      for (
        let numberMonster = 0;
        numberMonster < monsterData.amoutPerSpawn;
        numberMonster++
      ) {
        GameList.addMonsterObject(new Monster(dataStats));
      }
    }
  }
}

class Monster extends GeneralObject {
  constructor(monsterStats) {
    super({
      health: monsterStats.health,
      damage: monsterStats.damage,
      speed: monsterStats.speed,
      color: monsterStats.color,
      size: {
        width: monsterStats.size.width,
        height: monsterStats.size.height,
      },
    });
    this.stats = {
      size: {
        width: monsterStats.size.width,
        height: monsterStats.size.height,
      },
    };

    this.movement = {
      direction: {
        x: 0,
        y: 0,
      },
    };
  }

  update() {}
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
      if (obj instanceof Monster) return;
      GameList.monsterObjectList.push(obj);
    }
  }

  static addBulletObject(object) {
    if (!(object instanceof Bullet)) return;
    GameList.bulletsObjectList.push(object);
  }

  static getPlayerObjectList() {
    return GameList.playerObjectList.find((player) => player instanceof Player);
  }
  static removeMonsterObject(object) {
    if (!(object instanceof Monster)) return;
    GameList.monsterObjectList.filter((monster) => monster !== object);
  }

  static getBulletObjectList() {
    return GameList.bulletsObjectList;
  }

  static removeBulletObject(object) {
    if (!(object instanceof Bullet)) return;

    console.log("bullet list", GameList.bulletsObjectList);
    let BulletIndex = GameList.bulletsObjectList.findIndex(
      (bullet) => bullet === object
    );

    GameList.bulletsObjectList.splice(BulletIndex, 1);
    console.log("bullet list", GameList.bulletsObjectList);
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

  static ObjectOverlapping(object1, object2) {
    let overlapping;

    // Check if the object1 left axis is overlapping with the object2
    if (object1.postion.x < object2.postion.x + object2.stats.size.width) {
      overlapping = true;
    }

    // Check if the object1 top axis is overlapping with the object2
    if (object1.postion.y < object2.postion.y + object2.stats.size.height) {
      overlapping = true;
    }

    // Check if the object1 right axis is overlapping with the object2
    if (object1.postion.x + object1.stats.size.width > object2.postion.x) {
      overlapping = true;
    }

    // Check if the object1 bottom axis is overlapping with the object2
    if (object1.postion.y + object1.stats.size.height > object2.postion.y) {
      overlapping = true;
    }

    return overlapping;
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
