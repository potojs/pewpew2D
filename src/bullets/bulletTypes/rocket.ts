import { Vector } from "../../utils";
import Grenade from "../grenade";

export default class extends Grenade {
  constructor(pos: Vector, angle: number, team: "red" | "blue") {
    super(pos, angle, 8, 60, 100, 15, 1/18*Math.PI, 1000, false, team);
  }
}
