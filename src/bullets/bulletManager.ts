import { Game } from "../game";
import { Vector } from "../utils";
import Bullet from "./bullet";

import pistolBullet from "./bulletTypes/pistolBullet";
import smallSGBullet from "./bulletTypes/smallSgBullet";
import heavySniperBullet from "./bulletTypes/heavySniperBullet";
import tinyBullet from "./bulletTypes/tinyBullet";
import bouncySniperDecentBullet from "./bulletTypes/bouncySniperDecentBullet";
import bigGrenade from "./bulletTypes/BigGrenade";
import assaultRifleBullet from "./bulletTypes/assaultRifleBullet";
import rocket from "./bulletTypes/rocket";
import pumpSGBullet from "./bulletTypes/PumpSgBullet";

export enum EBullet {
  PistolBullet,
  SmallSGBullet,
  HeavySniperBullet,
  TinyBullet,
  BouncySniperDecentBullet,
  BigGrenade,
  AssaultRifleBullet,
  Rocket,
  PumpSGBullet
}

class BulletManager {
  createBullet(bullet: EBullet, pos: Vector, angle: number, team: "red"|"blue"): Bullet | void {
    switch (bullet) {
      case EBullet.PumpSGBullet:
        return new pumpSGBullet(pos, angle, team);
      case EBullet.Rocket:
        return new rocket(pos, angle, team);
      case EBullet.AssaultRifleBullet:
        return new assaultRifleBullet(pos, angle, team);
      case EBullet.BigGrenade:
        return new bigGrenade(pos, angle, team);
      case EBullet.BouncySniperDecentBullet:
        return new bouncySniperDecentBullet(pos, angle, team);
      case EBullet.PistolBullet:
        return new pistolBullet(pos, angle, team);
      case EBullet.SmallSGBullet:
        return new smallSGBullet(pos, angle, team);
      case EBullet.HeavySniperBullet:
        return new heavySniperBullet(pos, angle, team);
      case EBullet.TinyBullet:
        return new tinyBullet(pos, angle, team);
    }
  }
  getBulletStats(bullet: EBullet) {
    return this.createBullet(bullet, new Vector(0, 0), 0, "red")!.getBulletStats();
  }
  spawnBullet(
    pos: Vector,
    angle: number,
    team: "blue" | "red",
    bullet: EBullet,
    game: Game
  ) {
    game.bullets.push(this.createBullet(bullet, pos, angle, team)!);
  }
}
export default new BulletManager();
