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
      characterColor: playerData.characterColor,
    };

    this.movementData = {
      x: playerData.startXPos,
      y: playerData.startYPos,
      xSpeed: this.statsData.speed,
      ySpeed: this.statsData.speed,
      keys: {
        up: false,
        down: false,
        left: false,
        right: false,
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
    };
  }

  move() {
    Collistion.objectIsInCanvas(this, DrawingClass.canvas);

    let dirXAxis = this.movementData.keys.right - this.movementData.keys.left;
    let dirYAxis = this.movementData.keys.down - this.movementData.keys.up;

    this.movementData.x += dirXAxis * this.movementData.xSpeed;
    this.movementData.y += dirYAxis * this.movementData.ySpeed;

    //   let xDirection = this.movementData.keys.right - this.movementData.keys.left;
    //   let yDirection = this.movementData.keys.down - this.movementData.keys.up;

    //   let momentSpeedX = xDirection * this.movementData.xSpeed;
    //   let momentSpeedY = yDirection * this.movementData.ySpeed;

    //   this.movementData.x += momentSpeedX;
    //   this.movementData.y += momentSpeedY;
  }

  update() {
    this.move();
  }

  draw(ctx) {
    const drawingInfo = {
      x: this.movementData.x,
      y: this.movementData.y,
      width: this.statsData.size.width,
      height: this.statsData.size.height,
      direction_x: this.movementData.keys.right - this.movementData.keys.left,
      direction_y: this.movementData.keys.down - this.movementData.keys.up,
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

  shoot(GameObjectList) {
    const bulletPositionData = {
      x:
        this.movementData.x +
        this.movementData.direction.x *
          (this.statsData.width / 2 + this.bulletData.startPosOffset),
      y:
        this.movementData.y +
        this.movementData.direction.y *
          (this.statsData.height / 2 + this.bulletData.startPosOffset),
    };

    const bullet = new Bullet({ ...this.bulletData, ...bulletPositionData });
    GameObjectList.addBulletObject(bullet);
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
    const objectList = GameList.objectList();

    for (const object of objectList) {
      if (object instanceof Player) continue;
      if (!Collistion.checkCollision(this, object)) continue;

      if (!(object instanceof Monster && object in GameList.monsterObjectList))
        continue;

      object.statsData.health -= this.bulletDamage;
      GameList.removeBulletObject(this);
    }
  }

  update() {
    this.move();
    this.hit();
  }
  draw(ctx) {
    ctx.fillStyle = this.bulletColor;
    ctx.fillRect(
      this.x - this.bulletSize / 2,
      this.y - this.bulletSize / 2,
      this.bulletSize.width,
      this.bulletSize.height
    );
  }
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
  static objectIsInCanvas(object, canvas) {
    let isObjectInPosCanvasYAxis = object.movementData.y < 0;
    let isObjectInNegCanvasYAxis =
      object.movementData.y + object.statsData.height > canvas.height;

    let isObjectInPosCanvasXAxis = object.movementData.x < 0;
    let isObjectInNegCanvasXAxis =
      object.movementData.x + object.statsData.width > canvas.width;

    if (isObjectInPosCanvasYAxis) {
      object.movementData.y = 0;
    } else if (isObjectInNegCanvasYAxis) {
      object.movementData.y = canvas.height - object.statsData.height;
    } else if (isObjectInPosCanvasXAxis) {
      object.movementData.x = 0;
    } else if (isObjectInNegCanvasXAxis) {
      object.movementData.x = canvas.width - object.statsData.width;
    }
    // else if (isObjectInNegCanvasXAxis && isObjectInNegCanvasYAxis) {
    //   object.movementData.x = canvas.width - object.statsData.width;
    //   object.movementData.y = canvas.height - object.statsData.height;
    // } else if (isObjectInNegCanvasXAxis && isObjectInPosCanvasYAxis) {
    //   object.movementData.x = canvas.width - object.statsData.width;
    //   object.movementData.y = 0;
    // } else if (isObjectInPosCanvasXAxis && isObjectInNegCanvasYAxis) {
    //   object.movementData.x = 0;
    //   object.movementData.y = canvas.height - object.statsData.height;
    // } else if (isObjectInPosCanvasXAxis && isObjectInPosCanvasYAxis) {
    //   object.movementData.x = 0;
    //   object.movementData.y = 0;
    // }
  }
}
