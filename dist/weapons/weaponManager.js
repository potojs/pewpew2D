"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pistol_1 = require("./weaponTypes/pistol");
const smallShotgun_1 = require("./weaponTypes/smallShotgun");
const heavySnipper_1 = require("./weaponTypes/heavySnipper");
const bigMinigun_1 = require("./weaponTypes/bigMinigun");
const bouncySniper_1 = require("./weaponTypes/bouncySniper");
const grenadeLuncher_1 = require("./weaponTypes/grenadeLuncher");
const assaultRifle_1 = require("./weaponTypes/assaultRifle");
const rocketLuncher_1 = require("./weaponTypes/rocketLuncher");
const pumpShotgun_1 = require("./weaponTypes/pumpShotgun");
class WeaponManager {
    constructor() {
        this.weapons = [
            new grenadeLuncher_1.GrenadeLuncher(),
            new pumpShotgun_1.PumpShotgun(),
            new rocketLuncher_1.RocketLuncher(),
            new assaultRifle_1.AssaultRifle(),
            new pistol_1.Pistol(),
            new bigMinigun_1.BigMiniGun(),
            new heavySnipper_1.HeavySniper(),
            new bouncySniper_1.BouncySniper(),
            new smallShotgun_1.SmallShotgun()
        ];
    }
    getRandomWeapons() {
        const weaponsCopy = this.weapons.slice(0);
        const randomWeapons = [];
        for (let i = 0; i < 6; i++) {
            const randomIndex = Math.floor(Math.random() * weaponsCopy.length);
            randomWeapons.push(weaponsCopy.splice(randomIndex, 1)[0]);
        }
        // return randomWeapons;
        return this.weapons;
    }
}
exports.default = new WeaponManager();
