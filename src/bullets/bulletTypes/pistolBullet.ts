import { Vector } from "../../utils";
import Bullet from "../bullet";

export default class extends Bullet {
  constructor(pos: Vector, angle: number, team: "red" | "blue") {
    super(pos, angle, 6, 20, 10, 1/12*Math.PI, 800, false, team);
  }
}
