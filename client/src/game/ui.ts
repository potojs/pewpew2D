import { IWeaponStats } from "./utils";
import { blur, weapon } from "./game";

const weaponStatsPopup = document.querySelector(
  ".weapon-stats-popup"
) as HTMLDivElement;
const weaponName = document.querySelector(".weapon-name") as HTMLDivElement;
const weaponStatsElt = document.querySelector(".weapon-stats") as HTMLUListElement;
const closePopupBtn = document.querySelector(".close") as HTMLButtonElement;
export const showWeaponStatsBtn = document.querySelector(".show-weapon-stats") as HTMLButtonElement;
export const roundStartsinIndic = document.querySelector(".round-startsin-indicator") as HTMLDivElement;
export const timeleftSpan = document.querySelector(".timeleft") as HTMLSpanElement;
export const redScoreElt = document.querySelector(".red-score") as HTMLDivElement;
export const blueScoreElt = document.querySelector(".blue-score") as HTMLDivElement;
export const roundNumberElt = document.querySelector(".round-number") as HTMLSpanElement;
export const gameEndingScreen = document.querySelector(".game-ending-screen") as HTMLDivElement;
export const gameWinner = document.querySelector(".game-winner") as HTMLDivElement;
export const gameResult = document.querySelector(".game-result") as HTMLDivElement;
export const exitGameBtn = document.querySelector(".exit-game") as HTMLButtonElement;

exitGameBtn.addEventListener("click", ()=>{
  location.pathname = "/";
})
closePopupBtn.addEventListener("click", ()=>{
  hideWeaponStats();
});

export function showWeaponStats(weaponStats: IWeaponStats) {
  blur.classList.remove("not-active");
  weaponStatsPopup.classList.remove("not-active");
  weaponStatsElt.innerHTML = "";
  weaponName.innerText = weaponStats.name;
  for (let statName in weaponStats) {
    if(statName !== "name") {
      const statElt = document.createElement("li");
      statElt.classList.add("weapon-stat")
      statElt.innerText = `${statName}: ${weaponStats[statName]}`;
      weaponStatsElt.appendChild(statElt);
    }
  }
};

export function hideWeaponStats() {
  blur.classList.add("not-active");
  weaponStatsPopup.classList.add("not-active");
}
