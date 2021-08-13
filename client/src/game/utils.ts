export interface IWeaponStats {
    damage: string;
    bulletRange: string;
    bulletSpeed: string;
    bulletSize: string;
    accuracyMistake: string;
    doesBulletBounce: string;
    name: string;
    bulletType: string;
    explosionRange: string;
    [index: string]: any
}
export interface IWeaponData {
    width: number;
    height: number;
    recoil: number;
    reload: number;
}

export interface ICoordinates { x: number; y: number; }
export interface IWall extends ICoordinates {
    w: number;
    h: number;
}
export const colorRed = [255, 100, 100];
export const colorBlue = [0, 200, 255];
export interface IBulletData {
    pos: ICoordinates;
    bulletSize: number;
    team: "red" | "blue";
}
export interface IMap {
    flagPos: ICoordinates,
    walls: IWall[]
}