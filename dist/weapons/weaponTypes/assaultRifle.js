"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssaultRifle = void 0;
const weapon_1 = __importDefault(require("../weapon"));
const bulletManager_1 = require("../../bullets/bulletManager");
class AssaultRifle extends weapon_1.default {
    constructor() {
        super("Assault Rifle", 40, 8, 4, 150, bulletManager_1.EBullet.AssaultRifleBullet);
    }
}
exports.AssaultRifle = AssaultRifle;
