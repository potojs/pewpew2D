"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmallShotgun = void 0;
const shotgun_1 = require("../shotgun");
const bulletManager_1 = require("../../bullets/bulletManager");
class SmallShotgun extends shotgun_1.Shotgun {
    constructor() {
        super("Small Shotgun", 20, 10, 4, Math.PI / 3, 10, 500, bulletManager_1.EBullet.SmallSGBullet);
    }
}
exports.SmallShotgun = SmallShotgun;
