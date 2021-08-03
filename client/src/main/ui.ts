import { AppState, Globals } from "./globals";
import { socket } from "./main";

const playRandoms = document.querySelector(".play-w-randoms-btn") as HTMLButtonElement;
const playRandomsPopup = document.querySelector(".play-w-randoms.popup") as HTMLDivElement;
const blurElt = document.querySelector(".blur") as HTMLDivElement;
const btn_1v1 = document.querySelector(".btn-1v1") as HTMLButtonElement;
const btn_2v2 = document.querySelector(".btn-2v2") as HTMLButtonElement;
export const gameTypeDiv = (document.querySelector(".game-type") as HTMLDivElement);
export const loadingIcon = (document.querySelector(".loading-icon-parent") as HTMLDivElement);

function closePlayRandomsPopup(): void {
  if(Globals.state === AppState.MENU){
    playRandomsPopup.classList.add("not-active");
    blurElt.classList.add("not-active");
  }else if(Globals.state === AppState.JOINNING_PUBLIC){
    socket.emit("stoped-searching");
    loadingIcon.classList.add("not-active");
    startButton.classList.remove("disabled");
    playRandomsPopup.classList.add("not-active");
    blurElt.classList.add("not-active");
    Globals.state = AppState.MENU;
  }
}
playRandoms.addEventListener("click", () => {
  playRandomsPopup.classList.remove("not-active");
  blurElt.classList.remove("not-active");
});

btn_1v1.addEventListener("click", () => {
  gameTypeDiv.innerText = "1 VS 1";
  (document.querySelector(".htp-1v1") as HTMLDivElement).classList.remove("not-active");
  (document.querySelector(".htp-2v2") as HTMLDivElement).classList.add("not-active");
});

btn_2v2.addEventListener("click", ()=>{
    gameTypeDiv.innerText = "2 VS 2";
    (document.querySelector(".htp-1v1") as HTMLDivElement).classList.add("not-active");
    (document.querySelector(".htp-2v2") as HTMLDivElement).classList.remove("not-active");

});

(document.querySelector(".cancel-game") as HTMLButtonElement).addEventListener("click", closePlayRandomsPopup);
(document.querySelector(".close-popup") as HTMLButtonElement).addEventListener("click", closePlayRandomsPopup);

export const startButton = document.querySelector(".start-game") as HTMLButtonElement;
