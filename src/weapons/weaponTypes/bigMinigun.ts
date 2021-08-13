import Weapon from "../weapon";
import { EBullet } from "../../bullets/bulletManager";

export class BigMiniGun extends Weapon {
    constructor(){
        super("Big Minigun", 40, 12, 2, 100, EBullet.TinyBullet);
    }
}