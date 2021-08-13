import map_1 from './maps/map-1.json'; 
import { IMap } from "./utils";

class MapManager {
    maps: IMap[]
    constructor(){
        this.maps = [
            map_1
        ]
    }
    getRandom(): IMap {
        return this.maps[Math.floor(this.maps.length * Math.random())]
    }
}
export default new MapManager();