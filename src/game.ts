import { Socket } from "socket.io";
import { Mode, Player, PlayerWaiting } from "./utils";
import { io } from "./index";

export default class {
    private players: Player[];
    private playersWaiting: PlayerWaiting[];
    public started: boolean = false;
    public ended: boolean = false;
    constructor(
        playersSockets: Socket[],
        public mode: Mode,
        public id: string
    ){
        setTimeout(()=>{
            if(!this.started){
                console.log("end")
                this.end();
            }
        }, 5000);
        this.playersWaiting = [];
        this.players = [];
        playersSockets.forEach(socket=>{
            socket.join(id);
            this.playersWaiting.push({
                socket
            })
        })
    }
    connect(socket: Socket, callback: Function) {
        console.log("user connected to game succesfilly!");
        socket.join(this.id);
        this.players.push({
            socket
        })
        callback({
            success: true
        })
        if(this.mode === "1v1" && this.players.length === 2){
            this.start();
        }
        if(this.mode === "2v2" && this.players.length === 4){
            this.start();
        }
    }
    private start() {
        this.started = true;
        io.to(this.id).emit("game-started")
    }
    complete(): boolean{
        return (
            this.mode === "1v1" && this.players.length === 2 ||
            this.mode === "2v2" && this.players.length === 4
        )
    }
    disconnect(player: Player) {
        console.log("player disconnected called from game");
        if(this.started){
            this.end();
        }else{
            const index = this.playersWaiting.indexOf(player);
            this.playersWaiting.splice(index);
        }
    }
    private end(){
        console.log("game has ended")
        this.ended = true;
        io.to(this.id).emit("game-ended");
    }
    hasPlayer(socket: Socket): Player | undefined{
        return (
            this.players.find(p=>p.socket===socket) || 
            this.playersWaiting.find(p=>p.socket===socket)
        )
    }
}