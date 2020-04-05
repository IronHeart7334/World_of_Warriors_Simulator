/*
This module is used to verify the types of parameters passed to functions.
All of these functions check to see if the given input meets a certain condition,
if the condition is not met, throws an Error.

All of these functions should be invoked on each parameter passed into functions.

Module summary:
-TYPES: object
-notNull(val)
-verifyType(val, type)*
-inRange(min, num, max)
-notNegative(num)
-positive(num)
-verifyClass(val, className)*

(*see individual function documentation)
*/

/*
 * Used by verifyType.
 * Acts as an enum so that types are refered to in a consistant way
 */
const TYPES = {
    boolean : typeof true,
    number : typeof 3.14,
    string : typeof "hello?",
    object : typeof {},
    symbol : "symbol",
    "function" : typeof function(){}
};

/*
 * Checks if the given value is null or undefined
 */
function notNull(val){
    if(val === null || val === undefined){
        throw new Error("Value has not been initialized");
    }
    return true;
}

/*
 * Checks if either parameter is null,
 * then checks if val is of the given type.
 *
 * type parameter should be obtained from this module's TYPE constant
 *
 * Usage:
 *  verifyType(5, TYPE.number);
 *  verifyType("hi", TYPE.string);
 *  etc.
 *
 * Common mistakes:
 *  verifyType(5, "number"); //may cause inconsistancies. Use TYPE.number
 *  verifyType(myObj, myClass); //use verifyClass instead
 */
function verifyType(val, type){
    notNull(val);
    notNull(type);

    if(!TYPES.hasOwnProperty(type)){
        throw new Error("Invalid type: " + type + ". Did you mean isInstanceOf(val, className)?");
    } else if(typeof val !== type){
        throw new Error(val + " must be of type " + type + ", not " + typeof val);
    }
    return true;
}

/*
verifies that num is between min and max
(inclusive of both endpoints)
*/
function inRange(min, num, max){
    [min, num, max].forEach((n)=>verifyType(n, TYPES.number));
    if(min > max){
        throw new Error("min must be less than max");
    }
    if(min > num){
        throw new Error("num must be more than or equal to min");
    }
    if(num > max){
        throw new Error("num must be less than or equal to max")
    }
}

function notNegative(num){
    verifyType(num, TYPES.number);
    if(num < 0){
        throw new Error("num must not be negative");
    }
}

function positive(num){
    verifyType(num, TYPES.number);
    if(num <= 0){
        throw new Error("num must be positive");
    }
}

/*
 * checks if the given value inherits from a class with the given name.
 * className can be either a string, function, or class (classes are functions, oddly enough)
 *
 * Note that this function DOES check if the given val is a subclass of the given className
 */
function verifyClass(val, className){
    notNull(val);
    notNull(className);

    if(typeof className === TYPES.function){
        //classes are functions, apparently
        className = className.name;
    }

    verifyType(className, TYPES.string);
    let proto = Object.getPrototypeOf(val);
    while(proto !== null){
        if(proto.constructor.name === className){
            break;
        }else{
            proto = Object.getPrototypeOf(proto);
        }
    }
    if(proto === null){
        throw new Error(val + " must be an instance of " + className);
    }

    return true;
}

/*
 * Returns the given parameter,
 * converted to an array if it
 * is not one already
 */
function toArray(items){
    let ret = [];
    if(items !== null && items !== undefined){
        if(Array.isArray(items)){
            ret = items;
        } else {
            ret.push(items);
        }
    }
    return ret;
}

export {
    TYPES,
    notNull,
    verifyType,
    inRange,
    notNegative,
    positive,
    verifyClass,
    toArray
};
