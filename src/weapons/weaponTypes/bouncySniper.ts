import Weapon from "../weapon";
import { EBullet } from "../../bullets/bulletManager";

export class BouncySniper extends Weapon {
    constructor(){
        super("Bouncy Snipper", 40, 10, 10, 1000, EBullet.BouncySniperDecentBullet);
    }
}