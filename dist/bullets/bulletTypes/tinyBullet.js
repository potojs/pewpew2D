"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bullet_1 = __importDefault(require("../bullet"));
class default_1 extends bullet_1.default {
    constructor(pos, angle, team) {
        super(pos, angle, 3, 8, 12, 1 / 8 * Math.PI, 400, false, team);
    }
}
exports.default = default_1;
