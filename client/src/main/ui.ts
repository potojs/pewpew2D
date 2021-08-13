import { AppState, Globals } from "./globals";
import { socket } from "./main";

export const customGameSettings = {
  mode: "1v1"
}
const createCustomGame1v1Option = document.querySelector(".option-1v1") as HTMLButtonElement;
const createCustomGame2v2Option = document.querySelector(".option-2v2") as HTMLButtonElement;
const customGamePopup = document.querySelector(".custom-game.popup") as HTMLDivElement;

const playRandomsBtn = document.querySelector(".play-w-randoms-btn") as HTMLButtonElement;
const customGameBtn = document.querySelector(".custom-game-btn") as HTMLButtonElement;

const playRandomsPopup = document.querySelector(".play-w-randoms.popup") as HTMLDivElement;
const blurElt = document.querySelector(".blur") as HTMLDivElement;
const btn_1v1 = document.querySelector(".btn-1v1") as HTMLButtonElement;
const btn_2v2 = document.querySelector(".btn-2v2") as HTMLButtonElement;
export const gameTypeDiv = (document.querySelector(".game-type") as HTMLDivElement);
export const PWRloadingIcon = (document.querySelector(".play-w-randoms .loading-icon-parent") as HTMLDivElement);
export const CCGloadingIcon = (document.querySelector(".create-custom-game-section .loading-icon-parent") as HTMLDivElement);
export const JCGloadingIcon = (document.querySelector(".join-custom-game-section .loading-icon-parent") as HTMLDivElement);

export const JCGSection = (document.querySelector(".join-custom-game-section") as HTMLDivElement);
export const CCGSection = (document.querySelector(".create-custom-game-section") as HTMLDivElement);
export const CGCreated = (document.querySelector(".custom-game-created-section") as HTMLDivElement);
export const CustomGameCodeSpan = (document.querySelector(".custom-game-code-span") as HTMLSpanElement);
export const line = (document.querySelector(".line") as HTMLDivElement);
export const JCGCodeInput = (document.querySelector(".join-custom-game-code-input input") as HTMLInputElement);

export function closeCustomGamePopupElt() {
  customGamePopup.classList.add("not-active");
  blurElt.classList.add("not-active");
  line.classList.remove("not-active");
  JCGSection.classList.remove("not-active");
  CCGSection.classList.remove("not-active");
  JCGloadingIcon.classList.add("not-active")
  JoinCustomGameBtn.classList.remove("disabled");
  JCGCodeInput.value = "";
}
function closeCustomGamePopup(): void {
  if(Globals.state === AppState.MENU) {
    closeCustomGamePopupElt();
  }else if(Globals.state === AppState.CREATING_CUSTOM_GAME) {
    closeCustomGamePopupElt();
    socket.emit("delete-custom-game");
    CCGloadingIcon.classList.add("not-active");
    createCustomGameBtn.classList.remove("disabled");
    Globals.state = AppState.MENU;
  }else if(Globals.state === AppState.CUSTOM_GAME_CREATED) {
    if(confirm("do you really want to delete this custom game?")){
      closeCustomGamePopupElt();
      socket.emit("delete-custom-game");
      CGCreated.classList.add("not-active");
      createCustomGameBtn.classList.remove("not-active");
      Globals.state = AppState.MENU;
    }
  }else if(Globals.state === AppState.JOINNING_CUSTOM_GAME) {
    socket.emit("stoped-joinning-cg");
    closeCustomGamePopupElt();
    Globals.state = AppState.MENU;
  }
}

function closePlayRandomsPopup(): void {
  if(Globals.state === AppState.MENU){
    playRandomsPopup.classList.add("not-active");
    blurElt.classList.add("not-active");
  }else if(Globals.state === AppState.JOINNING_PUBLIC){
    socket.emit("stoped-searching");
    PWRloadingIcon.classList.add("not-active");
    startButton.classList.remove("disabled");
    playRandomsPopup.classList.add("not-active");
    blurElt.classList.add("not-active");
    Globals.state = AppState.MENU;
  }
}
createCustomGame1v1Option.addEventListener("click", (e: Event)=>{
  createCustomGame1v1Option.classList.remove("disabled");
  createCustomGame2v2Option.classList.add("disabled");
  customGameSettings.mode = "1v1";
})
createCustomGame2v2Option.addEventListener("click", (e: Event)=>{
  createCustomGame2v2Option.classList.remove("disabled");
  createCustomGame1v1Option.classList.add("disabled");
  customGameSettings.mode = "2v2";
})
playRandomsBtn.addEventListener("click", () => {
  playRandomsPopup.classList.remove("not-active");
  blurElt.classList.remove("not-active");
});
customGameBtn.addEventListener("click", ()=>{
  customGamePopup.classList.remove("not-active");
  blurElt.classList.remove("not-active");
})

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

(document.querySelector(".join-custom-game-cancel-btn") as HTMLButtonElement).addEventListener("click", closeCustomGamePopup);
(document.querySelector(".create-custom-game-cancel-btn") as HTMLButtonElement).addEventListener("click", closeCustomGamePopup);
(document.querySelector(".custom-game .cancel") as HTMLButtonElement).addEventListener("click", closeCustomGamePopup);
(document.querySelector(".custom-game .close-popup") as HTMLButtonElement).addEventListener("click", closeCustomGamePopup);
(document.querySelector(".play-w-randoms .cancel") as HTMLButtonElement).addEventListener("click", closePlayRandomsPopup);
(document.querySelector(".play-w-randoms .close-popup") as HTMLButtonElement).addEventListener("click", closePlayRandomsPopup);

export const startButton = document.querySelector(".play-w-randoms .confirm") as HTMLButtonElement;
export const createCustomGameBtn = document.querySelector(".create-custom-game-btn") as HTMLButtonElement;
export const JoinCustomGameBtn = document.querySelector(".join-custom-game-btn") as HTMLButtonElement;
