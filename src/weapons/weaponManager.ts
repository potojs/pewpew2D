import Weapon from "./weapon";
import { Pistol } from "./weaponTypes/pistol"
import { SmallShotgun } from "./weaponTypes/smallShotgun";
import { HeavySniper } from "./weaponTypes/heavySnipper";
import { BigMiniGun } from "./weaponTypes/bigMinigun";
import { BouncySniper } from "./weaponTypes/bouncySniper";
import { GrenadeLuncher } from "./weaponTypes/grenadeLuncher";
import { AssaultRifle } from "./weaponTypes/assaultRifle";
import { RocketLuncher } from "./weaponTypes/rocketLuncher";
import { PumpShotgun } from "./weaponTypes/pumpShotgun";

class WeaponManager {
    weapons: Weapon[];
    constructor(){
        this.weapons = [
            new GrenadeLuncher(),
            new PumpShotgun(),
            new RocketLuncher(),
            new AssaultRifle(),
            new Pistol(),
            new BigMiniGun(),
            new HeavySniper(),
            new BouncySniper(),
            new SmallShotgun()
        ];
    }
    getRandomWeapons() {
        const weaponsCopy = this.weapons.slice(0);
        const randomWeapons: Weapon[] = [];
        for(let i=0;i<6;i++){
            const randomIndex = Math.floor(Math.random() * weaponsCopy.length);
            randomWeapons.push(weaponsCopy.splice(randomIndex, 1)[0]);
        }
        // return randomWeapons;
        return this.weapons;
    }
}
export default new WeaponManager();