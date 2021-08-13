import Bullet from "../bullets/bullet";
import BulletManager, { EBullet } from "../bullets/bulletManager";
import { Game } from "../game";
import { Vector } from "../utils";

export default class {
    canShoot: boolean;
    
    constructor(
        public name: string,
        public width: number,
        public height: number,
        public recoil: number,
        public reload: number,
        public bullet: EBullet
    ) {
        this.canShoot = true;
    }
    shoot(pos: Vector, angle: number, team: "red" | "blue", game: Game) {
        // tell the bullet manager to spawn a new bullet
        if(this.canShoot){
            this.canShoot = false
            console.log("weapon shoot shoot! at: ", angle);
            BulletManager.spawnBullet(pos.copy(), angle, team, this.bullet, game);
            setTimeout(()=>{
                this.canShoot = true;
            }, this.reload)
        }

    }
    getData() {
        return {
            width: this.width,
            height: this.height,
            recoil: this.recoil,
            reload: this.reload,
        }
    }
    getStats() {
        const bulletStats = BulletManager.getBulletStats(this.bullet);
        return {
            ...bulletStats,
            reload: this.reload + " ms",
            name: this.name
        }
    }
}