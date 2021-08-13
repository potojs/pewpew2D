import p5 from "p5";
import { gameSettings } from "./game";
import Particule from "./particules/particule";
import { Player } from "./player";
import { colorBlue, colorRed, IBulletData, ICoordinates, IMap, IWall } from "./utils";

export default class  {
    mapWidth: number;
    mapHeight: number;
    mapMarginX: number;
    mapMarginY: number;

    constructor(
        private p: p5,
        private glowImg: p5.Image
    ){
        this.mapWidth = gameSettings.map_dimensions.w;
        this.mapHeight = gameSettings.map_dimensions.h;
        this.mapMarginX = (p.width - this.mapWidth) / 2;
        this.mapMarginY = (p.height - this.mapHeight) / 2;
    }
    public showParticules(particules: Particule[]) {
        for(let i=0;i<particules.length;i++){
            particules[i].update();
            particules[i].show(this.p, this.mapMarginX, this.mapMarginY);
        }
    }
    public showBullets(bullets: IBulletData[]) {
        this.p.noStroke();
        for(let i=0;i<bullets.length;i++){
            if(bullets[i].team === "red"){
                this.p.fill(colorRed);
                this.p.tint(colorRed);
            }else{
                this.p.fill(colorBlue);
                this.p.tint(colorBlue);
            }
            this.p.ellipse(
                bullets[i].pos.x + this.mapMarginX,
                bullets[i].pos.y + this.mapMarginY,
                bullets[i].bulletSize * 2
            );
            this.p.image(this.glowImg, 
                bullets[i].pos.x + this.mapMarginX, 
                bullets[i].pos.y + this.mapMarginY,
                bullets[i].bulletSize*2, bullets[i].bulletSize*2
            );
        }
    }
    public showMap(map: IMap) {
        this.p.push();
        for(const wall of map.walls) {
            this.showWall(wall);
        }
        this.p.pop();
    }
    public showWall(wall: IWall) {
        this.p.rectMode(this.p.CORNER);
        this.p.noStroke();
        // this.p.strokeWeight(2);
        this.p.fill(100);
        this.p.rect(
            wall.x + this.mapMarginX, 
            wall.y + this.mapMarginY, 
            wall.w, wall.h);
    }
    public background() {
        this.mapMarginX = (this.p.width - this.mapWidth)/2;
        this.mapMarginY = (this.p.height - this.mapHeight)/2;
        this.p.background(0, 5, 10);
        this.p.fill(0, 20, 30);
        this.p.noStroke();
        this.p.rect(this.p.width/2, this.p.height/2, this.mapWidth, this.mapHeight);
    }
    public showPlayers(players: Player[]) {
        for(const player of players) {
            player.show(this.p, this.glowImg);
        }
    }
}
