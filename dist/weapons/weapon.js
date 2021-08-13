"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bulletManager_1 = __importDefault(require("../bullets/bulletManager"));
class default_1 {
    constructor(name, width, height, recoil, reload, bullet) {
        this.name = name;
        this.width = width;
        this.height = height;
        this.recoil = recoil;
        this.reload = reload;
        this.bullet = bullet;
        this.canShoot = true;
    }
    shoot(pos, angle, team, game) {
        // tell the bullet manager to spawn a new bullet
        if (this.canShoot) {
            this.canShoot = false;
            console.log("weapon shoot shoot! at: ", angle);
            bulletManager_1.default.spawnBullet(pos.copy(), angle, team, this.bullet, game);
            setTimeout(() => {
                this.canShoot = true;
            }, this.reload);
        }
    }
    getData() {
        return {
            width: this.width,
            height: this.height,
            recoil: this.recoil,
            reload: this.reload,
        };
    }
    getStats() {
        const bulletStats = bulletManager_1.default.getBulletStats(this.bullet);
        return Object.assign(Object.assign({}, bulletStats), { reload: this.reload + " ms", name: this.name });
    }
}
exports.default = default_1;
