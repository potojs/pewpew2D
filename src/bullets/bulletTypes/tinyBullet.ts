import { Vector } from "../../utils";
import Bullet from "../bullet";

export default class extends Bullet {
  constructor(pos: Vector, angle: number, team: "red" | "blue") {
    super(pos, angle, 3, 8, 12, 1/8*Math.PI, 400, false, team);
  }
}
