"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RocketLuncher = void 0;
const weapon_1 = __importDefault(require("../weapon"));
const bulletManager_1 = require("../../bullets/bulletManager");
class RocketLuncher extends weapon_1.default {
    constructor() {
        super("Rocket Luncher", 50, 18, 10, 1200, bulletManager_1.EBullet.Rocket);
    }
}
exports.RocketLuncher = RocketLuncher;
