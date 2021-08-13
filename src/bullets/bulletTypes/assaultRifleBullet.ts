import { Vector } from "../../utils";
import Bullet from "../bullet";

export default class extends Bullet {
  constructor(pos: Vector, angle: number, team: "red" | "blue") {
    super(pos, angle, 5, 20, 15, 1/180*Math.PI, 1000, false, team);
  }
}
