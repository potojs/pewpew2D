"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
class ExplosionArea {
    constructor(x, y, size, team) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.team = team;
        this.pos = { x, y };
        this.leftAge = 200;
        this.decayingRate = 20;
    }
    show(p, marginX, marginY) {
        if (this.team === "red") {
            p.fill([...utils_1.colorRed, this.leftAge]);
        }
        else {
            p.fill([...utils_1.colorBlue, this.leftAge]);
        }
        p.noStroke();
        p.ellipse(this.pos.x + marginX, this.pos.y + marginY, this.size);
    }
    update() {
        this.leftAge -= this.decayingRate;
    }
}
exports.default = ExplosionArea;
