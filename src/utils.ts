import { Socket } from "socket.io";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
dotenv.config();

export function map(n: number, start1: number, stop1: number, start2: number, stop2: number): number{
    return ((n-start1)/(stop1-start1))*(stop2-start2)+start2;
};
export function clamp(val: number, min: number, max: number){
    if(val < min){
        return min;
    }else if(val > max){
        return max
    }
    return val;
}
export type Mode = "1v1" | "2v2";
export interface IVector {
    x: number;
    y: number;
}
export interface IWall extends IVector {
    w: number;
    h: number;
}
export interface IMap {
    walls: IWall[]
}
export class Vector implements IVector {
    constructor(
        public x: number,
        public y: number
    ){}
    copy(): Vector {
        return new Vector(this.x, this.y);
    }
    set(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
    add<T extends IVector>(vec: T): void {
        this.x += vec.x;
        this.y += vec.y;
    }
    mag() {
        return Math.sqrt(this.x**2 + this.y**2);
    }
    setMag(newMag: number) {
        const dir = this.dir();
        this.x = Math.cos(dir) * newMag;
        this.y = Math.sin(dir) * newMag;
    }
    normalize() {
        this.setMag(1);
    }
    mult(scalar: number) {
        this.x *= scalar;
        this.y *= scalar;
    }
    dir(): number {
        return Math.atan2(this.y, this.x);
    }
    
}
export interface PlayerWaiting {
    socket: Socket;
}
export interface Dimensions { w: number, h: number }

export function isInsideBoundries(boundries: Dimensions, pos: IVector): boolean {
    return (
        pos.x > 0 &&
        pos.x < boundries.w &&
        pos.y > 0 &&
        pos.y < boundries.h
    )
}

export function genAuthKey(){
    const id = uuidv4();
    const authKey = jwt.sign(id, process.env.SECRET_KEY as string);
    return { id, authKey }
}
export function authenticate(id: string, authKey: string, path: string): boolean {
    if(id === path) {
        try {
            const decoded = jwt.verify(authKey, process.env.SECRET_KEY as string);
            if(decoded === id) {
                return true;
            }
        } catch(err) {
            console.log(err);
        }
        
    }
    return false;
}
