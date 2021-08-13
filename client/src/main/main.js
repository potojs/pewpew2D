"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.socket = void 0;
require("../styles/main.css");
require("../styles/globals.css");
const socket_io_client_1 = __importDefault(require("socket.io-client"));
const ui_1 = require("./ui");
const globals_1 = require("./globals");
exports.socket = socket_io_client_1.default();
ui_1.JoinCustomGameBtn.addEventListener("click", () => {
    const gameCode = ui_1.JCGCodeInput.value;
    if (gameCode) {
        exports.socket.emit("join-custom-game", gameCode);
        ui_1.line.classList.add("not-active");
        ui_1.CCGSection.classList.add("not-active");
        ui_1.JCGloadingIcon.classList.remove("not-active");
        ui_1.JoinCustomGameBtn.classList.add("disabled");
        globals_1.Globals.state = globals_1.AppState.JOINNING_CUSTOM_GAME;
    }
});
ui_1.startButton.addEventListener("click", () => {
    const nPlayers = ui_1.gameTypeDiv.innerText.charAt(0);
    const mode = `${nPlayers}v${nPlayers}`;
    exports.socket.emit("join-game-random", mode);
    ui_1.PWRloadingIcon.classList.remove("not-active");
    ui_1.startButton.classList.add("disabled");
    globals_1.Globals.state = globals_1.AppState.JOINNING_PUBLIC;
});
ui_1.createCustomGameBtn.addEventListener("click", () => {
    const mode = ui_1.customGameSettings.mode;
    console.log(mode);
    exports.socket.emit("create-custom-game", mode);
    ui_1.CCGloadingIcon.classList.remove("not-active");
    ui_1.createCustomGameBtn.classList.add("disabled");
    ui_1.line.classList.add("not-active");
    ui_1.JCGSection.classList.add("not-active");
    globals_1.Globals.state = globals_1.AppState.CREATING_CUSTOM_GAME;
});
exports.socket.on("wrong-game-code", (code) => {
    alert("wrong game code");
    ui_1.closeCustomGamePopupElt();
});
exports.socket.on("custom-game-created", ({ mode, code }) => {
    console.log(mode, code);
    ui_1.CCGloadingIcon.classList.add("not-active");
    ui_1.createCustomGameBtn.classList.remove("disabled");
    ui_1.createCustomGameBtn.classList.add("not-active");
    ui_1.CCGSection.classList.add("not-active");
    ui_1.CGCreated.classList.remove("not-active");
    ui_1.CustomGameCodeSpan.innerText = code;
    globals_1.Globals.state = globals_1.AppState.CUSTOM_GAME_CREATED;
});
exports.socket.on("joined-public-success", ({ id, authKey, mode }) => {
    localStorage.setItem("id", id);
    localStorage.setItem("auth-key", authKey);
    localStorage.setItem("mode", mode);
    location.pathname = "/game/" + id;
});
