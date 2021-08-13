import Weapon from "../weapon";
import { EBullet } from "../../bullets/bulletManager";

export class AssaultRifle extends Weapon {
    constructor(){
        super("Assault Rifle", 40, 8, 4, 150, EBullet.AssaultRifleBullet);
    }
}