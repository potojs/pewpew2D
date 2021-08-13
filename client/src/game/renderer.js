"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const game_1 = require("./game");
const utils_1 = require("./utils");
class default_1 {
    constructor(p, glowImg) {
        this.p = p;
        this.glowImg = glowImg;
        this.mapWidth = game_1.gameSettings.map_dimensions.w;
        this.mapHeight = game_1.gameSettings.map_dimensions.h;
        this.mapMarginX = (p.width - this.mapWidth) / 2;
        this.mapMarginY = (p.height - this.mapHeight) / 2;
    }
    showParticules(particules) {
        for (let i = 0; i < particules.length; i++) {
            particules[i].update();
            particules[i].show(this.p, this.mapMarginX, this.mapMarginY);
        }
    }
    showBullets(bullets) {
        this.p.noStroke();
        for (let i = 0; i < bullets.length; i++) {
            if (bullets[i].team === "red") {
                this.p.fill(utils_1.colorRed);
                this.p.tint(utils_1.colorRed);
            }
            else {
                this.p.fill(utils_1.colorBlue);
                this.p.tint(utils_1.colorBlue);
            }
            this.p.ellipse(bullets[i].pos.x + this.mapMarginX, bullets[i].pos.y + this.mapMarginY, bullets[i].bulletSize * 2);
            this.p.image(this.glowImg, bullets[i].pos.x + this.mapMarginX, bullets[i].pos.y + this.mapMarginY, bullets[i].bulletSize * 2, bullets[i].bulletSize * 2);
        }
    }
    showMap(map) {
        this.p.push();
        for (const wall of map.walls) {
            this.showWall(wall);
        }
        this.p.pop();
    }
    showWall(wall) {
        this.p.rectMode(this.p.CORNER);
        this.p.noStroke();
        // this.p.strokeWeight(2);
        this.p.fill(100);
        this.p.rect(wall.x + this.mapMarginX, wall.y + this.mapMarginY, wall.w, wall.h);
    }
    background() {
        this.mapMarginX = (this.p.width - this.mapWidth) / 2;
        this.mapMarginY = (this.p.height - this.mapHeight) / 2;
        this.p.background(0, 5, 10);
        this.p.fill(0, 20, 30);
        this.p.noStroke();
        this.p.rect(this.p.width / 2, this.p.height / 2, this.mapWidth, this.mapHeight);
    }
    showPlayers(players) {
        for (const player of players) {
            player.show(this.p, this.glowImg);
        }
    }
}
exports.default = default_1;
