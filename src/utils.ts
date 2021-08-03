import { Socket } from "socket.io";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
dotenv.config();


export type Mode = "1v1" | "2v2";
export interface PlayerWaiting {
    socket: Socket
}
export interface Player {
    socket: Socket,
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
