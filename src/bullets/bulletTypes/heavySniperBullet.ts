import { Vector } from "../../utils";
import Bullet from "../bullet";

export default class extends Bullet {
  constructor(pos: Vector, angle: number, team: "red" | "blue") {
    super(pos, angle, 5, 100, 30, 1/1000*Math.PI, 2000, false, team);
  }
}
