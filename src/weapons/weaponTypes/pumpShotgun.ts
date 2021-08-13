import { Shotgun } from "../shotgun";
import { EBullet } from "../../bullets/bulletManager";

export class PumpShotgun extends Shotgun {
    constructor() {
        super("Pump Shotgun", 35, 12, 5, Math.PI/3, 12, 1000, EBullet.PumpSGBullet);
    }
}