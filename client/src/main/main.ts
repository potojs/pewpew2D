import ".././styles/main.css";
import io from "socket.io-client";
import { startButton, gameTypeDiv, loadingIcon } from "./ui";
import { Globals, AppState } from "./globals";

export const socket = io();

startButton.addEventListener("click", ()=>{
    const nPlayers: string = gameTypeDiv.innerText.charAt(0);
    const mode = `${nPlayers}v${nPlayers}`
    socket.emit("join-game-random", mode);
    loadingIcon.classList.remove("not-active");
    startButton.classList.add("disabled");
    Globals.state = AppState.JOINNING_PUBLIC;
});

socket.on("joined-public-success", ({ id, authKey, mode })=>{
    localStorage.setItem('id', id);
    localStorage.setItem('auth-key', authKey);
    localStorage.setItem('mode', mode);
    location.pathname = "/game/" + id;
})

