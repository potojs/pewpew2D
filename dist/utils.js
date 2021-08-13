"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = exports.genAuthKey = exports.isInsideBoundries = exports.Vector = exports.clamp = exports.map = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const uuid_1 = require("uuid");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function map(n, start1, stop1, start2, stop2) {
    return ((n - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
}
exports.map = map;
;
function clamp(val, min, max) {
    if (val < min) {
        return min;
    }
    else if (val > max) {
        return max;
    }
    return val;
}
exports.clamp = clamp;
class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    copy() {
        return new Vector(this.x, this.y);
    }
    set(x, y) {
        this.x = x;
        this.y = y;
    }
    add(vec) {
        this.x += vec.x;
        this.y += vec.y;
    }
    mag() {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }
    setMag(newMag) {
        const dir = this.dir();
        this.x = Math.cos(dir) * newMag;
        this.y = Math.sin(dir) * newMag;
    }
    normalize() {
        this.setMag(1);
    }
    mult(scalar) {
        this.x *= scalar;
        this.y *= scalar;
    }
    dir() {
        return Math.atan2(this.y, this.x);
    }
}
exports.Vector = Vector;
function isInsideBoundries(boundries, pos) {
    return (pos.x > 0 &&
        pos.x < boundries.w &&
        pos.y > 0 &&
        pos.y < boundries.h);
}
exports.isInsideBoundries = isInsideBoundries;
function genAuthKey() {
    const id = uuid_1.v4();
    const authKey = jsonwebtoken_1.default.sign(id, process.env.SECRET_KEY);
    return { id, authKey };
}
exports.genAuthKey = genAuthKey;
function authenticate(id, authKey, path) {
    if (id === path) {
        try {
            const decoded = jsonwebtoken_1.default.verify(authKey, process.env.SECRET_KEY);
            if (decoded === id) {
                return true;
            }
        }
        catch (err) {
            console.log(err);
        }
    }
    return false;
}
exports.authenticate = authenticate;
