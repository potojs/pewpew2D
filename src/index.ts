import GameManager from "./gameManager";
import express, { Request, Response } from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
const app = express();
const server = createServer(app);
export const io = new Server(server);
const fps = 1;

app.set("view engine", "ejs");

app.use(express.static("client/public"))
app.get("/", (req: Request, res: Response)=>{
    res.render("main");
})
app.get("/game/:id", (req: Request, res: Response)=>{
    res.render("game");
})
io.on("connection", (socket: Socket)=>{
    console.log("user connected");
    socket.on("connect-game", (msg: any, callback: Function)=>{
        const url = socket.handshake.headers.referer;
        if(url) {
            const gameMatch = url.match("game");
            if(gameMatch){
                const gameMatchIndex = gameMatch.index;
                if(gameMatchIndex) {
                    const path = url.slice(gameMatchIndex+5);
                    GameManager.connect(socket, msg, path, callback);
                }
            }
        }
    })
    socket.on("stoped-searching", ()=>{
        console.log("user stoped-searching");
        GameManager.disconnect(socket);
    })
    socket.on("disconnect", ()=>{
        console.log("user disconnected");
        GameManager.disconnect(socket);
    })
    socket.on("join-game-random", (mode: any)=>{
        console.log(`a player joining a public ${mode} room`);
        GameManager.joinningPublicGame(socket, mode);
    })
})

setInterval(()=>GameManager.update(), 1000/fps);
const port = 3000 || process.env.PORT;
server.listen(port, ()=>console.log("listenning on port: "+port))