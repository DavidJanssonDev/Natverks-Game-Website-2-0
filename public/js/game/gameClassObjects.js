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
      direction: {
        x: null,
        y: null,
      },
      startPosOffset: 5,
      color: "yellow",
    };
  }

  move() {
    let dirXAxis =
      (this.movementData.keys.KeyRight || this.movementData.keys.RightArrow) -
      (this.movementData.keys.KeyLeft || this.movementData.keys.LeftArrow);

    let dirYAxis =
      (this.movementData.keys.KeyDown || this.movementData.keys.DownArrow) -
      (this.movementData.keys.KeyUp || this.movementData.keys.UpArrow);

    this.movementData.x += dirXAxis * this.movementData.xSpeed;
    this.movementData.y += dirYAxis * this.movementData.ySpeed;
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
      x: this.movementData.x + this.bulletData.startPosOffset,
      y: this.movementData.y + this.bulletData.startPosOffset,
      xDirection: this.bulletData.direction.x,
      yDirection: this.bulletData.direction.y,
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
      xDirection: bulletStats.xDirection,
      yDirection: bulletStats.yDirection,
    };
    this.bulletSize = {
      width: bulletStats.size,
      height: bulletStats.size,
    };
    this.x = bulletStats.x;
    this.y = bulletStats.y;

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
