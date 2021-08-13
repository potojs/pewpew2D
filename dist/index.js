"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
const gameManager_1 = __importDefault(require("./gameManager"));
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const app = express_1.default();
const server = http_1.createServer(app);
exports.io = new socket_io_1.Server(server);
const fps = 30;
app.set("view engine", "ejs");
app.use(express_1.default.static("client/public"));
app.get("/", (req, res) => {
    res.render("main");
});
app.get("/game/:id", (req, res) => {
    res.render("game");
});
exports.io.on("connection", (socket) => {
    console.log("user connected");
    socket.on("connect-game", (msg, callback) => {
        const url = socket.handshake.headers.referer;
        if (url) {
            const gameMatch = url.match("game");
            if (gameMatch) {
                const gameMatchIndex = gameMatch.index;
                if (gameMatchIndex) {
                    const path = url.slice(gameMatchIndex + 5);
                    gameManager_1.default.connect(socket, msg, path, callback);
                }
            }
        }
    });
    socket.on("join-custom-game", (gameCode) => {
        console.log(gameCode);
        gameManager_1.default.joinningCustomGame(socket, gameCode);
    });
    socket.on("stoped-searching", () => {
        console.log("user stoped-searching");
        gameManager_1.default.disconnect(socket);
    });
    socket.on("disconnect", () => {
        console.log("user disconnected");
        gameManager_1.default.disconnect(socket);
    });
    socket.on("create-custom-game", (mode) => {
        if (mode !== "1v1" && mode !== "2v2") {
            mode = "1v1";
        }
        console.log(`a player created a custom ${mode} game`);
        gameManager_1.default.createCustomGame(socket, mode);
    });
    socket.on("join-game-random", (mode) => {
        if (mode !== "1v1" && mode !== "2v2") {
            mode = "1v1";
        }
        console.log(`a player joining a public ${mode} room`);
        gameManager_1.default.joinningPublicGame(socket, mode);
    });
});
setInterval(() => gameManager_1.default.update(), 1000 / fps);
const port = 3000 || process.env.PORT;
server.listen(port, () => console.log("listenning on port: " + port));
