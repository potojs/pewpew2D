"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hideWeaponStats = exports.showWeaponStats = exports.exitGameBtn = exports.gameResult = exports.gameWinner = exports.gameEndingScreen = exports.roundNumberElt = exports.blueScoreElt = exports.redScoreElt = exports.timeleftSpan = exports.roundStartsinIndic = exports.showWeaponStatsBtn = void 0;
const game_1 = require("./game");
const weaponStatsPopup = document.querySelector(".weapon-stats-popup");
const weaponName = document.querySelector(".weapon-name");
const weaponStatsElt = document.querySelector(".weapon-stats");
const closePopupBtn = document.querySelector(".close");
exports.showWeaponStatsBtn = document.querySelector(".show-weapon-stats");
exports.roundStartsinIndic = document.querySelector(".round-startsin-indicator");
exports.timeleftSpan = document.querySelector(".timeleft");
exports.redScoreElt = document.querySelector(".red-score");
exports.blueScoreElt = document.querySelector(".blue-score");
exports.roundNumberElt = document.querySelector(".round-number");
exports.gameEndingScreen = document.querySelector(".game-ending-screen");
exports.gameWinner = document.querySelector(".game-winner");
exports.gameResult = document.querySelector(".game-result");
exports.exitGameBtn = document.querySelector(".exit-game");
exports.exitGameBtn.addEventListener("click", () => {
    location.pathname = "/";
});
closePopupBtn.addEventListener("click", () => {
    hideWeaponStats();
});
function showWeaponStats(weaponStats) {
    game_1.blur.classList.remove("not-active");
    weaponStatsPopup.classList.remove("not-active");
    weaponStatsElt.innerHTML = "";
    weaponName.innerText = weaponStats.name;
    for (let statName in weaponStats) {
        if (statName !== "name") {
            const statElt = document.createElement("li");
            statElt.classList.add("weapon-stat");
            statElt.innerText = `${statName}: ${weaponStats[statName]}`;
            weaponStatsElt.appendChild(statElt);
        }
    }
}
exports.showWeaponStats = showWeaponStats;
;
function hideWeaponStats() {
    game_1.blur.classList.add("not-active");
    weaponStatsPopup.classList.add("not-active");
}
exports.hideWeaponStats = hideWeaponStats;
