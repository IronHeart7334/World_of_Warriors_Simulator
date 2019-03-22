class Element{
    constructor(name, color, weakness){
	    this.name = name;
	    this.color = color;
	    this.weakness = weakness;
	}
}

export function getElement(name){
    let ret = NO_ELE;
    switch(name[0].toLowerCase()){
        case 'w':
            ret = WATER;
            break
        case 'f':
            ret = FIRE;
            break;
        case 'e':
            ret = EARTH;
            break;
        case 'a':
            ret = AIR;
            break;
        default:
            ret = NO_ELE;
            break;
    }
    return ret;
}

export const FIRE = new Element("Fire", "rgb(255, 0, 0)", "Water");
export const EARTH = new Element("Earth", "rgb(0, 255, 0)", "Fire");
export const AIR = new Element("Air", "rgb(255, 255, 0)", "Earth");
export const WATER = new Element("Water", "rgb(0, 0, 255)", "Air");
export const NO_ELE = new Element("Null", "rgb(100, 100, 100)", undefined);

export let ELEMENTS = [
    FIRE,
    EARTH,
    AIR,
    WATER,
    NO_ELE
];