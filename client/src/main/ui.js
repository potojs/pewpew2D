"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JoinCustomGameBtn = exports.createCustomGameBtn = exports.startButton = exports.closeCustomGamePopupElt = exports.JCGCodeInput = exports.line = exports.CustomGameCodeSpan = exports.CGCreated = exports.CCGSection = exports.JCGSection = exports.JCGloadingIcon = exports.CCGloadingIcon = exports.PWRloadingIcon = exports.gameTypeDiv = exports.customGameSettings = void 0;
const globals_1 = require("./globals");
const main_1 = require("./main");
exports.customGameSettings = {
    mode: "1v1"
};
const createCustomGame1v1Option = document.querySelector(".option-1v1");
const createCustomGame2v2Option = document.querySelector(".option-2v2");
const customGamePopup = document.querySelector(".custom-game.popup");
const playRandomsBtn = document.querySelector(".play-w-randoms-btn");
const customGameBtn = document.querySelector(".custom-game-btn");
const playRandomsPopup = document.querySelector(".play-w-randoms.popup");
const blurElt = document.querySelector(".blur");
const btn_1v1 = document.querySelector(".btn-1v1");
const btn_2v2 = document.querySelector(".btn-2v2");
exports.gameTypeDiv = document.querySelector(".game-type");
exports.PWRloadingIcon = document.querySelector(".play-w-randoms .loading-icon-parent");
exports.CCGloadingIcon = document.querySelector(".create-custom-game-section .loading-icon-parent");
exports.JCGloadingIcon = document.querySelector(".join-custom-game-section .loading-icon-parent");
exports.JCGSection = document.querySelector(".join-custom-game-section");
exports.CCGSection = document.querySelector(".create-custom-game-section");
exports.CGCreated = document.querySelector(".custom-game-created-section");
exports.CustomGameCodeSpan = document.querySelector(".custom-game-code-span");
exports.line = document.querySelector(".line");
exports.JCGCodeInput = document.querySelector(".join-custom-game-code-input input");
function closeCustomGamePopupElt() {
    customGamePopup.classList.add("not-active");
    blurElt.classList.add("not-active");
    exports.line.classList.remove("not-active");
    exports.JCGSection.classList.remove("not-active");
    exports.CCGSection.classList.remove("not-active");
    exports.JCGloadingIcon.classList.add("not-active");
    exports.JoinCustomGameBtn.classList.remove("disabled");
    exports.JCGCodeInput.value = "";
}
exports.closeCustomGamePopupElt = closeCustomGamePopupElt;
function closeCustomGamePopup() {
    if (globals_1.Globals.state === globals_1.AppState.MENU) {
        closeCustomGamePopupElt();
    }
    else if (globals_1.Globals.state === globals_1.AppState.CREATING_CUSTOM_GAME) {
        closeCustomGamePopupElt();
        main_1.socket.emit("delete-custom-game");
        exports.CCGloadingIcon.classList.add("not-active");
        exports.createCustomGameBtn.classList.remove("disabled");
        globals_1.Globals.state = globals_1.AppState.MENU;
    }
    else if (globals_1.Globals.state === globals_1.AppState.CUSTOM_GAME_CREATED) {
        if (confirm("do you really want to delete this custom game?")) {
            closeCustomGamePopupElt();
            main_1.socket.emit("delete-custom-game");
            exports.CGCreated.classList.add("not-active");
            exports.createCustomGameBtn.classList.remove("not-active");
            globals_1.Globals.state = globals_1.AppState.MENU;
        }
    }
    else if (globals_1.Globals.state === globals_1.AppState.JOINNING_CUSTOM_GAME) {
        main_1.socket.emit("stoped-joinning-cg");
        closeCustomGamePopupElt();
        globals_1.Globals.state = globals_1.AppState.MENU;
    }
}
function closePlayRandomsPopup() {
    if (globals_1.Globals.state === globals_1.AppState.MENU) {
        playRandomsPopup.classList.add("not-active");
        blurElt.classList.add("not-active");
    }
    else if (globals_1.Globals.state === globals_1.AppState.JOINNING_PUBLIC) {
        main_1.socket.emit("stoped-searching");
        exports.PWRloadingIcon.classList.add("not-active");
        exports.startButton.classList.remove("disabled");
        playRandomsPopup.classList.add("not-active");
        blurElt.classList.add("not-active");
        globals_1.Globals.state = globals_1.AppState.MENU;
    }
}
createCustomGame1v1Option.addEventListener("click", (e) => {
    createCustomGame1v1Option.classList.remove("disabled");
    createCustomGame2v2Option.classList.add("disabled");
    exports.customGameSettings.mode = "1v1";
});
createCustomGame2v2Option.addEventListener("click", (e) => {
    createCustomGame2v2Option.classList.remove("disabled");
    createCustomGame1v1Option.classList.add("disabled");
    exports.customGameSettings.mode = "2v2";
});
playRandomsBtn.addEventListener("click", () => {
    playRandomsPopup.classList.remove("not-active");
    blurElt.classList.remove("not-active");
});
customGameBtn.addEventListener("click", () => {
    customGamePopup.classList.remove("not-active");
    blurElt.classList.remove("not-active");
});
btn_1v1.addEventListener("click", () => {
    exports.gameTypeDiv.innerText = "1 VS 1";
    document.querySelector(".htp-1v1").classList.remove("not-active");
    document.querySelector(".htp-2v2").classList.add("not-active");
});
btn_2v2.addEventListener("click", () => {
    exports.gameTypeDiv.innerText = "2 VS 2";
    document.querySelector(".htp-1v1").classList.add("not-active");
    document.querySelector(".htp-2v2").classList.remove("not-active");
});
document.querySelector(".join-custom-game-cancel-btn").addEventListener("click", closeCustomGamePopup);
document.querySelector(".create-custom-game-cancel-btn").addEventListener("click", closeCustomGamePopup);
document.querySelector(".custom-game .cancel").addEventListener("click", closeCustomGamePopup);
document.querySelector(".custom-game .close-popup").addEventListener("click", closeCustomGamePopup);
document.querySelector(".play-w-randoms .cancel").addEventListener("click", closePlayRandomsPopup);
document.querySelector(".play-w-randoms .close-popup").addEventListener("click", closePlayRandomsPopup);
exports.startButton = document.querySelector(".play-w-randoms .confirm");
exports.createCustomGameBtn = document.querySelector(".create-custom-game-btn");
exports.JoinCustomGameBtn = document.querySelector(".join-custom-game-btn");
