import "../styles/main.css";
import "../styles/globals.css";
import io from "socket.io-client";
import {
  customGameSettings,
  createCustomGameBtn,
  startButton,
  gameTypeDiv,
  PWRloadingIcon,
  CCGloadingIcon,
  JCGloadingIcon,
  CCGSection,
  JCGSection,
  CGCreated,
  CustomGameCodeSpan,
  line,
  JoinCustomGameBtn,
  JCGCodeInput,
  closeCustomGamePopupElt
} from "./ui";
import { Globals, AppState } from "./globals";
export const socket = io();



JoinCustomGameBtn.addEventListener("click", ()=>{
  const gameCode = JCGCodeInput.value;
  if(gameCode) {
    socket.emit("join-custom-game", gameCode);
    line.classList.add("not-active");
    CCGSection.classList.add("not-active");
    JCGloadingIcon.classList.remove("not-active");
    JoinCustomGameBtn.classList.add("disabled");
    Globals.state = AppState.JOINNING_CUSTOM_GAME;
  }
})
startButton.addEventListener("click", () => {
  const nPlayers: string = gameTypeDiv.innerText.charAt(0);
  const mode = `${nPlayers}v${nPlayers}`;
  socket.emit("join-game-random", mode);
  PWRloadingIcon.classList.remove("not-active");
  startButton.classList.add("disabled");
  Globals.state = AppState.JOINNING_PUBLIC;
});
createCustomGameBtn.addEventListener("click", () => {
  const mode = customGameSettings.mode;
  console.log(mode);
  socket.emit("create-custom-game", mode);
  CCGloadingIcon.classList.remove("not-active");
  createCustomGameBtn.classList.add("disabled");
  line.classList.add("not-active");
  JCGSection.classList.add("not-active");
  Globals.state = AppState.CREATING_CUSTOM_GAME;
});

socket.on("wrong-game-code", (code: string) => {
  alert("wrong game code");
  closeCustomGamePopupElt();
})
socket.on("custom-game-created", ({ mode, code }) => {
    console.log(mode, code);
    CCGloadingIcon.classList.add("not-active");
    createCustomGameBtn.classList.remove("disabled");
    createCustomGameBtn.classList.add("not-active");
    CCGSection.classList.add("not-active");
    CGCreated.classList.remove("not-active");
    CustomGameCodeSpan.innerText = code;
    Globals.state = AppState.CUSTOM_GAME_CREATED;
})
socket.on("joined-public-success", ({ id, authKey, mode }) => {
  localStorage.setItem("id", id);
  localStorage.setItem("auth-key", authKey);
  localStorage.setItem("mode", mode);
  location.pathname = "/game/" + id;
});
