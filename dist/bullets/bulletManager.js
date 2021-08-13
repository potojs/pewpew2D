"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EBullet = void 0;
const utils_1 = require("../utils");
const pistolBullet_1 = __importDefault(require("./bulletTypes/pistolBullet"));
const smallSgBullet_1 = __importDefault(require("./bulletTypes/smallSgBullet"));
const heavySniperBullet_1 = __importDefault(require("./bulletTypes/heavySniperBullet"));
const tinyBullet_1 = __importDefault(require("./bulletTypes/tinyBullet"));
const bouncySniperDecentBullet_1 = __importDefault(require("./bulletTypes/bouncySniperDecentBullet"));
const BigGrenade_1 = __importDefault(require("./bulletTypes/BigGrenade"));
const assaultRifleBullet_1 = __importDefault(require("./bulletTypes/assaultRifleBullet"));
const rocket_1 = __importDefault(require("./bulletTypes/rocket"));
const PumpSgBullet_1 = __importDefault(require("./bulletTypes/PumpSgBullet"));
var EBullet;
(function (EBullet) {
    EBullet[EBullet["PistolBullet"] = 0] = "PistolBullet";
    EBullet[EBullet["SmallSGBullet"] = 1] = "SmallSGBullet";
    EBullet[EBullet["HeavySniperBullet"] = 2] = "HeavySniperBullet";
    EBullet[EBullet["TinyBullet"] = 3] = "TinyBullet";
    EBullet[EBullet["BouncySniperDecentBullet"] = 4] = "BouncySniperDecentBullet";
    EBullet[EBullet["BigGrenade"] = 5] = "BigGrenade";
    EBullet[EBullet["AssaultRifleBullet"] = 6] = "AssaultRifleBullet";
    EBullet[EBullet["Rocket"] = 7] = "Rocket";
    EBullet[EBullet["PumpSGBullet"] = 8] = "PumpSGBullet";
})(EBullet = exports.EBullet || (exports.EBullet = {}));
class BulletManager {
    createBullet(bullet, pos, angle, team) {
        switch (bullet) {
            case EBullet.PumpSGBullet:
                return new PumpSgBullet_1.default(pos, angle, team);
            case EBullet.Rocket:
                return new rocket_1.default(pos, angle, team);
            case EBullet.AssaultRifleBullet:
                return new assaultRifleBullet_1.default(pos, angle, team);
            case EBullet.BigGrenade:
                return new BigGrenade_1.default(pos, angle, team);
            case EBullet.BouncySniperDecentBullet:
                return new bouncySniperDecentBullet_1.default(pos, angle, team);
            case EBullet.PistolBullet:
                return new pistolBullet_1.default(pos, angle, team);
            case EBullet.SmallSGBullet:
                return new smallSgBullet_1.default(pos, angle, team);
            case EBullet.HeavySniperBullet:
                return new heavySniperBullet_1.default(pos, angle, team);
            case EBullet.TinyBullet:
                return new tinyBullet_1.default(pos, angle, team);
        }
    }
    getBulletStats(bullet) {
        return this.createBullet(bullet, new utils_1.Vector(0, 0), 0, "red").getBulletStats();
    }
    spawnBullet(pos, angle, team, bullet, game) {
        game.bullets.push(this.createBullet(bullet, pos, angle, team));
    }
}
exports.default = new BulletManager();
