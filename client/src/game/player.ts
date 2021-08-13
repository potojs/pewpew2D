import { rejects } from "assert";
import p5 from "p5";
import { gameSettings, weapon } from "./game";
import { ICoordinates, colorBlue, colorRed } from "./utils";

export class Player {
  health: number;
  currentGunPos: number;
  canShoot: boolean;
  prevServerPos: ICoordinates;
  pos: ICoordinates;
  time1: number;
  time2: number;
  deltaTime: number;

  constructor(
    public serverPos: ICoordinates,
    public ori: number,
    public team: "blue" | "red",
    public shape: "triangle" | "circle" | "pentagon" | "square",
    public size: number
  ) {
    this.prevServerPos = { x: 0, y: 0 };
    this.pos = { x: 0, y: 0 };
    this.health = 100;
    this.currentGunPos = 0;
    this.canShoot = true;
    this.time1 = 0;
    this.time2 = 0;
    this.deltaTime = 0;
  }
  update({ health, pos, ori }: { health: number; pos: ICoordinates; ori: number }) {
    this.time1 = new Date().getTime();
    this.deltaTime = this.time1 - this.time2 
    if(this.currentGunPos < 0){
      this.currentGunPos++;
    }
    this.prevServerPos = {
      x: this.serverPos.x,
      y: this.serverPos.y
    }
    this.serverPos = pos;
    this.ori = ori;
    this.health = health;
    this.time2 = new Date().getTime();
  }
  show(p: p5, glowImg: p5.Image) {
    let weaponDist = 0;
    p.push();
    const timeFromLastUpdate = new Date().getTime() - this.time2;
    const lerpAmount = p.min(timeFromLastUpdate/this.deltaTime, 1);
    this.pos = {
      x: p.lerp(this.prevServerPos.x, this.serverPos.x, lerpAmount),
      y: p.lerp(this.prevServerPos.y, this.serverPos.y, lerpAmount)
    };
    p.translate(
      this.pos.x + (p.width - gameSettings.map_dimensions.w) / 2,
      this.pos.y + (p.height - gameSettings.map_dimensions.h) / 2
    );
    
    p.rotate(this.ori);
    const colorGray = p.color(100);
    if (this.team === "blue") {
      p.fill(p.lerpColor(p.color(colorBlue), colorGray, 1 - this.health / 100));
    } else {
      p.fill(p.lerpColor(p.color(colorRed), colorGray, 1 - this.health / 100));
    }
    p.noStroke();
    switch (this.shape) {
      case "triangle":
        const triangleBase = p.sqrt(
          (this.size ** 2 * p.PI * 2) / p.sin(p.PI / 3)
        );
        const triangleHeight = p.sin(p.PI / 3) * triangleBase;
        const triangleRadius = triangleBase / 2 / p.sin(p.PI / 3);
        p.triangle(
          triangleRadius,
          0,
          triangleRadius - triangleHeight,
          triangleBase / 2,
          triangleRadius - triangleHeight,
          -triangleBase / 2
        );
        weaponDist = triangleRadius + 2;
        break;
      case "circle":
        p.ellipse(0, 0, this.size * 2);
        weaponDist = this.size + 2;
        break;
      case "pentagon":
        const radius = p.sqrt(
          (this.size ** 2 * p.PI) / (p.sin(p.PI / 5) * p.cos(p.PI / 5) * 5)
        );
        p.beginShape();
        for (let i = 0; i < 5; i++) {
          p.vertex(
            p.cos((i * p.PI * 2) / 5) * radius,
            p.sin((i * p.PI * 2) / 5) * radius
          );
        }
        p.endShape();
        weaponDist = radius + 2;
        break;
      case "square":
        const side = p.sqrt(this.size ** 2 * p.PI);
        p.rect(0, 0, side, side);
        weaponDist = side / 2 + 2;
        break;
    }

    if(this.health > 0){
      if (this.team === "blue") {
        p.fill(colorBlue);
      } else {
        p.fill(colorRed);
      }
      p.rect(weaponDist + weapon.width / 2 + this.currentGunPos, 0, weapon.width, weapon.height);

      if (this.team === "blue") {
        const faintBlue = p.color(colorBlue);
        faintBlue.setAlpha(50);
        p.tint(p.lerpColor(p.color(colorBlue), faintBlue, 1 - this.health / 100));
      } else {
        const faintRed = p.color(colorRed);
        faintRed.setAlpha(50);
        p.tint(p.lerpColor(p.color(colorRed), faintRed, 1 - this.health / 100));
      }
      p.image(glowImg, 0, 0, this.size * 3, this.size * 3);
    }
    p.pop();
  }
}
