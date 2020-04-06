import {verifyType, TYPES} from "./verifyType.js";

/*
The AbstractBaseClass class serves as the root
for most of the classes used by the program.
It ensures shared functionality between many
different classes
*/
class AbstractBaseClass {
    constructor(name){
        verifyType(name, TYPES.string);
        this.name = name;
    }

    copy(args={}){
        throw new Error("classes inheriting from AbstractBaseClass must implement copy method");
    }
}

export {
    AbstractBaseClass
};
