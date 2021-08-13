import p5 from "p5";
import { ICoordinates, colorBlue, colorRed } from "../utils";
import Particule from "./particule";

class ExplosionArea implements Particule {
    pos: ICoordinates;
    decayingRate: number;
    leftAge: number;
    constructor(
        public x: number,
        public y: number,
        public size: number,
        public team: "red" | "blue"
    ){
        this.pos = { x, y };
        this.leftAge = 200;
        this.decayingRate = 20;
    }
    show(p: p5, marginX: number, marginY: number) {
        if(this.team === "red") {
            p.fill([...colorRed, this.leftAge]);
        }else{
            p.fill([...colorBlue, this.leftAge]);
        }
        p.noStroke();

        p.ellipse(this.pos.x+marginX, this.pos.y+marginY, this.size);
    }
    update() {
        this.leftAge -= this.decayingRate;
    }
}
export default ExplosionArea;