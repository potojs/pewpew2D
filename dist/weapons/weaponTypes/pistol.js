"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pistol = void 0;
const weapon_1 = __importDefault(require("../weapon"));
const bulletManager_1 = require("../../bullets/bulletManager");
class Pistol extends weapon_1.default {
    constructor() {
        super("Pistol", 30, 10, 5, 250, bulletManager_1.EBullet.PistolBullet);
    }
}
exports.Pistol = Pistol;
