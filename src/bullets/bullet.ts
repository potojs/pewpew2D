import { Player } from "../player";
import { IMap, clamp, IWall } from "../utils";
import { Dimensions, Vector, IVector } from "../utils";

class Bullet {
  vel: Vector;
  dist: number;
  ended: boolean;
  initialUpdate: boolean;
  bulletType: string;

  constructor(
    public pos: Vector,
    public angle: number,
    public size: number,
    public damage: number,
    public speed: number,
    public accuracyMistake: number,
    public maxDist: number,
    public doesBounce: boolean,
    public team: "red" | "blue"
  ) {
    this.bulletType = "bullet";
    this.initialUpdate = true;
    this.angle += Math.random() * accuracyMistake - accuracyMistake / 2;
    this.vel = new Vector(
      Math.cos(this.angle) * this.speed,
      Math.sin(this.angle) * this.speed
    );
    this.dist = 0;
    this.ended = false;
  }
  getBulletStats(): IBulletStats {
    return {
      damage: String(this.damage),
      bulletRange: this.maxDist + " pixel",
      bulletSpeed: this.speed + " pixels/tick",
      bulletSize: this.size + " pixel",
      accuracyMistake: `+/- ${this.accuracyMistake/2 / Math.PI * 180} degrees`,
      doesBulletBounce: String(this.doesBounce),
      bulletType: this.bulletType
    }
  }
  getData(): IBulletData {
    return {
      pos: { x: this.pos.x, y: this.pos.y },
      bulletSize: this.size,
      team: this.team,
    };
  }
  private boundries(map_dimensions: Dimensions) {
    let didBounce: boolean = false;
    if (this.pos.x <= this.size) {
      this.vel.x *= -1;
      this.pos.x = this.size + 1;
      didBounce = true;
    }
    if (this.pos.x >= map_dimensions.w - this.size) {
      this.vel.x *= -1;
      this.pos.x = map_dimensions.w - this.size - 1;
      didBounce = true;
    }
    if (this.pos.y <= this.size) {
      this.vel.y *= -1;
      this.pos.y = this.size + 1;
      didBounce = true;
    }
    if (this.pos.y >= map_dimensions.h - this.size) {
      this.vel.y *= -1;
      this.pos.y = map_dimensions.h - this.size - 1;
      didBounce = true;
    }
    if(didBounce && !this.doesBounce){
      this.end();
    }
  }
  isCollidingWith(wall: IWall): boolean {
    const wCenterX = wall.x + wall.w / 2;
    const wCenterY = wall.y + wall.h / 2;

    const closestPoint = {
      x: clamp(this.pos.x - wCenterX, -wall.w / 2, wall.w / 2) + wCenterX,
      y: clamp(this.pos.y - wCenterY, -wall.h / 2, wall.h / 2) + wCenterY,
    };
    const dist = Math.sqrt(
      (closestPoint.x - this.pos.x) ** 2 + (closestPoint.y - this.pos.y) ** 2
    );
    return this.size >= dist;
  }
  normToClosestSuface(wall: IWall): Vector {
    const distToLeftSuf = Math.abs(this.pos.x - wall.x);
    const distToRightSuf = Math.abs(this.pos.x - (wall.x + wall.w));
    const distToUpSuf = Math.abs(this.pos.y - wall.y);
    const distToDownSuf = Math.abs(this.pos.y - (wall.y + wall.h));
    const closest = Math.min(
      distToLeftSuf,
      distToRightSuf,
      distToUpSuf,
      distToDownSuf
    );
    switch (closest) {
      case distToLeftSuf:
        return new Vector(-1, 0);
      case distToRightSuf:
        return new Vector(1, 0);
      case distToUpSuf:
        return new Vector(0, -1);
      case distToDownSuf:
        return new Vector(0, 1);
    }
    return new Vector(0, 0);
  }
  getOutOf(wall: IWall) {
    const normVec = this.normToClosestSuface(wall);
    while (this.isCollidingWith(wall)) {
      this.pos.add(normVec);
    }
  }
  collide(wall: IWall, normVec: Vector, deltaTime: number) {
    for (let i = 0; i < (this.speed * deltaTime)+2; i++) {
      if (this.isCollidingWith(wall)) {
        if(!this.doesBounce){
          this.end();
        }
        this.pos.x -= normVec.x / Math.abs(normVec.x) || 0;
        this.pos.y -= normVec.y / Math.abs(normVec.y) || 0;
      } else {
        if (i !== 0) {
          this.vel.x *= -normVec.x / normVec.x || 1;
          this.vel.y *= -normVec.y / normVec.y || 1;
        }
        return;
      }
    }
  }
  update(map: IMap, players: Player[], map_dimensions: Dimensions, deltaTime: number): Player | void  {
    if (!this.ended) {
      if (this.initialUpdate) {
        for (let i = 0; i < map.walls.length; i++) {
          this.getOutOf(map.walls[i]);
        }
      }
      this.dist += this.speed * deltaTime;

      this.pos.x += this.vel.x * deltaTime;
      for(let i=0;i<map.walls.length;i++) {
          this.collide(map.walls[i], new Vector(this.vel.x * deltaTime, 0), deltaTime);
      }

      this.pos.y += this.vel.y * deltaTime;
      for(let i=0;i<map.walls.length;i++) {
          this.collide(map.walls[i], new Vector(0, this.vel.y * deltaTime), deltaTime);
      }
      this.boundries(map_dimensions);
      for (let i = 0; i < players.length; i++) {
        if (!players[i].dead && players[i].team !== this.team &&
          Math.sqrt((this.pos.x - players[i].pos.x) ** 2 +(this.pos.y - players[i].pos.y) ** 2) <
          this.size + players[i].size - players[i].collisionThreshold) {
            players[i].health -= this.damage;
            this.end();
            return players[i];
        }
      }
      if (this.dist >= this.maxDist) {
        this.end();
      }
      this.initialUpdate = false;
    }
  }
  end() {
    this.ended = true;
  }
}
export interface IBulletData {
  pos: IVector;
  bulletSize: number;
  team: "red" | "blue";
  explosionRange?: number;
}
export interface IBulletStats {
  damage: string;
  bulletRange: string;
  bulletSpeed: string;
  bulletSize: string;
  accuracyMistake: string;
  doesBulletBounce: string;
  explosionRange?: string;
  bulletType: string;
}
export default Bullet;
