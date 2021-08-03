import Game from "./game";
import { Socket } from "socket.io";
import { Mode, genAuthKey, authenticate } from "./utils";

class GameManager {
    public games: Game[];
    private usersWaitingPublic: {
        oneVone: Socket[],
        twoVtwo: Socket[]
    }
    constructor(){
        this.games = [];
        this.usersWaitingPublic = {
            oneVone: [],
            twoVtwo: []
        }
    }
    public update(){
        console.log(this.games.length);
        for(let i=this.games.length-1;i>=0;i--) {
            if(this.games[i].ended) {
                this.games.splice(i, 1);
            }
        }
    }
    public connect(socket: Socket, msg: any, path: string, callback: Function) {
        const { gameId, authKey, mode } = msg;
        if(authenticate(gameId, authKey, path)) {
            for(const game of this.games) {
                if(game.id === gameId && game.mode === mode) {
                    if(game.complete()){
                        callback({
                            success: false
                        })
                        return;
                    }
                    game.connect(socket, callback);
                }
            }
        }else {
            callback({
                success: false
            })
        }

    }
    public disconnect(socket: Socket): void {
        [this.usersWaitingPublic.oneVone, this.usersWaitingPublic.twoVtwo]
        .forEach(arr=>{
            for(let i=arr.length-1;i>=0;i--){
                if(arr[i] === socket){
                    arr.splice(i, 1);
                    return;
                }
            }
        })
        this.games.forEach(game=>{
            const player = game.hasPlayer(socket);
            console.log("hi1")
            if(player){
                console.log("hi")
                game.disconnect(player);
            }
        })

    }
    public joinningPublicGame(socket: Socket, mode: Mode): boolean {
        if(!this.isNewPlayer(socket)){
            return false;
        }
        if(mode === "1v1"){
            this.usersWaitingPublic.oneVone.push(socket);
            if(this.usersWaitingPublic.oneVone.length === 2) {
                const { id, authKey } = genAuthKey();
                this.usersWaitingPublic.oneVone.forEach(socket=>{
                    socket.emit("joined-public-success", {
                        mode: "1v1",
                        id, authKey
                    })
                })
                this.games.push(new Game(this.usersWaitingPublic.oneVone.splice(0), "1v1", id));
                console.log("a 1v1 game has been created!");
            }
        }else{
            this.usersWaitingPublic.twoVtwo.push(socket);
            if(this.usersWaitingPublic.twoVtwo.length === 4) {
                const { id, authKey } = genAuthKey();
                this.usersWaitingPublic.twoVtwo.forEach(socket=>{
                    socket.emit("joined-public-success", {
                        mode: "2v2",
                        id, authKey
                    })
                })
                this.games.push(new Game(this.usersWaitingPublic.twoVtwo.splice(0), "2v2", id));
                console.log("a 2v2 game has been created!");
            }
        }
        return true;
    }
    public isNewPlayer(socket: Socket): boolean {
        return (
            !!!this.usersWaitingPublic.oneVone.find(s=>s===socket) &&
            !!!this.usersWaitingPublic.twoVtwo.find(s=>s===socket) &&
            !!!this.games.find(game=>game.hasPlayer(socket))
        )
    }
}

export default new GameManager();