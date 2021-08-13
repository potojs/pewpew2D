import Weapon from "./weapon";
import BulletManager, { EBullet } from "../bullets/bulletManager";
import { Vector, map } from "../utils";
import { Game } from "../game";

export class Shotgun extends Weapon {
  constructor(
    public name: string,
    public width: number,
    public height: number,
    public numBullet: number,
    public angle: number,
    public recoil: number,
    public reload: number,
    public bullet: number
  ) {
    super(name, width, height, recoil, reload, bullet);
  }
  shoot(pos: Vector, angle: number, team: "red" | "blue", game: Game) {
    if (this.canShoot) {
      this.canShoot = false;
      console.log("weapon shoot shoot! at: ", angle);
      for (let i = 0; i < this.numBullet; i++) {
        console.log(map(i, 0, this.numBullet - 1,angle -this.angle/2, angle+this.angle/2))
        BulletManager.spawnBullet(
          pos.copy(),
          map(i, 0, this.numBullet - 1, angle - this.angle/2, angle + this.angle/2),
          team,
          this.bullet,
          game
        );
      }
      setTimeout(() => {
        this.canShoot = true;
      }, this.reload);
    }
  }
}
