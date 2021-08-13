"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const map_1_json_1 = __importDefault(require("./maps/map-1.json"));
class MapManager {
    constructor() {
        this.maps = [
            map_1_json_1.default
        ];
    }
    getRandom() {
        return this.maps[Math.floor(this.maps.length * Math.random())];
    }
}
exports.default = new MapManager();
