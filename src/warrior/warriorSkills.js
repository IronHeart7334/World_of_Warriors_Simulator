import {OnHitAction} from "../actions/onHitAction.js";
import {NormalMove} from "./specials.js";

class WarriorSkill{
    constructor(name, pip=1){
        this.name = name;
        this.pip = pip;
        this.user = undefined;
    }

    setUser(warrior){
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

export class CriticalHit extends WarriorSkill{
    constructor(pip=1){
        super("Critical Hit", pip);
    }

    apply(){
        let user = this.user;
        user.addOnHitAction(new OnHitAction("Critical Hit", OnHitAction.PRE_HIT, (hitEvent)=>{
            if(hitEvent.hitter === user && hitEvent.attackUsed instanceof NormalMove){
                if(this.checkForTrigger()){
                    this.run(hitEvent);
                }
            }
        }));
    }

    checkForTrigger(){
        return Math.random() <= 0.24; //change this to use this.pip in calculation
    }

    run(hitEvent){
        console.log("Critical hit!");
        hitEvent.physDmg *= 1.24;
        hitEvent.eleDmg *= 1.24;
    }

    copy(){
        return new CriticalHit(this.pip);
    }
}

export class Guard extends WarriorSkill{
    constructor(pip=1){
        super("Guard", pip);
    }

    apply(){
        let user = this.user;
        user.addOnHitAction(new OnHitAction("Guard", OnHitAction.PRE_HIT, (hitEvent)=>{
            if(hitEvent.hittee === user && hitEvent.attackUsed instanceof NormalMove){
                if(this.checkForTrigger()){
                    this.run(hitEvent);
                }
            }
        }));
    }

    checkForTrigger(){
        return Math.random() <= 0.24; //change this to use this.pip in calculation
    }

    run(hitEvent){
        console.log("Guard!");
        hitEvent.physDmg /= 1.24;
        hitEvent.eleDmg /= 1.24;
    }

    copy(){
        return new Guard(this.pip);
    }
}
