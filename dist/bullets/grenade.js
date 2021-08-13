"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bullet_1 = __importDefault(require("./bullet"));
class default_1 extends bullet_1.default {
    constructor(pos, angle, size, damage, explosionRange, speed, accuracy, maxDist, doesBounce, team) {
        super(pos, angle, size, damage, speed, accuracy, maxDist, doesBounce, team);
        this.pos = pos;
        this.angle = angle;
        this.size = size;
        this.damage = damage;
        this.explosionRange = explosionRange;
        this.speed = speed;
        this.accuracy = accuracy;
        this.maxDist = maxDist;
        this.doesBounce = doesBounce;
        this.team = team;
        this.bulletType = "grenade";
    }
    update(map, players, map_dimensions, deltaTime) {
        const playerHit = super.update(map, players, map_dimensions, deltaTime);
        if (this.ended) {
            for (let i = 0; i < players.length; i++) {
                if (!players[i].dead && players[i].team !== this.team) {
                    const dist = Math.sqrt(Math.pow((this.pos.x - players[i].pos.x), 2) +
                        Math.pow((this.pos.y - players[i].pos.y), 2));
                    if (playerHit !== players[i] && dist <
                        this.explosionRange + players[i].size - players[i].collisionThreshold) {
                        players[i].health -= this.damage;
                        console.log("ded2");
                    }
                }
            }
        }
    }
    getBulletStats() {
        return Object.assign(Object.assign({}, super.getBulletStats()), { explosionRange: this.explosionRange + " pixels" });
    }
    getData() {
        return {
            pos: { x: this.pos.x, y: this.pos.y },
            bulletSize: this.size,
            team: this.team,
            explosionRange: this.explosionRange,
        };
    }
}
exports.default = default_1;
