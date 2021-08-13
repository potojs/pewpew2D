"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BouncySniper = void 0;
const weapon_1 = __importDefault(require("../weapon"));
const bulletManager_1 = require("../../bullets/bulletManager");
class BouncySniper extends weapon_1.default {
    constructor() {
        super("Bouncy Snipper", 40, 10, 10, 1000, bulletManager_1.EBullet.BouncySniperDecentBullet);
    }
}
exports.BouncySniper = BouncySniper;
