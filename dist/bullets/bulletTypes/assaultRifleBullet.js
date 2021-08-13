"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bullet_1 = __importDefault(require("../bullet"));
class default_1 extends bullet_1.default {
    constructor(pos, angle, team) {
        super(pos, angle, 5, 20, 15, 1 / 180 * Math.PI, 1000, false, team);
    }
}
exports.default = default_1;
