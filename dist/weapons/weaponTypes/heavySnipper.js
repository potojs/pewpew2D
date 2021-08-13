"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HeavySniper = void 0;
const weapon_1 = __importDefault(require("../weapon"));
const bulletManager_1 = require("../../bullets/bulletManager");
class HeavySniper extends weapon_1.default {
    constructor() {
        super("Heavy Snipper", 50, 8, 20, 2000, bulletManager_1.EBullet.HeavySniperBullet);
    }
}
exports.HeavySniper = HeavySniper;
