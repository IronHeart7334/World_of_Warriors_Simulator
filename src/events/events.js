import {verifyClass, verifyType, TYPES, inRange} from "../util/verifyType.js";
import {Terminable, TerminableList, INTERMINABLE} from "../util/terminable.js";
import {Warrior} from "../warrior/warrior.js";
import {Attack} from "../warrior/specials.js";

/*
The EventListenerRegister class
is used to store listeners for
various events, keeping them all
in one place.
*/
class EventListenerRegister {
    constructor(){
        this.listeners = new Map();
    }

    clear(){
        this.listeners.clear();
    }

    addEventListener(eventListener){
        verifyClass(eventListener, EventListener);
        if(!this.listeners.has(eventListener.eventType)){
            this.listeners.set(eventListener.eventType, new TerminableList());
        }
        this.listeners.get(eventListener.eventType).add(EventListener);
    }

    fireEventListeners(event){
        verifyClass(event, Event);
        if(this.listeners.has(event.eventType)){
            this.listeners.get(event.eventType).run(event);
        }
    }
};



class EventListener extends Terminable{
    //remember: id is a string
    constructor(id, eventType, func, maxDur=INTERMINABLE){
        super(id, func, maxDur);
        inRange(0, eventType, EVENT_NAMES.length - 1);
        this.eventType = eventType;
    }

    fire(event){
        verifyClass(event, Event);
        if(event.eventType !== this.eventType){
            mismatchedEventTypeError(this.eventType, event.eventType);
        }
        run(event);
    }
};

let nextEventId = 0;
class Event {
    constructor(eventType){
        inRange(0, eventType, EVENT_NAMES.length - 1);
        this.eventType = eventType;
        this.id = nextEventId;
        nextEventId++;
    }
};

//if I need pre-hit vs post-hit, add a transitionToPost method
//which is invoked after firing it as a prehitevent,
//converting its type to post-hit.
class HitEvent extends Event {
    constructor(hitter, hittee, using, physDmg, eleDmg){
        super(EVENT_TYPE.hit);
        verifyClass(hitter, Warrior);
        verifyClass(hittee, Warrior);
        verifyClass(using, Attack);
        verifyType(physDmg, TYPES.number);
        verifyType(eleDmg, TYPES.number);
        this.hitter = hitter;
        this.hittee = hittee;
        this.attackUsed = using;
        this.physDmg = physDmg;
        this.eleDmg = eleDmg;
    }
    toString(){
        return `Event #${this.id}: ${this.hitter.name} struck ${this.hittee.name} for (${this.physDmg}, ${this.eleDmg}) damage using ${this.attackUsed.name}`;
    }
};
//this will be used for shell
class DamageEvent extends Event {
    constructor(warriorDamaged, amount){
        super(EVENT_TYPE.warriorDamaged);
        verifyClass(warriorDamaged, Warrior);
        verifyType(amount, TYPES.number);
        this.warriorDamaged = warriorDamaged;
        this.amount = amount;
    }
};
class HealEvent extends Event {
    constructor(warriorHealed, amountHealed){
        super(EVENT_TYPE.warriorHealed);
        verifyClass(warriorHealed, Warrior);
        verifyType(amountHealed, TYPES.number);
        this.warriorHealed = warriorHealed;
        this.amount = amountHealed;
    }
}
class KOEvent extends Event {
    constructor(warriorKOed){
        super(EVENT_TYPE.warriorKOed);
        verifyClass(warriorKOed, Warrior);
        this.warriorKOed = warriorKOed;
    }
};
class UpdateEvent extends Event {
    constructor(warrior){
        super(EVENT_TYPE.warriorUpdated);
        verifyClass(warrior, Warrior);
        this.warriorUpdated = warrior;
    }
    toString(){
        return `Event #${this.id}: ${this.warriorUpdated} was updated`;
    }
};



const EVENT_TYPE = {};
const EVENT_NAMES = [
    "hit",
    "warriorDamaged",
    "warriorHealed",
    "warriorKOed",
    "warriorUpdated"
];
for(let i = 0; i < EVENT_NAMES.length; i++){
    EVENT_TYPE[EVENT_NAMES[i]] = i;
}


function mismatchedEventTypeError(shouldReceive, receivedInstead){
    inRange(0, shouldReceive, EVENT_NAMES.length - 1);
    inRange(0, receivedInstead, EVENT_NAMES.length - 1);
    throw new Error(`Mismatched event types: expected EVENT_TYPE.${EVENT_NAMES[shouldReceive]}, but instead received EVENT_TYPE.${EVENT_NAMES[receivedInstead]}`);
}



export {
    EventListenerRegister,
    EventListener,
    HitEvent,
    DamageEvent,
    HealEvent,
    KOEvent,
    UpdateEvent,
    EVENT_TYPE
};
