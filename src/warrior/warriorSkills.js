import {verifyType, TYPES, inRange, verifyClass} from "../util/verifyType.js";
import {PartialMatchingMap} from "../util/partialMap.js";
import {NormalMove} from "./specials.js";
import {Warrior} from "./warrior.js";
import {EventListener, EVENT_TYPE} from "../events/events.js";

class WarriorSkill{
    constructor(name, pip=1){
        verifyType(name, TYPES.string);
        inRange(1, pip, 5);
        this.name = name;
        this.pip = pip;
        this.user = undefined;
    }

    setUser(warrior){
        verifyClass(warrior, Warrior);
        this.user = warrior;
    }

    apply(){
        throw new Error("Method apply not set for " + this.name);
    }

    checkForTrigger(){
        throw new Error("Method checkForTrigger not set for " + this.name);
    }

    run(){
        throw new Error("Method run not set for " + this.name);
    }

    copy(){
        throw new Error("Method copy not set for " + this.name);
    }
}

class CriticalHit extends WarriorSkill{
    constructor(pip=1){
        super("Critical Hit", pip);
    }

    apply(){
        let user = this.user;
        user.eventListener(new EventListener(
            "Critical Hit",
            EVENT_TYPE.hit,
            (hitEvent)=>{
                if(hitEvent.hitter === user && hitEvent.attackUsed instanceof NormalMove){
                    if(this.checkForTrigger()){
                        this.run(hitEvent);
                    }
                }
            }
        ));
    }

    checkForTrigger(){
        return Math.random() <= 0.24; //change this to use this.pip in calculation
    }

    run(hitEvent){
        verifyClass(hitEvent, HitEvent);
        console.log("Critical hit!");
        hitEvent.physDmg *= 1.24;
        hitEvent.eleDmg *= 1.24;
    }

    copy(){
        return new CriticalHit(this.pip);
    }

    toString(){
        return `Critical Hit (${this.pip} pip)`;
    }
}

class Guard extends WarriorSkill{
    constructor(pip=1){
        super("Guard", pip);
    }

    apply(){
        let user = this.user;
        user.addEventListener(new EventListener(
            "Guard",
            EVENT_TYPE.hit,
            (hitEvent)=>{
                if(hitEvent.hittee === user && hitEvent.attackUsed instanceof NormalMove){
                    if(this.checkForTrigger()){
                        this.run(hitEvent);
                    }
                }
            }
        ));
    }

    checkForTrigger(){
        return Math.random() <= 0.24; //change this to use this.pip in calculation
    }

    run(hitEvent){
        verifyClass(hitEvent, HitEvent);
        console.log("Guard!");
        hitEvent.physDmg /= 1.24;
        hitEvent.eleDmg /= 1.24;
    }

    copy(){
        return new Guard(this.pip);
    }

    toString(){
        return `Guard (${this.pip} pip)`;
    }
}


const SKILLS = new PartialMatchingMap();
SKILLS.set("critical hit", new CriticalHit());
SKILLS.set("guard", new Guard());

function getWarriorSkillByName(name, pip=1){
    return SKILLS.getPartialMatch(name).copy();
}

export {
    getWarriorSkillByName
};
