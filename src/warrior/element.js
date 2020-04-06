import {verifyType, TYPES, notNull} from "../util/verifyType.js";

/*
The Element class is used to calculate how
much elemental damage warriors deal to each
other, based on their elemental matchup.
*/
class Element{
    constructor(name, color, weakness){
        verifyType(name, TYPES.string);
        verifyType(color, TYPES.string);
        verifyType(weakness, TYPES.string);
        this.name = name;
	    this.color = color;
	    this.weakness = weakness;
	}

    getMultiplierAgainst(target){
        notNull(target);
        let ele = null;
        let ret = 0;
        if(target instanceof Element){
            ele = target;
        } else if(target instanceof Warrior){
            ele = target.element;
        } else {
            throw new Error("parameter must be either an Element or a Warrior");
        }

        if(this.weakness === ele.name){
            ret = 0.7;
        } else if(ele.weakness === this.name){
            ret = 1.7;
        } else {
            ret = 1.0;
        }

        return ret;
    }

    toString(){
        return this.name;
    }
}

const ELEMENTS = new Map();
ELEMENTS.set("f", new Element("Fire", "rgb(255, 0, 0)", "Water"));
ELEMENTS.set("e", new Element("Earth", "rgb(0, 255, 0)", "Fire"));
ELEMENTS.set("a", new Element("Air", "rgb(255, 255, 0)", "Earth"));
ELEMENTS.set("w", new Element("Water", "rgb(0, 0, 255)", "Air"));
ELEMENTS.set("n", new Element("Null", "rgb(100, 100, 100)", ""));

/*
Returns the element whose first letter
is the same of that of the given parameter.
*/
function getElementByName(name){
    verifyType(name, TYPES.string);
    let ret = null;
    let letter = name[0].toLowerCase();

    if(ELEMENTS.has(letter)){
        ret = ELEMENTS.get(letter);
    } else {
        let options = "";
        ELEMENTS.forEach((value, key)=>{
            options += `\'${key}\' (${value.name})\n`;
        });
        throw new Error(`There is no element starting with \'${letter}\'. Options are\n${options} Note that this is case insensitive`);
    }
    return ret;
}

export {
    getElementByName
};
