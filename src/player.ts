import { Socket } from "socket.io";
import { clamp, IMap, IWall, Dimensions, Mode, Vector, IVector } from "./utils";
import Weapon from "./weapons/weapon";
import { Game } from "./game";

export const shapes: PlayerShape[] = ["pentagon", "triangle", "circle", "square"];
export type PlayerShape = "square" | "triangle" | "pentagon" | "circle";
export interface PlayerInput {
    ori: number;
    left: boolean;
    right: boolean;
    up: boolean;
    down: boolean;
    shoot: boolean;
    isCapturingFlag: boolean;
}
export interface PlayerData {
    shape: PlayerShape;
    pos: IVector;
    team: "blue" | "red";
    ori: number;
    health: number;
}
export class Player {
    pos: Vector;
    team: "blue" | "red" | undefined;
    ori: number
    health: number;
    vel: Vector;
    speed: number;
    collisionThreshold: number;
    weapon: Weapon | undefined;
    dead: boolean;

    constructor(
        public socket: Socket,
        private shape: PlayerShape,
        private mode: Mode,
        private map_dimensions: Dimensions,
        public size: number,
        private map: IMap,
        public game: Game
    ){
        this.dead = false;
        this.speed = 8;
        this.pos = new Vector(0, 0);
        this.vel = new Vector(0, 0);
        this.health = 100;
        this.ori = 0;
        this.collisionThreshold = 0;
    }
    shoot() {
        if(!this.dead){
            const bulletPos = new Vector(
                Math.cos(this.ori) * this.size,
                Math.sin(this.ori) * this.size,
            )
            bulletPos.add(this.pos);
            this.weapon!.shoot(bulletPos, this.ori, this.team!, this.game);
        }
    }
    input(input: PlayerInput) {
        if(!this.dead && typeof input.ori === "number") {
            this.ori = input.ori;
            this.move(input);
            if(input.shoot) {
                this.shoot();
            }            
        }
    }
    move(input: Pick<PlayerInput, "left"|"right"|"down"|"up">){
        let finaleVector = new Vector(
            -+input.left + +input.right,
            -+input.up + +input.down
        );

        if(finaleVector.x || finaleVector.y){
            finaleVector.setMag(this.speed);
        }
        this.vel.set(finaleVector.x, finaleVector.y)
    }
    private boundries() {
        if (this.pos.x <= this.size) {
            this.pos.x = this.size + 1;
        }
        if (this.pos.x >= this.map_dimensions.w - this.size) {
            this.pos.x = this.map_dimensions.w - this.size - 1;
        }
        if (this.pos.y <= this.size) {
            this.pos.y = this.size + 1;
        }
        if (this.pos.y >= this.map_dimensions.h - this.size) {
            this.pos.y = this.map_dimensions.h - this.size - 1;
        }
    }
    isCollidingWith(wall: IWall): boolean {
        const wCenterX = wall.x + wall.w / 2;
        const wCenterY = wall.y + wall.h / 2;

        const closestPoint = {
            x: clamp(this.pos.x - wCenterX, -wall.w/2, wall.w/2) + wCenterX,
            y: clamp(this.pos.y - wCenterY, -wall.h/2, wall.h/2) + wCenterY
        };
        const dist = Math.sqrt((closestPoint.x - this.pos.x)**2 + (closestPoint.y - this.pos.y)**2);
        // console.log(this.size > dist)
        return (
            this.size > dist
        )
    }
    collide(wall: IWall, normVec: IVector, deltaTime: number) {
        for(let i=0;i<this.speed * deltaTime;i++){
            if(this.isCollidingWith(wall)){
                this.pos.x -= normVec.x / Math.abs(normVec.x) || 0;
                this.pos.y -= normVec.y / Math.abs(normVec.y) || 0;
            }else{
                return;
            }
        }
    }
    update(deltaTime: number) {
        if(this.health <= 0){
            this.dead = true;
        }
        if(!this.dead) {
            this.pos.x += this.vel.x * deltaTime;
            let normVec = { x: this.vel.x * deltaTime, y: 0 };
            this.boundries();
            for(let i=0;i<this.map.walls.length;i++) {
                this.collide(this.map.walls[i], normVec, deltaTime);
            }
            this.pos.y += this.vel.y * deltaTime;
            normVec = { x: 0, y: this.vel.y * deltaTime }
            this.boundries();
            for(let i=0;i<this.map.walls.length;i++) {
                this.collide(this.map.walls[i], normVec, deltaTime);
            }
        }

    }
    setup(index: number, weapon: Weapon): void {
        this.health = 100;
        this.dead = false;
        this.weapon = weapon;
        const map_dimensions = this.map_dimensions;
        if(this.mode === "1v1") {
            this.team = index === 0 ? "blue" : "red";
            this.ori = index * Math.PI;
            this.pos.set(
                50 + index * (map_dimensions.w - 100), map_dimensions.h / 2
            )
        } else {
            this.ori = Math.floor(index/2) * Math.PI;
            this.team = Math.floor(index/2) === 0 ? "blue" : "red";
            this.pos.set(
                50 + Math.floor(index/2) * (map_dimensions.w - 100),
                (map_dimensions.h / 3) * (index % 2 + 1)
            )
        }
    }
    getData(): PlayerData {
        return {
            team: this.team!,
            shape: this.shape,
            pos: this.pos,
            ori: this.ori,
            health: this.health
        }
    }
    public emit(event: string, data: any) {
        this.socket.emit(event, data);
    }
}