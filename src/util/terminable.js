import {TYPES, verifyType} from "./verifyType.js";
/*
This module contains functionality pretaining to
temporary effects that are applied to warriors.
*/


class Terminable {
    constructor(id, func, maxDur=INTERMINABLE){
        verifyType(id, TYPES.string);
        verifyType(func, TYPES.function);
        this.id = id;
        this.func = func;
        this.maxDur = maxDur;
        this.timeRemaining = maxDur;
        this.shouldTerminate = false;
    }

    reset(){
        this.timeRemaining = this.maxDur;
        this.shouldTerminate = false;
    }

    run(onWarrior){
        this.func(onWarrior);
        if(this.maxDur !== INTERMINABLE){
            this.timeRemaining--;
            if(this.timeRemaining === 0){
                this.shouldTerminate = true;
            }
        }
    }
}

const INTERMINABLE = "forever";

export {
    Terminable,
    INTERMINABLE
};
