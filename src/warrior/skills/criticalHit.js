import {WarriorSkill} from "./warriorSkill.js";
import {OnHitAction} from "../../actions/onHitAction.js";
import {NormalMove} from "../specials.js";

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
                console.log("normal move");
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
}