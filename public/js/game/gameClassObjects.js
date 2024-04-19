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

    this.movementData = {
      x: playerData.startXPos,
      y: playerData.startYPos,
      maximumAmoutOfBulletsToRender: 10,
      xSpeed: this.statsData.speed,
      ySpeed: this.statsData.speed,
      keys: {
        // WASD MOVEMENT KEYS
        KeyUp: false,
        KeyDown: false,
        KeyLeft: false,
        KeyRight: false,
        // ARROW MOVEMENT KEYS
        RightArrow: false,
        LeftArrow: false,
        UpArrow: false,
        DownArrow: false,
        // SHOOTING KEY
        Space: false,
        MouseRightBtn: false,
      },

      KeysPressed: 0,

      direction: {
        xDir: null,
        yDir: null,
        latestDirection: {
          xDir: 1,
          yDir: 0,
        },
      },
    };

    this.bulletData = {
      x: null,
      y: null,
      damage: this.statsData.damage,
      speed: playerData.projectalSpeed,
      size: {
        width: playerData.projectalSize,
        height: playerData.projectalSize,
      },
      startPosOffset: 5,
      color: "yellow",
    };
  }

  setDirection() {
    this.movementData.direction.xDir =
      (this.movementData.keys.KeyRight || this.movementData.keys.RightArrow) -
      (this.movementData.keys.KeyLeft || this.movementData.keys.LeftArrow);

    this.movementData.direction.yDir =
      (this.movementData.keys.KeyDown || this.movementData.keys.DownArrow) -
      (this.movementData.keys.KeyUp || this.movementData.keys.UpArrow);

    if (this.movementData.KeysPressed > 0) {
      this.movementData.direction.latestDirection.xDir =
        this.movementData.direction.xDir;
      this.movementData.direction.latestDirection.yDir =
        this.movementData.direction.yDir;
    }
  }

  move() {
    this.setDirection();
    this.movementData.x +=
      this.movementData.direction.xDir * this.movementData.xSpeed;
    this.movementData.y +=
      this.movementData.direction.yDir * this.movementData.ySpeed;
  }

  update() {
    this.move();
    Collistion.CheckCanvasBounds(this, DrawingClass.canvas);
  }

  draw(ctx) {
    const drawingInfo = {
      x: this.movementData.x,
      y: this.movementData.y,
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

  shoot() {
    const bulletPositionData = {
      bulletPos: {
        x:
          this.movementData.x +
          this.movementData.direction.latestDirection.xDir *
            this.bulletData.startPosOffset +
          this.statsData.size.width / 2,
        y:
          this.movementData.y +
          this.movementData.direction.latestDirection.yDir *
            this.bulletData.startPosOffset +
          this.statsData.size.height / 2,
      },
      bulletDirection: {
        xDir: this.movementData.direction.latestDirection.xDir,
        yDir: this.movementData.direction.latestDirection.yDir,
      },
      damage: this.bulletData.damage,
      speed: this.bulletData.speed,
      size: this.bulletData.size,
      color: this.bulletData.color,
    };
    const bullet = new Bullet({ ...this.bulletData, ...bulletPositionData });
    GameList.addBulletObject(bullet);
  }
}

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
      GameList.monsterObjectList,
      GameList.bulletsObjectList
    );
  }

  static getObjectList() {
    GameList.combindAllListTooObjectList();
    return GameList.objectList;
  }
}

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
    if (object.movementData.y < 0) {
      object.movementData.y = 0;
    }
    // If the object is out of bounds on the y-axis (bottom), move it to the bottom of the canvas
    if (object.movementData.y + object.statsData.height > canvas.height) {
      object.movementData.y = canvas.height - object.statsData.height;
    }
    // If the object is out of bounds on the x-axis (left), move it to the left of the canvas
    if (object.movementData.x < 0) {
      object.movementData.x = 0;
    }
    // If the object is out of bounds on the x-axis (right), move it to the right of the canvas
    if (object.movementData.x + object.statsData.width > canvas.width) {
      object.movementData.x = canvas.width - object.statsData.width;
    }
  }
}
