export class Player {
  constructor(playerData) {
    this.x = playerData.startXPos;
    this.y = playerData.startYPos;

    this.playerSize = {
      width: playerData.width,
      height: playerData.height,
    };

    this.xSpeed = playerData.Speed;
    this.ySpeed = playerData.Speed;
    this.playerDirection = {
      x: 0,
      y: 0,
    };

    this.hp = playerData.Health;
    this.damage = playerData.Damage;

    this.projectalSpeed = playerData.projectalSpeed;
    this.projectalSize = playerData.projectalSize;
    this.bulletSpawnOffset = 5;

    this.playerColor = playerData.playerColor;
  }

  draw(ctx) {
    ctx.fillStyle = this.playerColor;
    ctx.fillRect(
      this.x - this.playerSize.width / 2,
      this.y - this.playerSize.height / 2,
      this.playerSize.width,
      this.playerSize.height
    );
  }

  shoot(GameObjectList) {
    const bulletData = {
      xDirection: this.playerDirection.x,
      yDirection: this.playerDirection.y,
      x:
        this.x +
        this.playerSize.width / 2 +
        this.playerDirection.x * this.bulletSpawnOffset,
      y:
        this.y +
        this.playerSize.height / 2 +
        this.playerDirection.y * this.bulletSpawnOffset,
      speed: this.projectalSpeed,
      damage: this.damage,
      size: this.projectalSize,
      color: "black",
    };

    const bullet = new Bullet(bulletData);
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

  update() {}

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

  static setPlayerObjectList(object) {
    if (!(object instanceof Player)) return;
    GameList.playerObjectList.push(object);
  }
  static addMonsterObject(object) {
    if (object instanceof Monster) return;
    GameList.monsterObjectList.push(object);
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

  static objectList() {
    GameList.objectList = [].concat(
      GameList.playerObjectList,
      GameList.monsterObjectList,
      GameList.bulletsObjectList
    );
  }

  static get objectList() {
    GameList.objectList();
    return GameList.objectList;
  }
}
