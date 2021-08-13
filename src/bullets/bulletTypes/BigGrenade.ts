import { Vector } from "../../utils";
import Grenade from "../grenade";

export default class extends Grenade {
  constructor(pos: Vector, angle: number, team: "red" | "blue") {
    super(pos, angle, 6, 40, 50, 12, 1/20*Math.PI, 400, true, team);
  }
}
