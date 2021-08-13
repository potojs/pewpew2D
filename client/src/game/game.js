"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.blur = exports.gameSettings = exports.player = exports.weaponStats = exports.weapon = void 0;
const socket_io_client_1 = __importDefault(require("socket.io-client"));
require("../styles/game.css");
require("../styles/globals.css");
const p5_1 = __importDefault(require("p5"));
const renderer_1 = __importDefault(require("./renderer"));
const input_1 = __importDefault(require("./input"));
const player_1 = require("./player");
const explosionArea_1 = __importDefault(require("./particules/explosionArea"));
const ui_1 = require("./ui");
const socket = socket_io_client_1.default();
let players = [];
let bullets = [];
const particules = [];
let nextWeapon;
let nextWeaponStats;
let gameStarted = false;
let gameEnded = false;
let roundStarted = false;
let roundStartTime;
let roundWaittingToStart;
let roundWaittingStartTime;
let redteamScore = 0;
let blueteamScore = 0;
let round = 1;
let map;
let glowImg;
exports.blur = document.querySelector(".blur");
const roundResults = document.querySelector(".round-result");
const roundResultState = document.querySelector(".state");
const roundWinner = document.querySelector(".winner");
const windowWidth = window.innerWidth;
const windowHeight = window.innerHeight;
const sketch = (p) => {
    let renderer;
    let inputControl;
    p.preload = () => {
        glowImg = p.loadImage("/glow.png");
    };
    p.setup = () => {
        p.createCanvas(windowWidth, windowHeight);
        renderer = new renderer_1.default(p, glowImg);
        inputControl = new input_1.default(p, socket);
        p.imageMode(p.CENTER);
        p.rectMode(p.CENTER);
        p.frameRate(60);
    };
    p.draw = () => {
        if (p.width >= p.height) {
            exports.gameSettings.flipScreen = false;
            exports.gameSettings.scl = p.min(p.min(1, p.width / exports.gameSettings.map_dimensions.w), p.min(1, p.height / exports.gameSettings.map_dimensions.h));
        }
        else {
            exports.gameSettings.flipScreen = true;
            exports.gameSettings.scl = p.min(p.min(1, p.width / exports.gameSettings.map_dimensions.h), p.min(1, p.height / exports.gameSettings.map_dimensions.w));
        }
        p.translate(p.width / 2, p.height / 2);
        if (exports.gameSettings.flipScreen) {
            p.rotate(p.PI / 2);
        }
        p.scale(exports.gameSettings.scl, exports.gameSettings.scl);
        p.translate(-p.width / 2, -p.height / 2);
        ui_1.roundNumberElt.innerText = `${round}`;
        if (roundWaittingToStart) {
            ui_1.timeleftSpan.innerText = Math.ceil((roundWaittingStartTime + roundStartTime - new Date().getTime()) / 1000) + "sec";
        }
        if (roundStarted) {
            inputControl.sendInputData();
        }
        renderer.background();
        renderer.showMap(map);
        renderer.showParticules(particules);
        renderer.showPlayers(players);
        renderer.showBullets(bullets);
        if (p.mouseIsPressed && roundStarted) {
            inputControl.shoot();
        }
    };
    p.windowResized = () => {
        p.resizeCanvas(window.innerWidth, window.innerHeight);
    };
    p.keyPressed = () => {
        if (p.keyCode === 32 && roundStarted) {
            inputControl.shoot();
        }
    };
};
ui_1.showWeaponStatsBtn.addEventListener("click", () => ui_1.showWeaponStats(exports.weaponStats));
socket.on("update", (msg) => {
    if (gameStarted) {
        exports.weapon = nextWeapon;
        exports.weaponStats = nextWeaponStats;
        bullets = msg.bulletData;
        for (let i = 0; i < msg.playersData.length; i++) {
            players[i].update(msg.playersData[i]);
        }
        for (let i = 0; i < msg.bulletsRemoved.length; i++) {
            if (msg.bulletsRemoved[i].explosionRange) {
                const bullet = msg.bulletsRemoved[i];
                particules.push(new explosionArea_1.default(bullet.pos.x, bullet.pos.y, bullet.explosionRange, bullet.team));
            }
        }
    }
});
socket.on("game-ended", (winner) => {
    if (!winner) {
        alert("a user has disconnected");
        location.pathname = "/";
    }
    else {
        gameEnded = true;
        roundResults.classList.add("not-active");
        ui_1.gameEndingScreen.classList.remove("not-active");
        ui_1.gameWinner.innerText = winner + " team has won the game";
        if (winner === exports.player.team) {
            if (exports.gameSettings.mode === "1v1") {
                ui_1.gameResult.innerText = "You have won the game!";
            }
            else {
                ui_1.gameResult.innerText = "Your team has won the game!";
            }
        }
        else {
            if (exports.gameSettings.mode === "1v1") {
                ui_1.gameResult.innerText = "You have lost the game :(";
            }
            else {
                ui_1.gameResult.innerText = "Your team has lost the game :(";
            }
        }
    }
});
socket.on("round-ended", (msg) => {
    round++;
    redteamScore += +(msg.winnerTeam === "red");
    blueteamScore += +(msg.winnerTeam === "blue");
    nextWeaponStats = msg.weaponStats;
    nextWeapon = msg.weapon;
    roundStarted = false;
    for (let i = 0; i < players.length; i++) {
        players[i].currentGunPos = 0;
    }
    exports.blur.classList.remove("not-active");
    roundResults.classList.remove("not-active");
    roundResultState.innerText = msg.winnerTeam === exports.player.team ? "Victory" : "Defeat";
    roundWinner.innerText = msg.winnerTeam + " has won the round";
    ui_1.redScoreElt.innerText = "red: " + redteamScore;
    ui_1.blueScoreElt.innerText = "blue: " + blueteamScore;
    if (!msg.lastRound) {
        console.log("yes?");
        setTimeout(() => {
            exports.weaponStats = nextWeaponStats;
            exports.weapon = nextWeapon;
            roundResults.classList.add("not-active");
            ui_1.showWeaponStats(nextWeaponStats);
            ui_1.showWeaponStatsBtn.classList.remove("not-active");
            ui_1.roundStartsinIndic.classList.remove("not-active");
            roundWaittingToStart = true;
            roundWaittingStartTime = new Date().getTime();
        }, 2000);
    }
});
socket.on("round-started", () => {
    if (!gameEnded) {
        roundWaittingToStart = false;
        roundStarted = true;
        exports.weapon = nextWeapon;
        ui_1.hideWeaponStats();
        ui_1.showWeaponStatsBtn.classList.add("not-active");
        ui_1.roundStartsinIndic.classList.add("not-active");
    }
});
socket.on("game-started", (msg) => {
    console.log(msg.capturingFlagMaxDist);
    roundWaittingToStart = true;
    roundWaittingStartTime = new Date().getTime();
    roundStartTime = msg.roundStartTime;
    if (!gameStarted) {
        setTimeout(() => {
            console.log("round started!");
            ui_1.hideWeaponStats();
            ui_1.showWeaponStatsBtn.classList.add("not-active");
            ui_1.roundStartsinIndic.classList.add("not-active");
            roundStarted = true;
            roundWaittingToStart = false;
        }, msg.roundStartTime);
        nextWeapon = msg.weapon;
        exports.weapon = msg.weapon;
        nextWeaponStats = msg.weaponStats;
        exports.weaponStats = msg.weaponStats;
        console.log(nextWeapon);
        map = msg.map;
        for (let i = 0; i < msg.playersData.length; i++) {
            players.push(new player_1.Player(msg.playersData[i].pos, msg.playersData[i].ori, msg.playersData[i].team, msg.playersData[i].shape, msg.playerSize));
            if (i === msg.index) {
                exports.player = players[players.length - 1];
            }
        }
        exports.gameSettings = {
            mode: msg.mode,
            map_dimensions: msg.map_dimensions,
            flipScreen: false,
            scl: 1
        };
        gameStarted = true;
        new p5_1.default(sketch);
        ui_1.showWeaponStats(exports.weaponStats);
    }
});
socket.emit("connect-game", {
    gameId: localStorage.getItem("id"),
    authKey: localStorage.getItem("auth-key"),
    mode: localStorage.getItem("mode"),
}, (res) => {
    if (!res.success) {
        alert("you don't have the authentication to join this game or something went wrong :( if you think this is an error plz report it");
        location.pathname = "/";
    }
});
