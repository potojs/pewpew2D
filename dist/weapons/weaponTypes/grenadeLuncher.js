"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GrenadeLuncher = void 0;
const weapon_1 = __importDefault(require("../weapon"));
const bulletManager_1 = require("../../bullets/bulletManager");
class GrenadeLuncher extends weapon_1.default {
    constructor() {
        super("Grenade Luncher", 40, 15, 5, 500, bulletManager_1.EBullet.BigGrenade);
    }
}
exports.GrenadeLuncher = GrenadeLuncher;
