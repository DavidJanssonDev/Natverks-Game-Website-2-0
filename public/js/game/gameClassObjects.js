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
    let xDirection = this.movementData.keys.right - this.movementData.keys.left;
    let yDirection = this.movementData.keys.down - this.movementData.keys.up;

    let momentSpeedX = xDirection * this.movementData.xSpeed;
    let momentSpeedY = yDirection * this.movementData.ySpeed;

    // Stop the player from going off the screen on the x - axis
    if (this.movementData.x <= 0 && this.movementData.keys.left) {
      momentSpeedX = 0;
    }

    // Stop the player from going off the screen on the x + axis
    if (
      this.movementData.x + this.statsData.size.width >=
        DrawingClass.canvas.width &&
      this.movementData.keys.right
    ) {
      momentSpeedX = 0;
    }

    // Stop the player from going off the screen on the y - axis
    if (this.movementData.y <= 0 && this.movementData.keys.up) {
      momentSpeedY = 0;
    }

    // Stop the player from going off the screen on the y + axis

    if (
      this.movementData.y + this.statsData.size.height >=
        DrawingClass.canvas.height &&
      this.movementData.keys.down
    ) {
      momentSpeedY = 0;
    }

    if (Math.abs(xDirection) && Math.abs(yDirection)) {
      momentSpeedX = (xDirection * this.movementData.xSpeed) / 1.414;
      momentSpeedY = (yDirection * this.movementData.ySpeed) / 1.414;
    }

    this.movementData.x += momentSpeedX;
    this.movementData.y += momentSpeedY;
  }

  update() {
    // let [touchingXBorder, touchingYBorder] = Collistion.objectInCanvas(this);

    this.movementData.keys.right -
      this.movementData.keys.left * this.movementData.xSpeed;

    // Om spelaren är i väggen och håller i väggens rikings key = 0 speed
    // Om spelaren är i väggen och håller inte i väggens riktins key = speed
    //
    //

    // this.movementData.ySpeed = !touchingYBorder * this.statsData.speed;

    this.move();
  }

  /*


  (CanvasXEnd om den rör Spelare && SpelareInputVänster) 
  (CanvasXStart om den rör Spelare  SpelareInputHöger) 
  (CanvasYStart om den rör Spelare && SpelareInputBak) 
  (CanvasXEnd om den rör Spelare && SpelareInputUp)


  dirY = this.movementData.keys.down - this.movementData.keys.up
  dirX = this.movementData.keys.right - this.movementData.keys.left
  this.movementData.xSpeed = (
    *   (this.movementData.x - this.statsData.size.width / 2 < 0 )
        || 
    *   (this.movementData.x + this.statsData.size.width / 2 > canvas.width)
    ) * this.statsData.speed
  this.movementData.ySpeed = !sideY * this.statsData.speed


        |
  - / - |   +/-
        |
        |
--------|--------
        |
        |
  -/+- -|  +\+
        |
        |


  XDir = this.movementData.keys.right - this.movementData.keys.left | 1 - 0 - -1
  YDir = this.movementData.keys.down - this.movementData.keys.up    | 1 - 0 - -1
  
  */
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

    console.table(drawingInfo);

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

class Collistion {
  static objectInCanvas(object) {
    if (object.movementData) {
    }
  }

  static checkCollisionBetweenObjects(object1, object2) {
    const area1 = {
      x: object1.movementData.x - object1.statsData.size.width / 2,
      y: object1.movementData.y - object1.statsData.size.height / 2,
      width: object1.statsData.size.width,
      height: object1.statsData.size.height,
      rightEdge: object1.movementData.x + object1.statsData.size.width / 2,
      bottomEdge: object1.movementData.y + object1.statsData.size.height / 2,
    };

    const area2 = {
      x: object2.movementData.x - object2.statsData.size.width / 2,
      y: object2.movementData.y - object2.statsData.size.height / 2,
      width: object2.statsData.size.width,
      height: object2.statsData.size.height,
      rightEdge: object2.movementData.x + object2.statsData.size.width / 2,
      bottomEdge: object2.movementData.y + object2.statsData.size.height / 2,
    };

    return (
      area1.rightEdge > area2.x &&
      area1.x < area2.rightEdge &&
      area1.bottomEdge > area2.y &&
      area1.y < area2.bottomEdge
    );
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
