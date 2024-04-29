// #region PLAYER CLASS

export class Player {
  constructor(playerData) {
    this.statsData = {
      health: playerData.Health,
      damage: playerData.Damage,
      speed: playerData.Speed,
      size: {
        width: playerData.width,
        height: playerData.height,
      },
      characterColor: playerData.playerColor,
    };

    this.postion = {
      x: playerData.startXPos,
      y: playerData.startYPos,
    };

    this.playerMovement = {
      speed: {
        x: playerData.Speed,
        y: playerData.Speed,
      },

      direction: {
        x: 0,
        y: 0,
      },
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
  }

  setDirection() {
    this.playerMovement.direction.x =
      (this.playerControll.keys.KeyD ||
        this.playerControll.arrowKeys.ArrowRight) -
      (this.playerControll.keys.KeyA ||
        this.playerControll.arrowKeys.ArrowLeft);

    this.playerMovement.direction.y =
      (this.playerControll.keys.KeyS ||
        this.playerControll.arrowKeys.ArrowDown) -
      (this.playerControll.keys.KeyW || this.playerControll.arrowKeys.ArrowUp);
  }

  move() {
    this.setDirection();
    this.postion.x +=
      this.playerMovement.direction.x * this.playerMovement.speed.x;
    this.postion.y +=
      this.playerMovement.direction.y * this.playerMovement.speed.y;
  }

  update() {
    this.move();
    Collistion.CheckCanvasBounds(this, DrawingClass.canvas);
  }

  draw(ctx) {
    const drawingInfo = {
      x: this.postion.x,
      y: this.postion.y,
      width: this.statsData.size.width,
      height: this.statsData.size.height,
    };

    ctx.fillStyle = this.statsData.characterColor;

    // console.table(drawingInfo);

    ctx.fillRect(
      drawingInfo.x,
      drawingInfo.y,
      drawingInfo.width,
      drawingInfo.height
    );
  }
}

// #region CLASS BULLET

class Bullet {
  constructor(bulletStats) {
    this.bulletDirection = {
      xDirection: bulletStats.bulletDirection.xDir,
      yDirection: bulletStats.bulletDirection.yDir,
    };
    this.bulletSize = {
      width: bulletStats.size,
      height: bulletStats.size,
    };
    this.x = bulletStats.bulletPos.x;
    this.y = bulletStats.bulletPos.y;

    this.xSpeed = bulletStats.speed;
    this.ySpeed = bulletStats.speed;

    this.bulletDamage = bulletStats.damage;

    this.bulletSize = bulletStats.size;
    this.bulletColor = bulletStats.color;
  }

  move() {
    this.x += this.bulletDirection.xDirection * this.xSpeed;
    this.y += this.bulletDirection.yDirection * this.ySpeed;
  }

  handleCollisionWithOtherObjects() {
    const objectList = GameList.objectList;

    for (const object of objectList) {
      if (!(object in GameList.monsterObjectList)) continue;
      if (object instanceof Player) continue;
      if (!Collistion.checkCollision(this, object)) continue;

      object.statsData.health -= this.bulletDamage;
      GameList.removeBulletObject(this);
    }
  }

  update() {
    this.move();
    this.handleCollisionWithOtherObjects();
  }
  draw(ctx) {
    ctx.fillStyle = this.bulletColor;
    ctx.fillRect(this.x, this.y, this.bulletSize.width, this.bulletSize.height);
  }
}

class Monster {
  constructor(monsterStats) {
    this.monsterStats = monsterStats;
  }

  update() {}

  draw(ctx) {}
}

// #region  GameList

export class GameList {
  static objectList = [];
  static playerObjectList = [];
  static monsterObjectList = [];
  static bulletsObjectList = [];

  static addPlayerObject(...objects) {
    for (const object of objects) {
      if (!(object instanceof Player)) continue;
      GameList.playerObjectList.push(object);
    }
  }
  static addMonsterObject(object) {
    if (object instanceof Monster) return;
    GameList.monsterObjectList.push(object);
  }

  static getPlayerObjectList() {
    return GameList.playerObjectList.find((player) => player instanceof Player);
  }
  static removeMonsterObject(object) {
    if (!(object instanceof Monster)) return;
    if (!(20 < GameList.monsterObjectList.Count > 0)) return;
    GameList.monsterObjectList.filter((monster) => monster !== object);
  }

  static addBulletObject(object) {
    if (!(object instanceof Bullet)) return;
    GameList.bulletsObjectList.push(object);
  }

  static getBulletObjectList() {
    return GameList.bulletsObjectList;
  }

  static removeBulletObject(object) {
    if (!(object instanceof Bullet)) return;
    if (!(20 < GameList.bulletsObjectList.Count > 0)) return;
    GameList.bulletsObjectList.filter((bullet) => bullet !== object);
  }

  static combindAllListTooObjectList() {
    GameList.objectList = [].concat(
      GameList.playerObjectList,
      GameList.bulletsObjectList,
      GameList.monsterObjectList
    );
  }

  static getObjectList() {
    GameList.combindAllListTooObjectList();
    return GameList.objectList;
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
  static CheckCanvasBounds(object, canvas) {
    // If the object is out of bounds on the y-axis (top), move it to the top of the canvas
    if (object.postion.y < 0) {
      console.log("top");
      object.postion.y = 0;
    }
    // If the object is out of bounds on the y-axis (bottom), move it to the bottom of the canvas
    if (object.postion.y + object.statsData.height > canvas.height) {
      console.log("bottom");
      object.postion.y = canvas.height - object.statsData.height;
    }
    // If the object is out of bounds on the x-axis (left), move it to the left of the canvas
    if (object.postion.x < 0) {
      console.log("left");
      object.postion.x = 0;
    }
    // If the object is out of bounds on the x-axis (right), move it to the right of the canvas
    if (object.postion.x + object.statsData.width > canvas.width) {
      console.log("right");
      object.postion.x = canvas.width - object.statsData.width;
    }
    console.log(
      "Tuching right: ",
      object.postion.x + object.statsData.width > canvas.width
    );
  }
}
