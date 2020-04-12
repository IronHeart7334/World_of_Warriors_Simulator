import {verifyType, TYPES} from "./verifyType.js";

/*
The WarriorAttribute class serves as the root
for the warrior related classes used by the program.
It ensures shared functionality between many
different classes.
*/
class WarriorAttribute {
    constructor(name){
        verifyType(name, TYPES.string);
        this.name = name;
    }
}

export {
    WarriorAttribute
};
