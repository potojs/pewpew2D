"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = exports.CustomGame = void 0;
const utils_1 = require("./utils");
const player_1 = require("./player");
const index_1 = require("./index");
const mapManager_1 = __importDefault(require("./mapManager"));
const weaponManager_1 = __importDefault(require("./weapons/weaponManager"));
class CustomGame {
    constructor(socket, mode) {
        this.mode = mode;
        this.admin = socket;
        this.players = [socket];
        const { id, authKey } = utils_1.genAuthKey();
        this.id = id;
        this.authKey = authKey;
        const splitCode = id.split("-");
        this.code = [splitCode[splitCode.length - 1], splitCode[splitCode.length - 2]].join("");
        socket.emit("custom-game-created", {
            mode,
            code: this.code
        });
    }
    disconnect(player) {
        for (let i = 0; i < this.players.length; i++) {
            if (this.players[i] === player) {
                this.players.splice(i, 1);
            }
        }
    }
    connectPlayer(socket, games) {
        console.log(this.players.length);
        socket.on("stoped-joinning-cg", () => {
            for (let i = 0; i < this.players.length; i++) {
                if (this.players[i] === socket) {
                    this.players.splice(i, 1);
                }
            }
        });
        if (this.mode === "1v1") {
            this.players.push(socket);
            if (this.players.length === 2) {
                this.players.forEach(socket => {
                    socket.emit("joined-public-success", {
                        mode: "1v1",
                        id: this.id,
                        authKey: this.authKey
                    });
                });
                games.push(new Game(this.players.splice(0), "1v1", this.id));
                console.log("a 1v1 game has been created!");
            }
        }
        else {
            this.players.push(socket);
            if (this.players.length === 4) {
                this.players.forEach(socket => {
                    socket.emit("joined-public-success", {
                        mode: "2v2",
                        id: this.id,
                        authKey: this.authKey
                    });
                });
                games.push(new Game(this.players.splice(0), "2v2", this.id));
                console.log("a 2v2 game has been created!");
            }
        }
    }
    hasPlayer(socket) {
        return (this.players.find(pSocket => pSocket === socket));
    }
}
exports.CustomGame = CustomGame;
class Game {
    constructor(playersSockets, mode, id) {
        this.mode = mode;
        this.id = id;
        this.started = false;
        this.ended = false;
        this.blueTeamScore = 0;
        this.redTeamScore = 0;
        this.roundStartTime = 5000;
        this.initialWaitingTime = 7000;
        this.roundStarted = false;
        this.bullets = [];
        this.weapons = [];
        this.round = 0;
        this.map = mapManager_1.default.getRandom();
        this.map_dimensions = {
            w: 1000,
            h: 500
        };
        this.playerSize = 25;
        setTimeout(() => {
            if (!this.started) {
                console.log("end");
                this.end();
            }
        }, this.initialWaitingTime);
        this.playersWaiting = [];
        this.players = [];
        playersSockets.forEach(socket => {
            socket.join(id);
            this.playersWaiting.push({
                socket
            });
        });
    }
    userInput(player, input) {
        if (this.roundStarted) {
            player.input(input);
        }
    }
    start() {
        this.started = true;
        this.round = 1;
        this.weapons = weaponManager_1.default.getRandomWeapons();
        const playersData = [];
        for (let i = 0; i < this.players.length; i++) {
            this.players[i].setup(i, this.weapons[0]);
            playersData.push(this.players[i].getData());
        }
        for (let i = 0; i < this.players.length; i++) {
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
            this.players[i].socket.on("input", (input) => {
                this.userInput(this.players[i], input);
            });
        }
        setTimeout(() => {
            this.roundStarted = true;
        }, this.roundStartTime);
    }
    update(deltaTime) {
        if (this.started && this.roundStarted) {
            let bulletsRemoved = [];
            for (let i = this.bullets.length - 1; i >= 0; i--) {
                if (this.bullets[i].ended) {
                    bulletsRemoved.push(this.bullets.splice(i, 1)[0].getData());
                    continue;
                }
                this.bullets[i].update(this.map, this.players, this.map_dimensions, deltaTime);
            }
            let isBlueTeamDed = true;
            let isRedTeamDed = true;
            for (let i = 0; i < this.players.length; i++) {
                this.players[i].update(deltaTime);
                if (!this.players[i].dead && this.players[i].team === "red") {
                    isRedTeamDed = false;
                }
                else if (!this.players[i].dead && this.players[i].team === "blue") {
                    isBlueTeamDed = false;
                }
            }
            const bulletData = [];
            for (let i = 0; i < this.bullets.length; i++) {
                bulletData.push(this.bullets[i].getData());
            }
            const playersData = [];
            for (let i = 0; i < this.players.length; i++) {
                playersData.push(this.players[i].getData());
            }
            for (let i = 0; i < this.players.length; i++) {
                this.players[i].emit("update", {
                    playersData,
                    bulletData,
                    bulletsRemoved
                });
            }
            if (isBlueTeamDed) {
                this.redTeamScore++;
                this.endRound("red");
                return;
            }
            else if (isRedTeamDed) {
                this.blueTeamScore++;
                this.endRound("blue");
                return;
            }
        }
    }
    endGame(winner) {
        this.ended = true;
        index_1.io.to(this.id).emit("game-ended", winner);
    }
    endRound(winnerTeam) {
        if (!this.ended) {
            this.roundStarted = false;
            this.round++;
            this.reset();
            console.log("end end");
            for (let i = 0; i < this.players.length; i++) {
                this.players[i].socket.emit("round-ended", {
                    winnerTeam,
                    lastRound: this.redTeamScore === 2 || this.blueTeamScore === 2,
                    weapon: this.weapons[this.round - 1].getData(),
                    weaponStats: this.weapons[this.round - 1].getStats(),
                });
            }
            setTimeout(() => {
                if (this.redTeamScore === 2) {
                    this.endGame("red");
                }
                else if (this.blueTeamScore === 2) {
                    this.endGame("blue");
                }
                else {
                    const playersData = [];
                    for (let i = 0; i < this.players.length; i++) {
                        playersData.push(this.players[i].getData());
                    }
                    for (let i = 0; i < this.players.length; i++) {
                        this.players[i].emit("update", {
                            playersData,
                            bulletData: [],
                            bulletsRemoved: []
                        });
                    }
                }
                setTimeout(() => {
                    this.roundStarted = true;
                    for (let i = 0; i < this.players.length; i++) {
                        this.players[i].socket.emit("round-started");
                    }
                }, this.roundStartTime);
            }, 2000);
        }
    }
    reset() {
        for (let i = 0; i < this.players.length; i++) {
            this.players[i].setup(i, this.weapons[this.round - 1]);
        }
        this.bullets.splice(0);
    }
    connect(socket, callback) {
        console.log("user connected to game succesfilly!");
        socket.join(this.id);
        this.players.push(new player_1.Player(socket, player_1.shapes[this.players.length], this.mode, this.map_dimensions, this.playerSize, this.map, this));
        callback({
            success: true
        });
        if (!this.started) {
            if (this.mode === "1v1" && this.players.length === 2) {
                this.start();
            }
            else if (this.mode === "2v2" && this.players.length === 4) {
                this.start();
            }
        }
    }
    hasPlayer(socket) {
        return (this.players.find(p => p.socket === socket) ||
            this.playersWaiting.find(p => p.socket === socket));
    }
    complete() {
        return (this.mode === "1v1" && this.players.length === 2 ||
            this.mode === "2v2" && this.players.length === 4);
    }
    disconnect(player) {
        console.log("player disconnected called from game");
        console.log(this.started);
        if (this.started) {
            this.end();
        }
        else {
            const index = this.playersWaiting.indexOf(player);
            if (index >= 0) {
                this.playersWaiting.splice(index);
            }
        }
    }
    end() {
        console.log("game has ended");
        this.ended = true;
        index_1.io.to(this.id).emit("game-ended");
    }
}
exports.Game = Game;
