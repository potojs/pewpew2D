import { Vector } from "../../utils";
import Bullet from "../bullet";

export default class extends Bullet {
  constructor(pos: Vector, angle: number, team: "red" | "blue") {
    super(pos, angle, 4, 20, 14, 0, 400, false, team);
  }
}
