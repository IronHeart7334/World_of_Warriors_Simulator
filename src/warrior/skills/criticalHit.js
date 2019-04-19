import {WarriorSkill} from "./warriorSkill.js";
import {OnHitAction} from "../../actions/onHitAction.js";

export class CriticalHit extends WarriorSkill{
    constructor(pip=1){
        super("Critical Hit", pip);
    }
    
    apply(){
        let user = this.user;
        user.addOnHitAction(new OnHitAction("Critical Hit", OnHitAction.PRE_HIT, (hitEvent)=>{
            //make Normal Move a special
            if(hitEvent.hitter === user && hitEvent.attackUsed === "Normal Move"){
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
        hitEvent.damage *= 1.24;
    }
}