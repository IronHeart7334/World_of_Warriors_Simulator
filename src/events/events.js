

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
}

const EVENT_TYPE = {
    warriorDamaged: 0,
    warriorHealed: 1,
    warriorKOed: 2,
    warriorUpdated: 3
};

export {
    EventListenerRegister,
    EVENT_TYPE
};
