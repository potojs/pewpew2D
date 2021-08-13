import { Player } from "../player";
import { IMap, clamp, IWall } from "../utils";
import { Dimensions, Vector, IVector } from "../utils";
import Bullet, { IBulletData, IBulletStats } from "./bullet";

export default class extends Bullet {
  constructor(
    public pos: Vector,
    public angle: number,
    public size: number,
    public damage: number,
    public explosionRange: number,
    public speed: number,
    public accuracy: number,
    public maxDist: number,
    public doesBounce: boolean,
    public team: "red" | "blue"
  ) {
    super(pos, angle, size, damage, speed, accuracy, maxDist, doesBounce, team);
    this.bulletType = "grenade";
  }
  update(map: IMap, players: Player[], map_dimensions: Dimensions, deltaTime: number) {
    const playerHit = super.update(map, players, map_dimensions, deltaTime);
    if(this.ended) {
        for (let i = 0; i < players.length; i++) {
            if(!players[i].dead && players[i].team !== this.team) {
                const dist = Math.sqrt(
                    (this.pos.x - players[i].pos.x) ** 2 +
                    (this.pos.y - players[i].pos.y) ** 2
                );
                if (playerHit !== players[i] && dist <
                    this.explosionRange + players[i].size - players[i].collisionThreshold) {
                    players[i].health -= this.damage;
                    console.log("ded2")
                }
            }
        }   
    }
  }
  getBulletStats(): IBulletStats {
    return {
      ...super.getBulletStats(),
      explosionRange: this.explosionRange + " pixels"
    }
  }
  getData(): IBulletData {
    return {
      pos: { x: this.pos.x, y: this.pos.y },
      bulletSize: this.size,
      team: this.team,
      explosionRange: this.explosionRange,
    };
  }
}
