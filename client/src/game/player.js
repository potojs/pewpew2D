"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player = void 0;
const game_1 = require("./game");
const utils_1 = require("./utils");
class Player {
    constructor(serverPos, ori, team, shape, size) {
        this.serverPos = serverPos;
        this.ori = ori;
        this.team = team;
        this.shape = shape;
        this.size = size;
        this.prevServerPos = { x: 0, y: 0 };
        this.pos = { x: 0, y: 0 };
        this.health = 100;
        this.currentGunPos = 0;
        this.canShoot = true;
        this.time1 = 0;
        this.time2 = 0;
        this.deltaTime = 0;
    }
    update({ health, pos, ori }) {
        this.time1 = new Date().getTime();
        this.deltaTime = this.time1 - this.time2;
        if (this.currentGunPos < 0) {
            this.currentGunPos++;
        }
        this.prevServerPos = {
            x: this.serverPos.x,
            y: this.serverPos.y
        };
        this.serverPos = pos;
        this.ori = ori;
        this.health = health;
        this.time2 = new Date().getTime();
    }
    show(p, glowImg) {
        let weaponDist = 0;
        p.push();
        const timeFromLastUpdate = new Date().getTime() - this.time2;
        const lerpAmount = p.min(timeFromLastUpdate / this.deltaTime, 1);
        this.pos = {
            x: p.lerp(this.prevServerPos.x, this.serverPos.x, lerpAmount),
            y: p.lerp(this.prevServerPos.y, this.serverPos.y, lerpAmount)
        };
        p.translate(this.pos.x + (p.width - game_1.gameSettings.map_dimensions.w) / 2, this.pos.y + (p.height - game_1.gameSettings.map_dimensions.h) / 2);
        p.rotate(this.ori);
        const colorGray = p.color(100);
        if (this.team === "blue") {
            p.fill(p.lerpColor(p.color(utils_1.colorBlue), colorGray, 1 - this.health / 100));
        }
        else {
            p.fill(p.lerpColor(p.color(utils_1.colorRed), colorGray, 1 - this.health / 100));
        }
        p.noStroke();
        switch (this.shape) {
            case "triangle":
                const triangleBase = p.sqrt((Math.pow(this.size, 2) * p.PI * 2) / p.sin(p.PI / 3));
                const triangleHeight = p.sin(p.PI / 3) * triangleBase;
                const triangleRadius = triangleBase / 2 / p.sin(p.PI / 3);
                p.triangle(triangleRadius, 0, triangleRadius - triangleHeight, triangleBase / 2, triangleRadius - triangleHeight, -triangleBase / 2);
                weaponDist = triangleRadius + 2;
                break;
            case "circle":
                p.ellipse(0, 0, this.size * 2);
                weaponDist = this.size + 2;
                break;
            case "pentagon":
                const radius = p.sqrt((Math.pow(this.size, 2) * p.PI) / (p.sin(p.PI / 5) * p.cos(p.PI / 5) * 5));
                p.beginShape();
                for (let i = 0; i < 5; i++) {
                    p.vertex(p.cos((i * p.PI * 2) / 5) * radius, p.sin((i * p.PI * 2) / 5) * radius);
                }
                p.endShape();
                weaponDist = radius + 2;
                break;
            case "square":
                const side = p.sqrt(Math.pow(this.size, 2) * p.PI);
                p.rect(0, 0, side, side);
                weaponDist = side / 2 + 2;
                break;
        }
        if (this.health > 0) {
            if (this.team === "blue") {
                p.fill(utils_1.colorBlue);
            }
            else {
                p.fill(utils_1.colorRed);
            }
            p.rect(weaponDist + game_1.weapon.width / 2 + this.currentGunPos, 0, game_1.weapon.width, game_1.weapon.height);
            if (this.team === "blue") {
                const faintBlue = p.color(utils_1.colorBlue);
                faintBlue.setAlpha(50);
                p.tint(p.lerpColor(p.color(utils_1.colorBlue), faintBlue, 1 - this.health / 100));
            }
            else {
                const faintRed = p.color(utils_1.colorRed);
                faintRed.setAlpha(50);
                p.tint(p.lerpColor(p.color(utils_1.colorRed), faintRed, 1 - this.health / 100));
            }
            p.image(glowImg, 0, 0, this.size * 3, this.size * 3);
        }
        p.pop();
    }
}
exports.Player = Player;
