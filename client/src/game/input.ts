import p5 from "p5";
import { Socket } from "socket.io-client";
export let canShoot = true;
import { gameSettings, player, weapon } from "./game";


export default class {
    private isShooting: boolean;
    constructor(
        private p: p5,
        private socket: Socket
    ){
        this.isShooting = false;
    }
    public shoot() {
        this.isShooting = true;
    }
    sendInputData() {
        if(player.health > 0){
            let left: boolean = false;
            let right: boolean = false;
            let up: boolean = false;
            let down: boolean = false;
            let ori = 0;
            let shoot: boolean = false;
            let isGamepadConnected = false;

            if("getGamepads" in navigator) {
                const gamepads = navigator.getGamepads();
                if(gamepads[0]) {
                    isGamepadConnected = true;
                    const gamepad = gamepads[0];
                    if(gamepad.buttons[7].pressed){
                        this.isShooting = false;
                        shoot = true;
                    }
                    if(this.p.sqrt(gamepad.axes[2]**2+gamepad.axes[3]**2) > 0.3){
                        ori = -this.p.atan2(
                            gamepad.axes[2],
                            gamepad.axes[3]
                        ) + +!gameSettings.flipScreen * Math.PI/2
                    }
                    if(this.p.sqrt(gamepad.axes[0]**2+gamepad.axes[1]**2) > 0.3){
                        const axeVector = this.p.createVector(
                            gamepad.axes[0],
                            gamepad.axes[1]
                        );
                        const leftVector = this.p.createVector(-1, 0);
                        const upVector = this.p.createVector(0, -1);
                        const downVector = this.p.createVector(0, 1);
                        const rightVector =this.p.createVector(1, 0);

                        if(p5.Vector.dist(axeVector, leftVector) < 1) {
                            left = true;
                        }
                        if(p5.Vector.dist(axeVector, upVector) < 1) {
                            up = true;
                        }
                        if(p5.Vector.dist(axeVector, downVector) < 1) {
                            down = true;
                        }
                        if(p5.Vector.dist(axeVector, rightVector) < 1) {
                            right = true;
                        }

                    }
                }
            }
            if(!isGamepadConnected){
                if(
                    this.p.keyIsDown(this.p.UP_ARROW) ||
                    this.p.keyIsDown(87)
                ){
                    up = true;
                }
                if(
                    this.p.keyIsDown(this.p.DOWN_ARROW) ||
                    this.p.keyIsDown(83)
                ){
                    down = true;
                }
                if(
                    this.p.keyIsDown(this.p.LEFT_ARROW) ||
                    this.p.keyIsDown(65)
                ){
                    left = true;
                }
                if(
                    this.p.keyIsDown(this.p.RIGHT_ARROW) ||
                    this.p.keyIsDown(68)
                ){
                    right = true;
                }

                if(this.isShooting) {
                    this.isShooting = false;
                    shoot = true;
                }
                const mousePos = { 
                    x: this.p.mouseX / gameSettings.scl,
                    y: this.p.mouseY / gameSettings.scl
                };

                

                if(gameSettings.flipScreen) {
                    mousePos.x -= (this.p.width - gameSettings.map_dimensions.h * gameSettings.scl) / gameSettings.scl / 2;
                    mousePos.y -= (this.p.height - gameSettings.map_dimensions.w * gameSettings.scl) / gameSettings.scl / 2;

                    // translate to the center
                    mousePos.x -= gameSettings.map_dimensions.h/2;
                    mousePos.y -= gameSettings.map_dimensions.w/2;

                    // rotate -PI rad
                    [mousePos.x, mousePos.y] = [
                        mousePos.y,
                        -mousePos.x
                    ]

                    // translate back
                    mousePos.x += gameSettings.map_dimensions.w/2;
                    mousePos.y += gameSettings.map_dimensions.h/2;
                }else{
                    mousePos.x -= (this.p.width - gameSettings.map_dimensions.w * gameSettings.scl) / gameSettings.scl / 2;
                    mousePos.y -= (this.p.height - gameSettings.map_dimensions.h * gameSettings.scl) / gameSettings.scl / 2;
                }
                // console.log(player.pos.x, player.pos.y);

                ori = Math.atan2(
                    mousePos.y - player.pos.y,
                    mousePos.x - player.pos.x
                );
            }
            if(shoot && canShoot) {
                player.currentGunPos = -weapon.recoil;
                canShoot = false;
                setTimeout(()=>{
                    canShoot = true;
                }, weapon.reload);
            }

            if(gameSettings.flipScreen) {
                [left, right, up, down] = [up, down, right, left];
            }else{
                
            }
 
            const inputData = {
                ori,
                left, right, up, down,
                shoot
            }
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