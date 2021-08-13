import Weapon from "../weapon";
import { EBullet } from "../../bullets/bulletManager";

export class GrenadeLuncher extends Weapon {
    constructor(){
        super("Grenade Luncher", 40, 15, 5, 500, EBullet.BigGrenade);
    }
}