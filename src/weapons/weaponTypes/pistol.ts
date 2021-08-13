import Weapon from "../weapon";
import { EBullet } from "../../bullets/bulletManager";

export class Pistol extends Weapon {
    constructor(){
        super("Pistol", 30, 10, 5, 250, EBullet.PistolBullet);
    }
}