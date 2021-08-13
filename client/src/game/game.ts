import io from "socket.io-client";
import "../styles/game.css";
import "../styles/globals.css";
import p5 from "p5";
import Renderer from "./renderer";
import InputControl from "./input";
import { Player } from "./player";
import { IWeaponData, IWeaponStats, IMap, IBulletData } from "./utils";
import Particule from "./particules/particule";
import ExplosionArea from "./particules/explosionArea";
import { gameWinner, gameResult, gameEndingScreen, roundNumberElt, redScoreElt, blueScoreElt, timeleftSpan, roundStartsinIndic, showWeaponStatsBtn, showWeaponStats, hideWeaponStats } from "./ui";


const socket = io();
let players: Player[] = [];
let bullets: IBulletData[] = [];
const particules: Particule[] = [];
let nextWeapon: IWeaponData;
let nextWeaponStats: IWeaponStats;
export let weapon: IWeaponData;
export let weaponStats: IWeaponStats;
export let player: Player;
let gameStarted = false;
let gameEnded = false;
let roundStarted = false;
let roundStartTime: number;
let roundWaittingToStart: boolean;
let roundWaittingStartTime: number;
let redteamScore = 0;
let blueteamScore = 0;
let round = 1;
let map: IMap;
export let gameSettings: {
  map_dimensions: { w: number; h: number };
  mode: "1v1" | "2v2";
  scl: number;
  flipScreen: boolean;
};
let glowImg: p5.Image;
export const blur = document.querySelector(".blur") as HTMLDivElement;
const roundResults = document.querySelector(".round-result") as HTMLDivElement;
const roundResultState = document.querySelector(".state") as HTMLDivElement;
const roundWinner = document.querySelector(".winner") as HTMLDivElement;
const windowWidth = window.innerWidth;
const windowHeight = window.innerHeight;

const sketch = (p: p5) => {
  let renderer: Renderer;
  let inputControl: InputControl;
  p.preload = () => {
    glowImg = p.loadImage("/glow.png");
  }
  p.setup = () => {
    p.createCanvas(windowWidth, windowHeight);
    renderer = new Renderer(p, glowImg);
    inputControl = new InputControl(p, socket);
    p.imageMode(p.CENTER);
    p.rectMode(p.CENTER);
    p.frameRate(60);
  };
  p.draw = () => {
    if(p.width >= p.height) {
      gameSettings.flipScreen = false;
      gameSettings.scl = p.min(
        p.min(1, p.width/gameSettings.map_dimensions.w),
        p.min(1, p.height/gameSettings.map_dimensions.h)
      );
    }else{
      gameSettings.flipScreen = true;
      gameSettings.scl = p.min(
        p.min(1, p.width/gameSettings.map_dimensions.h),
        p.min(1, p.height/gameSettings.map_dimensions.w)
      );
    }
    p.translate(p.width/2, p.height/2);
    if(gameSettings.flipScreen) {
      p.rotate(p.PI/2);
    }
    p.scale(gameSettings.scl, gameSettings.scl);
    p.translate(-p.width/2, -p.height/2);

    roundNumberElt.innerText = `${round}`;
    if(roundWaittingToStart) {
      timeleftSpan.innerText = Math.ceil((roundWaittingStartTime + roundStartTime - new Date().getTime())/1000) + "sec";
    }
    if(roundStarted){
      inputControl.sendInputData();
    }
    renderer.background();
    renderer.showMap(map);
    renderer.showParticules(particules);
    renderer.showPlayers(players);
    renderer.showBullets(bullets);
    if(p.mouseIsPressed && roundStarted) {
      inputControl.shoot();
    }
  };
  p.windowResized = ()=>{
    p.resizeCanvas(window.innerWidth, window.innerHeight);
  }
  p.keyPressed = ()=>{
    if(p.keyCode === 32 && roundStarted) {
      inputControl.shoot();
    }
  }
};

showWeaponStatsBtn.addEventListener("click", ()=>showWeaponStats(weaponStats));

socket.on("update", (msg: any) => {
  if(gameStarted){
    weapon = nextWeapon;
    weaponStats = nextWeaponStats
    bullets = msg.bulletData as IBulletData[];
    for (let i = 0; i < msg.playersData.length; i++) {
      players[i].update(msg.playersData[i]);
    }
    for(let i=0;i<msg.bulletsRemoved.length;i++) {
      if(msg.bulletsRemoved[i].explosionRange) {
        const bullet = msg.bulletsRemoved[i];
        particules.push(new ExplosionArea(bullet.pos.x, bullet.pos.y, bullet.explosionRange, bullet.team));
      }
    }
  }
})
socket.on("game-ended", (winner) => {
  if(!winner) {
    alert("a user has disconnected");
    location.pathname = "/";
  }else{
    gameEnded = true;
    roundResults.classList.add("not-active");
    gameEndingScreen.classList.remove("not-active");
    gameWinner.innerText = winner + " team has won the game";
    if(winner === player.team) {
      if(gameSettings.mode === "1v1") {
        gameResult.innerText = "You have won the game!"
      }else{
        gameResult.innerText = "Your team has won the game!"
      }
    }else{
      if(gameSettings.mode === "1v1") {
        gameResult.innerText = "You have lost the game :("
      }else{
        gameResult.innerText = "Your team has lost the game :("
      }
    }
  }
});
socket.on("round-ended", (msg: any)=>{
  round++;
  redteamScore += +(msg.winnerTeam === "red");
  blueteamScore += +(msg.winnerTeam === "blue");
  nextWeaponStats = msg.weaponStats;
  nextWeapon = msg.weapon;

  roundStarted = false;
  for(let i=0;i<players.length;i++){
    players[i].currentGunPos = 0;
  }
  blur.classList.remove("not-active");
  roundResults.classList.remove("not-active");
  roundResultState.innerText = msg.winnerTeam === player.team ? "Victory" : "Defeat";
  roundWinner.innerText = msg.winnerTeam + " has won the round";
  redScoreElt.innerText = "red: " + redteamScore;
  blueScoreElt.innerText = "blue: " + blueteamScore;
  if(!msg.lastRound) {
    console.log("yes?")
    setTimeout(()=>{
      weaponStats = nextWeaponStats;
      weapon = nextWeapon;
      roundResults.classList.add("not-active");
      showWeaponStats(nextWeaponStats);
      showWeaponStatsBtn.classList.remove("not-active");
      roundStartsinIndic.classList.remove("not-active");
      roundWaittingToStart = true;
      roundWaittingStartTime = new Date().getTime();
    }, 2000);
  }
})
socket.on("round-started", ()=>{
  if(!gameEnded) {
    roundWaittingToStart = false;
    roundStarted = true;
    weapon = nextWeapon;
    hideWeaponStats();
    showWeaponStatsBtn.classList.add("not-active");
    roundStartsinIndic.classList.add("not-active");
  }
})
socket.on("game-started", (msg: any) => {
  console.log(msg.capturingFlagMaxDist);
  roundWaittingToStart = true;
  roundWaittingStartTime = new Date().getTime();
  roundStartTime = msg.roundStartTime;
  if (!gameStarted) {
    setTimeout(()=>{
      console.log("round started!");
      hideWeaponStats();
      showWeaponStatsBtn.classList.add("not-active");
      roundStartsinIndic.classList.add("not-active");
      roundStarted = true;
      roundWaittingToStart = false;
    }, msg.roundStartTime);

    nextWeapon = msg.weapon;
    weapon = msg.weapon;
    nextWeaponStats = msg.weaponStats;
    weaponStats = msg.weaponStats;

    console.log(nextWeapon);
    map = msg.map;
    for (let i = 0; i < msg.playersData.length; i++) {
      players.push(
        new Player(
          msg.playersData[i].pos,
          msg.playersData[i].ori,
          msg.playersData[i].team,
          msg.playersData[i].shape,
          msg.playerSize
        )
      );
      if (i === msg.index) {
        player = players[players.length - 1];
      }
    }
    gameSettings = { 
      mode: msg.mode, 
      map_dimensions: msg.map_dimensions,
      flipScreen: false,
      scl: 1
    };
    gameStarted = true;
    new p5(sketch);
    showWeaponStats(weaponStats);
  }
});
socket.emit(
  "connect-game",
  {
    gameId: localStorage.getItem("id"),
    authKey: localStorage.getItem("auth-key"),
    mode: localStorage.getItem("mode"),
  },
  (res: any) => {
    if (!res.success) {
      alert(
        "you don't have the authentication to join this game or something went wrong :( if you think this is an error plz report it"
      );
      location.pathname = "/";
    }
  }
);
