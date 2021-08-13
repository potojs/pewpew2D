import Weapon from "../weapon";
import { EBullet } from "../../bullets/bulletManager";

export class HeavySniper extends Weapon {
    constructor(){
        super("Heavy Snipper", 50, 8, 20, 2000, EBullet.HeavySniperBullet);
    }
}