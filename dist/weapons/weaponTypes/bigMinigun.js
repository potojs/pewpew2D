"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BigMiniGun = void 0;
const weapon_1 = __importDefault(require("../weapon"));
const bulletManager_1 = require("../../bullets/bulletManager");
class BigMiniGun extends weapon_1.default {
    constructor() {
        super("Big Minigun", 40, 12, 2, 100, bulletManager_1.EBullet.TinyBullet);
    }
}
exports.BigMiniGun = BigMiniGun;
