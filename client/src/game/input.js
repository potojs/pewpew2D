"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.canShoot = void 0;
const p5_1 = __importDefault(require("p5"));
exports.canShoot = true;
const game_1 = require("./game");
class default_1 {
    constructor(p, socket) {
        this.p = p;
        this.socket = socket;
        this.isShooting = false;
    }
    shoot() {
        this.isShooting = true;
    }
    sendInputData() {
        if (game_1.player.health > 0) {
            let left = false;
            let right = false;
            let up = false;
            let down = false;
            let ori = 0;
            let shoot = false;
            let isGamepadConnected = false;
            if ("getGamepads" in navigator) {
                const gamepads = navigator.getGamepads();
                if (gamepads[0]) {
                    isGamepadConnected = true;
                    const gamepad = gamepads[0];
                    if (gamepad.buttons[7].pressed) {
                        this.isShooting = false;
                        shoot = true;
                    }
                    if (this.p.sqrt(Math.pow(gamepad.axes[2], 2) + Math.pow(gamepad.axes[3], 2)) > 0.3) {
                        ori = -this.p.atan2(gamepad.axes[2], gamepad.axes[3]) + +!game_1.gameSettings.flipScreen * Math.PI / 2;
                    }
                    if (this.p.sqrt(Math.pow(gamepad.axes[0], 2) + Math.pow(gamepad.axes[1], 2)) > 0.3) {
                        const axeVector = this.p.createVector(gamepad.axes[0], gamepad.axes[1]);
                        const leftVector = this.p.createVector(-1, 0);
                        const upVector = this.p.createVector(0, -1);
                        const downVector = this.p.createVector(0, 1);
                        const rightVector = this.p.createVector(1, 0);
                        if (p5_1.default.Vector.dist(axeVector, leftVector) < 1) {
                            left = true;
                        }
                        if (p5_1.default.Vector.dist(axeVector, upVector) < 1) {
                            up = true;
                        }
                        if (p5_1.default.Vector.dist(axeVector, downVector) < 1) {
                            down = true;
                        }
                        if (p5_1.default.Vector.dist(axeVector, rightVector) < 1) {
                            right = true;
                        }
                    }
                }
            }
            if (!isGamepadConnected) {
                if (this.p.keyIsDown(this.p.UP_ARROW) ||
                    this.p.keyIsDown(87)) {
                    up = true;
                }
                if (this.p.keyIsDown(this.p.DOWN_ARROW) ||
                    this.p.keyIsDown(83)) {
                    down = true;
                }
                if (this.p.keyIsDown(this.p.LEFT_ARROW) ||
                    this.p.keyIsDown(65)) {
                    left = true;
                }
                if (this.p.keyIsDown(this.p.RIGHT_ARROW) ||
                    this.p.keyIsDown(68)) {
                    right = true;
                }
                if (this.isShooting) {
                    this.isShooting = false;
                    shoot = true;
                }
                const mousePos = {
                    x: this.p.mouseX / game_1.gameSettings.scl,
                    y: this.p.mouseY / game_1.gameSettings.scl
                };
                if (game_1.gameSettings.flipScreen) {
                    mousePos.x -= (this.p.width - game_1.gameSettings.map_dimensions.h * game_1.gameSettings.scl) / game_1.gameSettings.scl / 2;
                    mousePos.y -= (this.p.height - game_1.gameSettings.map_dimensions.w * game_1.gameSettings.scl) / game_1.gameSettings.scl / 2;
                    // translate to the center
                    mousePos.x -= game_1.gameSettings.map_dimensions.h / 2;
                    mousePos.y -= game_1.gameSettings.map_dimensions.w / 2;
                    // rotate -PI rad
                    [mousePos.x, mousePos.y] = [
                        mousePos.y,
                        -mousePos.x
                    ];
                    // translate back
                    mousePos.x += game_1.gameSettings.map_dimensions.w / 2;
                    mousePos.y += game_1.gameSettings.map_dimensions.h / 2;
                }
                else {
                    mousePos.x -= (this.p.width - game_1.gameSettings.map_dimensions.w * game_1.gameSettings.scl) / game_1.gameSettings.scl / 2;
                    mousePos.y -= (this.p.height - game_1.gameSettings.map_dimensions.h * game_1.gameSettings.scl) / game_1.gameSettings.scl / 2;
                }
                // console.log(player.pos.x, player.pos.y);
                ori = Math.atan2(mousePos.y - game_1.player.pos.y, mousePos.x - game_1.player.pos.x);
            }
            if (shoot && exports.canShoot) {
                game_1.player.currentGunPos = -game_1.weapon.recoil;
                exports.canShoot = false;
                setTimeout(() => {
                    exports.canShoot = true;
                }, game_1.weapon.reload);
            }
            if (game_1.gameSettings.flipScreen) {
                [left, right, up, down] = [up, down, right, left];
            }
            else {
            }
            const inputData = {
                ori,
                left, right, up, down,
                shoot
            };
            // console.log("orientation: ", ori);
            // console.log("left: ", left);
            // console.log("right: ", right);
            // console.log("up: ", up);
            // console.log("down: ", down);
            // console.log("shoot: ", shoot);
            this.socket.emit("input", inputData);
        }
    }
}
exports.default = default_1;
