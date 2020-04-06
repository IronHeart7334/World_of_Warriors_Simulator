import {TYPES, verifyType, verifyClass, notNull} from "./verifyType.js";
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

    run(target){
        this.func(target);
        if(this.maxDur !== INTERMINABLE){
            this.timeRemaining--;
            if(this.timeRemaining <= 0){
                this.shouldTerminate = true;
            }
        }
    }
}

const INTERMINABLE = "forever";

class TerminalNode {
    constructor(terminable){
        verifyClass(terminable, Terminable);
        this.terminable = terminable;
        this.prev = null;
        this.next = null;
    }
}

class TerminableList {
    constructor(target){
        notNull(target);
        this.target = target;
        this.head = null;
        this.tail = null;
    }

    add(terminable){
        verifyClass(terminable, Terminable);
        let newNode = new TerminalNode(terminable);
        if(this.tail === null){
            //has no nodes yet
            this.head = newNode;
            this.tail = newNode;
        } else {
            this.tail.next = newNode;
            newNode.prev = this.tail;
            this.tail = newNode;
        }
    }

    runAll(){
        let currNode = this.head;
        let currTerm;
        while(currNode !== null){
            currTerm = currNode.terminable;
            currTerm.run(this.target);
            if(currTerm.shouldTerminate){
                //delete current node
                if(currNode.prev === null){
                    //delete head
                    this.head = currNode.next;
                } else {
                    currNode.prev.next = currNode.next;
                }
                if(currNode.next === null){
                    //delete tail
                    this.tail = currNode.prev;
                } else {
                    currNode.next.prev = currNode.prev;
                }
            }
            currNode = currNode.next;
        }
    }
}


export {
    Terminable,
    TerminableList,
    INTERMINABLE
};
