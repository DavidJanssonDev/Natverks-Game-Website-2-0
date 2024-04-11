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
      direction: {
        x: 0,
        y: 0,
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
        x: this.movementData.direction.x,
        y: this.movementData.direction.y,
      },
      startPosOffset: 5,
    };
  }

  move() {
    this.movementData.x +=
      this.movementData.direction.x * this.movementData.xSpeed;
    this.movementData.y +=
      this.movementData.direction.y * this.movementData.ySpeed;
  }

  update() {
    console.log(this, "player update");
    this.move();
  }

  draw(ctx) {
    ctx.fillStyle = this.statsData.characterColor;
    console.table({
      x: this.movementData.x - this.statsData.size.width / 2,
      y: this.movementData.y - this.statsData.size.height / 2,
      width: this.statsData.size.width,
      height: this.statsData.size.height,
    });

    ctx.fillRect(
      this.movementData.x - this.statsData.size.width / 2,
      this.movementData.y - this.statsData.size.height / 2,
      this.statsData.size.width,
      this.statsData.size.height
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
  static checkCollision(object1, object2) {
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

    console.log("DRAWING");
    object.draw(this.drawingTool);
    console.log("DRAWING DONE");
  }

  static setDrawingTool(drawingTool) {
    this.drawingTool = drawingTool;
  }
}
