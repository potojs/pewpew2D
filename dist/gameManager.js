"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const game_1 = require("./game");
const utils_1 = require("./utils");
class GameManager {
    constructor() {
        this.time1 = 0;
        this.time2 = 0;
        this.deltaTime = 0;
        this.games = [];
        this.customGames = [];
        this.usersWaitingPublic = {
            oneVone: [],
            twoVtwo: []
        };
    }
    update() {
        this.time1 = new Date().getTime();
        this.deltaTime = this.time1 - this.time2;
        for (let i = this.games.length - 1; i >= 0; i--) {
            if (this.games[i].ended) {
                this.games.splice(i, 1);
            }
            else {
                this.games[i].update(this.deltaTime / 33);
            }
        }
        this.time2 = new Date().getTime();
    }
    connect(socket, msg, path, callback) {
        const { gameId, authKey, mode } = msg;
        if (utils_1.authenticate(gameId, authKey, path)) {
            for (const game of this.games) {
                if (game.id === gameId && game.mode === mode) {
                    if (game.complete()) {
                        callback({
                            success: false
                        });
                        return;
                    }
                    game.connect(socket, callback);
                }
            }
        }
        else {
            callback({
                success: false
            });
        }
    }
    disconnect(socket) {
        [this.usersWaitingPublic.oneVone, this.usersWaitingPublic.twoVtwo]
            .forEach(arr => {
            for (let i = arr.length - 1; i >= 0; i--) {
                if (arr[i] === socket) {
                    arr.splice(i, 1);
                    return;
                }
            }
        });
        this.games.forEach(game => {
            const player = game.hasPlayer(socket);
            if (player) {
                game.disconnect(player);
            }
        });
        for (let i = 0; i < this.customGames.length; i++) {
            if (this.customGames[i].admin === socket) {
                this.customGames.splice(i, 1);
            }
            else {
                this.customGames[i].disconnect(socket);
            }
        }
    }
    createCustomGame(socket, mode) {
        if (!this.isNewPlayer(socket)) {
            return false;
        }
        this.customGames.push(new game_1.CustomGame(socket, mode));
        socket.on("delete-custom-game", () => {
            for (let i = this.customGames.length - 1; i >= 0; i--) {
                if (this.customGames[i].admin === socket) {
                    this.customGames.splice(i, 1);
                }
            }
        });
        return true;
    }
    joinningCustomGame(socket, gameCode) {
        if (!this.isNewPlayer(socket)) {
            return false;
        }
        for (let i = 0; i < this.customGames.length; i++) {
            if (this.customGames[i].code === gameCode) {
                this.customGames[i].connectPlayer(socket, this.games);
                return;
            }
        }
        socket.emit("wrong-game-code", gameCode);
    }
    joinningPublicGame(socket, mode) {
        if (!this.isNewPlayer(socket)) {
            return false;
        }
        if (mode === "1v1") {
            this.usersWaitingPublic.oneVone.push(socket);
            if (this.usersWaitingPublic.oneVone.length === 2) {
                const { id, authKey } = utils_1.genAuthKey();
                this.usersWaitingPublic.oneVone.forEach(socket => {
                    socket.emit("joined-public-success", {
                        mode: "1v1",
                        id, authKey
                    });
                });
                this.games.push(new game_1.Game(this.usersWaitingPublic.oneVone.splice(0), "1v1", id));
                console.log("a 1v1 game has been created!");
            }
        }
        else {
            this.usersWaitingPublic.twoVtwo.push(socket);
            if (this.usersWaitingPublic.twoVtwo.length === 4) {
                const { id, authKey } = utils_1.genAuthKey();
                this.usersWaitingPublic.twoVtwo.forEach(socket => {
                    socket.emit("joined-public-success", {
                        mode: "2v2",
                        id, authKey
                    });
                });
                this.games.push(new game_1.Game(this.usersWaitingPublic.twoVtwo.splice(0), "2v2", id));
                console.log("a 2v2 game has been created!");
            }
        }
        return true;
    }
    isNewPlayer(socket) {
        return (!!!this.usersWaitingPublic.oneVone.find(s => s === socket) &&
            !!!this.usersWaitingPublic.twoVtwo.find(s => s === socket) &&
            !!!this.games.find(game => game.hasPlayer(socket)) &&
            !!!this.customGames.find(game => game.hasPlayer(socket)));
    }
}
exports.default = new GameManager();
