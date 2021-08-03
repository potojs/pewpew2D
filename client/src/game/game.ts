import io from "socket.io-client";
import "./../styles/game.css";
import p5 from "p5";
const socket = io();

const sketch = (p: p5) => {
    p.setup = ()=>{
        p.createCanvas(window.innerWidth, window.innerHeight);
    }
    p.draw = ()=>{
        p.background(0);
    }

}
new p5(sketch);


socket.on("game-ended", ()=>{
    alert("a user has disconnected");
    location.pathname = "/";
})
socket.on("game-started", ()=>{
    console.log("game-started");
})
socket.emit("connect-game", {
    gameId: localStorage.getItem("id"),
    authKey: localStorage.getItem("auth-key"),
    mode: localStorage.getItem("mode")
}, (res: any)=>{
    if(res.success) {
        console.log("success")
    }else{
        alert("you don't have the authentication to join this game or something went wrong :( if you think this is an error plz report it");
        location.pathname = "/";
    }
})
