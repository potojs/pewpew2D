"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Shotgun = void 0;
const weapon_1 = __importDefault(require("./weapon"));
const bulletManager_1 = __importDefault(require("../bullets/bulletManager"));
const utils_1 = require("../utils");
class Shotgun extends weapon_1.default {
    constructor(name, width, height, numBullet, angle, recoil, reload, bullet) {
        super(name, width, height, recoil, reload, bullet);
        this.name = name;
        this.width = width;
        this.height = height;
        this.numBullet = numBullet;
        this.angle = angle;
        this.recoil = recoil;
        this.reload = reload;
        this.bullet = bullet;
    }
    shoot(pos, angle, team, game) {
        if (this.canShoot) {
            this.canShoot = false;
            console.log("weapon shoot shoot! at: ", angle);
            for (let i = 0; i < this.numBullet; i++) {
                console.log(utils_1.map(i, 0, this.numBullet - 1, angle - this.angle / 2, angle + this.angle / 2));
                bulletManager_1.default.spawnBullet(pos.copy(), utils_1.map(i, 0, this.numBullet - 1, angle - this.angle / 2, angle + this.angle / 2), team, this.bullet, game);
            }
            setTimeout(() => {
                this.canShoot = true;
            }, this.reload);
        }
    }
}
exports.Shotgun = Shotgun;
