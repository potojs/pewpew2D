"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const utils_2 = require("../utils");
class Bullet {
    constructor(pos, angle, size, damage, speed, accuracyMistake, maxDist, doesBounce, team) {
        this.pos = pos;
        this.angle = angle;
        this.size = size;
        this.damage = damage;
        this.speed = speed;
        this.accuracyMistake = accuracyMistake;
        this.maxDist = maxDist;
        this.doesBounce = doesBounce;
        this.team = team;
        this.bulletType = "bullet";
        this.initialUpdate = true;
        this.angle += Math.random() * accuracyMistake - accuracyMistake / 2;
        this.vel = new utils_2.Vector(Math.cos(this.angle) * this.speed, Math.sin(this.angle) * this.speed);
        this.dist = 0;
        this.ended = false;
    }
    getBulletStats() {
        return {
            damage: String(this.damage),
            bulletRange: this.maxDist + " pixel",
            bulletSpeed: this.speed + " pixels/tick",
            bulletSize: this.size + " pixel",
            accuracyMistake: `+/- ${this.accuracyMistake / 2 / Math.PI * 180} degrees`,
            doesBulletBounce: String(this.doesBounce),
            bulletType: this.bulletType
        };
    }
    getData() {
        return {
            pos: { x: this.pos.x, y: this.pos.y },
            bulletSize: this.size,
            team: this.team,
        };
    }
    boundries(map_dimensions) {
        let didBounce = false;
        if (this.pos.x <= this.size) {
            this.vel.x *= -1;
            this.pos.x = this.size + 1;
            didBounce = true;
        }
        if (this.pos.x >= map_dimensions.w - this.size) {
            this.vel.x *= -1;
            this.pos.x = map_dimensions.w - this.size - 1;
            didBounce = true;
        }
        if (this.pos.y <= this.size) {
            this.vel.y *= -1;
            this.pos.y = this.size + 1;
            didBounce = true;
        }
        if (this.pos.y >= map_dimensions.h - this.size) {
            this.vel.y *= -1;
            this.pos.y = map_dimensions.h - this.size - 1;
            didBounce = true;
        }
        if (didBounce && !this.doesBounce) {
            this.end();
        }
    }
    isCollidingWith(wall) {
        const wCenterX = wall.x + wall.w / 2;
        const wCenterY = wall.y + wall.h / 2;
        const closestPoint = {
            x: utils_1.clamp(this.pos.x - wCenterX, -wall.w / 2, wall.w / 2) + wCenterX,
            y: utils_1.clamp(this.pos.y - wCenterY, -wall.h / 2, wall.h / 2) + wCenterY,
        };
        const dist = Math.sqrt(Math.pow((closestPoint.x - this.pos.x), 2) + Math.pow((closestPoint.y - this.pos.y), 2));
        return this.size >= dist;
    }
    normToClosestSuface(wall) {
        const distToLeftSuf = Math.abs(this.pos.x - wall.x);
        const distToRightSuf = Math.abs(this.pos.x - (wall.x + wall.w));
        const distToUpSuf = Math.abs(this.pos.y - wall.y);
        const distToDownSuf = Math.abs(this.pos.y - (wall.y + wall.h));
        const closest = Math.min(distToLeftSuf, distToRightSuf, distToUpSuf, distToDownSuf);
        switch (closest) {
            case distToLeftSuf:
                return new utils_2.Vector(-1, 0);
            case distToRightSuf:
                return new utils_2.Vector(1, 0);
            case distToUpSuf:
                return new utils_2.Vector(0, -1);
            case distToDownSuf:
                return new utils_2.Vector(0, 1);
        }
        return new utils_2.Vector(0, 0);
    }
    getOutOf(wall) {
        const normVec = this.normToClosestSuface(wall);
        while (this.isCollidingWith(wall)) {
            this.pos.add(normVec);
        }
    }
    collide(wall, normVec, deltaTime) {
        for (let i = 0; i < (this.speed * deltaTime) + 2; i++) {
            if (this.isCollidingWith(wall)) {
                if (!this.doesBounce) {
                    this.end();
                }
                this.pos.x -= normVec.x / Math.abs(normVec.x) || 0;
                this.pos.y -= normVec.y / Math.abs(normVec.y) || 0;
            }
            else {
                if (i !== 0) {
                    this.vel.x *= -normVec.x / normVec.x || 1;
                    this.vel.y *= -normVec.y / normVec.y || 1;
                }
                return;
            }
        }
    }
    update(map, players, map_dimensions, deltaTime) {
        if (!this.ended) {
            if (this.initialUpdate) {
                for (let i = 0; i < map.walls.length; i++) {
                    this.getOutOf(map.walls[i]);
                }
            }
            this.dist += this.speed * deltaTime;
            this.pos.x += this.vel.x * deltaTime;
            for (let i = 0; i < map.walls.length; i++) {
                this.collide(map.walls[i], new utils_2.Vector(this.vel.x * deltaTime, 0), deltaTime);
            }
            this.pos.y += this.vel.y * deltaTime;
            for (let i = 0; i < map.walls.length; i++) {
                this.collide(map.walls[i], new utils_2.Vector(0, this.vel.y * deltaTime), deltaTime);
            }
            this.boundries(map_dimensions);
            for (let i = 0; i < players.length; i++) {
                if (!players[i].dead && players[i].team !== this.team &&
                    Math.sqrt(Math.pow((this.pos.x - players[i].pos.x), 2) + Math.pow((this.pos.y - players[i].pos.y), 2)) <
                        this.size + players[i].size - players[i].collisionThreshold) {
                    players[i].health -= this.damage;
                    this.end();
                    return players[i];
                }
            }
            if (this.dist >= this.maxDist) {
                this.end();
            }
            this.initialUpdate = false;
        }
    }
    end() {
        this.ended = true;
    }
}
exports.default = Bullet;
