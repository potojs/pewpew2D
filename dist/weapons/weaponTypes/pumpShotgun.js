"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PumpShotgun = void 0;
const shotgun_1 = require("../shotgun");
const bulletManager_1 = require("../../bullets/bulletManager");
class PumpShotgun extends shotgun_1.Shotgun {
    constructor() {
        super("Pump Shotgun", 35, 12, 5, Math.PI / 3, 12, 1000, bulletManager_1.EBullet.PumpSGBullet);
    }
}
exports.PumpShotgun = PumpShotgun;
