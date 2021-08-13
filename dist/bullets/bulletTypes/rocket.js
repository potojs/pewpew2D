"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const grenade_1 = __importDefault(require("../grenade"));
class default_1 extends grenade_1.default {
    constructor(pos, angle, team) {
        super(pos, angle, 8, 60, 100, 15, 1 / 18 * Math.PI, 1000, false, team);
    }
}
exports.default = default_1;
