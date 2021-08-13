import { ICoordinates } from "../utils";

interface Particule {
    pos: ICoordinates;
    show: (...args: any)=>void;
    update: ()=>void;
}
export default Particule;