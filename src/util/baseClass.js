import {verifyType, TYPES} from "./verifyType.js";

/*
The AbstractBaseClass class serves as the root
for most of the classes used by the program.
It ensures shared functionality between many
different classes.

This class will later be refactored for the
various warrior-related classes
*/
class AbstractBaseClass {
    constructor(name){
        verifyType(name, TYPES.string);
        this.name = name;
    }
}

export {
    AbstractBaseClass
};
