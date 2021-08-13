import Weapon from "../weapon";
import { EBullet } from "../../bullets/bulletManager";

export class RocketLuncher extends Weapon {
    constructor(){
        super("Rocket Luncher", 50, 18, 10, 1200, EBullet.Rocket);
    }
}