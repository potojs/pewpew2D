import { Shotgun } from "../shotgun";
import { EBullet } from "../../bullets/bulletManager";

export class SmallShotgun extends Shotgun {
    constructor() {
        super("Small Shotgun", 20, 10, 4, Math.PI/3, 10, 500, EBullet.SmallSGBullet);
    }
}