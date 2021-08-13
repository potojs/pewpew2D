import { Socket } from "socket.io";
import { genAuthKey, IMap, Dimensions, Mode, PlayerWaiting } from "./utils";
import { Player, PlayerInput, shapes, PlayerData } from "./player";
import { io } from "./index";
import MapManager from "./mapManager";
import WeaponManager from "./weapons/weaponManager";
import Weapon from "./weapons/weapon";
import Bullet, { IBulletData } from "./bullets/bullet";

export class CustomGame {
    public players: Socket[]
    public admin: Socket;
    public id: string;
    public authKey: string;
    public code: string;
    constructor(
        socket: Socket,
        public mode: Mode,
    ){
        this.admin = socket;
        this.players = [socket];
        const { id, authKey } = genAuthKey();
        this.id = id;
        this.authKey = authKey;
        const splitCode = id.split("-");
        this.code = [splitCode[splitCode.length-1], splitCode[splitCode.length-2]].join("");
        socket.emit("custom-game-created", {
            mode,
            code: this.code
        });
    }
    disconnect(player: Socket) {
        for(let i=0;i<this.players.length;i++){
            if(this.players[i] === player) {
                this.players.splice(i, 1);
            }
        }
    }
    connectPlayer(socket: Socket, games: Game[]) {
        console.log(this.players.length);
        socket.on("stoped-joinning-cg", ()=>{
            for(let i=0;i<this.players.length;i++){
                if(this.players[i] === socket) {
                    this.players.splice(i, 1);
                }
            }
        })
        if(this.mode === "1v1"){
            this.players.push(socket);
            if(this.players.length === 2) {
                this.players.forEach(socket=>{
                    socket.emit("joined-public-success", {
                        mode: "1v1",
                        id: this.id,
                        authKey: this.authKey
                    })
                })
                games.push(new Game(this.players.splice(0), "1v1", this.id));
                console.log("a 1v1 game has been created!");
            }
        }else{
            this.players.push(socket);
            if(this.players.length === 4) {
                this.players.forEach(socket=>{
                    socket.emit("joined-public-success", {
                        mode: "2v2",
                        id: this.id,
                        authKey: this.authKey
                    })
                })
                games.push(new Game(this.players.splice(0), "2v2", this.id));
                console.log("a 2v2 game has been created!");
            }
        }
    }
    hasPlayer(socket: Socket): Socket | undefined {
        return (
            this.players.find(pSocket=>pSocket===socket) 
        )
    }
}

export class Game {
    public players: Player[];
    private playersWaiting: PlayerWaiting[];
    public started: boolean = false;
    public ended: boolean = false;
    public map_dimensions: Dimensions;
    public map: IMap;
    public playerSize: number;
    public round: number;
    public weapons: Weapon[];
    public bullets: Bullet[];
    public roundStarted: boolean;
    public roundStartTime: number;
    public blueTeamScore: number;
    public redTeamScore: number;
    public initialWaitingTime: number;

    constructor(
        playersSockets: Socket[],
        public mode: Mode,
        public id: string
    ){
        this.blueTeamScore = 0;
        this.redTeamScore = 0;
        this.roundStartTime = 5000;
        this.initialWaitingTime = 7000;
        this.roundStarted = false;
        this.bullets = [];
        this.weapons = [];
        this.round = 0;
        this.map = MapManager.getRandom();
        this.map_dimensions = {
            w: 1000,
            h: 500
        }
        this.playerSize = 25;
        setTimeout(()=>{
            if(!this.started){
                console.log("end")
                this.end();
            }
        }, this.initialWaitingTime);

        this.playersWaiting = [];
        this.players = [];

        playersSockets.forEach(socket=>{
            socket.join(id);
            this.playersWaiting.push({
                socket
            })
        })
    }
    private userInput(player: Player, input: PlayerInput) {
        if(this.roundStarted){
            player.input(input);
        }
    }
    private start() {
        this.started = true;
        this.round = 1;
        this.weapons = WeaponManager.getRandomWeapons();

        const playersData: PlayerData []= [];
        for(let i=0;i<this.players.length;i++){
            this.players[i].setup(i, this.weapons[0]);
            playersData.push(this.players[i].getData());
        }

        for(let i=0;i<this.players.length;i++){
            this.players[i].emit("game-started", {
                map_dimensions: this.map_dimensions,
                index: i,
                playersData,
                map: this.map,
                mode: this.mode,
                playerSize: this.playerSize,
                weaponStats: this.weapons[0].getStats(),
                weapon: this.weapons[0].getData(),
                roundStartTime: this.roundStartTime
            });
            this.players[i].socket.on("input", (input: any)=>{
                this.userInput(this.players[i], input as PlayerInput)
            });
        }
        setTimeout(()=>{
            this.roundStarted = true;
        }, this.roundStartTime)
    }
    public update(deltaTime: number) {
        if(this.started && this.roundStarted) {
            let bulletsRemoved: IBulletData[] = [];
            for(let i=this.bullets.length-1;i>=0;i--){
                if(this.bullets[i].ended) {
                    bulletsRemoved.push(this.bullets.splice(i, 1)[0].getData());
                    continue;
                }
                this.bullets[i].update(this.map, this.players, this.map_dimensions, deltaTime);
            }
            let isBlueTeamDed = true;
            let isRedTeamDed = true;
            for(let i=0;i<this.players.length;i++){
                this.players[i].update(deltaTime);
                if(!this.players[i].dead && this.players[i].team === "red") {
                    isRedTeamDed = false;
                }else if(!this.players[i].dead && this.players[i].team === "blue") {
                    isBlueTeamDed = false;
                }
            }
            const bulletData: IBulletData[] = [];
            for(let i=0;i<this.bullets.length;i++){
                bulletData.push(this.bullets[i].getData());
            }
            const playersData: PlayerData[] = [];
            for(let i=0;i<this.players.length;i++){
                playersData.push(this.players[i].getData());
            }
            for(let i=0;i<this.players.length;i++){
                this.players[i].emit("update", {
                    playersData,
                    bulletData,
                    bulletsRemoved
                });
            }
            if(isBlueTeamDed) {
                this.redTeamScore++;
                this.endRound("red");
                return;
            }else if(isRedTeamDed) {
                this.blueTeamScore++;
                this.endRound("blue");
                return;
            }
        }
    }
    endGame(winner: "red"|"blue") {
        this.ended = true;
        io.to(this.id).emit("game-ended", winner);
    }
    endRound(winnerTeam: "red" | "blue") {
        if(!this.ended) {
            this.roundStarted = false;
            this.round++;
            this.reset();
            console.log("end end")
            for(let i=0;i<this.players.length;i++){
                this.players[i].socket.emit("round-ended", {
                    winnerTeam,
                    lastRound: this.redTeamScore === 2 || this.blueTeamScore === 2,
                    weapon: this.weapons[this.round - 1].getData(),
                    weaponStats: this.weapons[this.round - 1].getStats(),
                });
            }
            setTimeout(()=>{
                if(this.redTeamScore === 2){
                    this.endGame("red");
                }else if(this.blueTeamScore === 2) {
                    this.endGame("blue");
                }else{
                    const playersData: PlayerData[] = [];
                    for(let i=0;i<this.players.length;i++){
                        playersData.push(this.players[i].getData());
                    }
                    for(let i=0;i<this.players.length;i++){
                        this.players[i].emit("update", {
                            playersData,
                            bulletData: [],
                            bulletsRemoved: []
                        });
                    }
                }
                setTimeout(()=>{
                    this.roundStarted = true;
                    for(let i=0;i<this.players.length;i++){
                        this.players[i].socket.emit("round-started");
                    }
                }, this.roundStartTime);
            }, 2000);
        }
    }
    reset() {
        for(let i=0;i<this.players.length;i++){
            this.players[i].setup(i, this.weapons[this.round - 1]);
        }
        this.bullets.splice(0);
    }
    connect(socket: Socket, callback: Function) {
        console.log("user connected to game succesfilly!");
        socket.join(this.id);
        this.players.push(new Player(
            socket,
            shapes[this.players.length],
            this.mode,
            this.map_dimensions,
            this.playerSize,
            this.map,
            this
        ))
        callback({
            success: true
        })
        if(!this.started){
            if(this.mode === "1v1" && this.players.length === 2){
                this.start();
            }else if(this.mode === "2v2" && this.players.length === 4){
                this.start();
            }
        }
    }
    hasPlayer(socket: Socket): Player | PlayerWaiting | undefined{
        return (
            this.players.find(p=>p.socket===socket) || 
            this.playersWaiting.find(p=>p.socket===socket)
        )
    }
    complete(): boolean{
        return (
            this.mode === "1v1" && this.players.length === 2 ||
            this.mode === "2v2" && this.players.length === 4
        )
    }
    disconnect(player: Player | PlayerWaiting) {
        console.log("player disconnected called from game");
        console.log(this.started);
        if(this.started){
            this.end();
        } else {
            const index = this.playersWaiting.indexOf(player);
            if(index >= 0){
                this.playersWaiting.splice(index);
            }
        }
    }
    private end(){
        console.log("game has ended")
        this.ended = true;
        io.to(this.id).emit("game-ended");
    }
}