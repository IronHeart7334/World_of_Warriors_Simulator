import {verifyType, TYPES} from "../util/verifyType.js";
import {StatBoost, Stat} from "./stat.js";
import {getElementByName} from "./element.js";
import {PartialMatchingMap} from "../util/partialMap.js";

/*
LeaderSkills are special bonuses
a team receives from the first member
on the team... so long as they aren't
KOed
*/
class LeaderSkill{
    /*
    amount: how much this leader skill boosts
    the stats of warriors by. This can be passed
    in one of two formats:
    (a) integer number: if the absolute value of amount is greater than or equal to 1,
        it is interperated as a readable percentage e.g. 30 means "30%".
    (b) decimal number: the amount is interperated as a mathematical percentage e.g. 0.3 means "30%"
    If amount is a negative number, its bonus is applied as a debuff to the enemy team.
    For example, new LeaderSkill(-30, "e") will reduce the elemental damage dealt by enemy Earth warriors
    by 30% while the leader skill is active.

    type: what stat the leader skill will boost. It can be either
    (a) an element (f, e, a, w),
    at which point it will boost the elemental damage of warriors on the team possessing that element,
    (b) "p", at which point it boosts the physical damage of all warriors on the team,
    (c) "h", where it will boost the potency of healing effects on the whole team.
    */
    constructor(amount, type){
        verifyType(amount, TYPES.number);
        verifyType(type, TYPES.string);

        if(Math.abs(amount) >= 1){
            //parameter was passed as readable percentage
            //e.g. 30 means "30%"
            this.amount = amount / 100;
        } else {
            //parameter was passed as mathematical percentage
            //e.g. 0.3 means "30%"
            this.amount = amount;
        }

        this.type = LEADER_SKILL_TYPES.getPartialMatch(type);

        if(this.type === PHYS && this.amount <= 0){
            throw new Error("Physical boost leader skills cannot be negative");
        } else if(this.type === HEALING && this.amount <= 0){
            throw new Error("Healing boost leader skills cannot be negative");
        }
    }

    // need healing effects
	apply(team){
        let target = (this.amount >= 0) ? team : team.enemyTeam;

        if(this.type === PHYS){
            target.forEach((member)=>{
				member.applyBoost(Stat.PHYS, new StatBoost("Leader Skill", this.amount, 1));
			});
        } else if(this.type === HEALING){
            throw new Error("Healing leader skill not implemented yet");
        } else {
            //is an element
		    target.forEach((member)=>{
		        if(member.element === this.type){
		            member.applyBoost(Stat.ELE, new StatBoost("Leader Skill", this.amount, 1));
		        }
		    });
		}
	}

    toString(){
        let msg = "";
        let percStr = `${(this.amount < 0) ? "-" : "+"}${parseInt(Math.abs(this.amount) * 100)}%`
        if(this.type === PHYS){
            msg = `${percStr} physical damage to your whole team`;
        } else if(this.type === HEALING){
            msg = `${percStr} to all healing effects your team receives`;
        } else if(this.amount >= 0){
            // is elemental
            msg = `${percStr} to all elemental damage dealt by your ${this.type.name} warriors`;
        } else {
            msg = `${percStr} elemental damage taken from enemy ${this.type.name} warriors`;
        }
        return msg;
    }
}

const LEADER_SKILL_TYPES = new PartialMatchingMap();
const PHYS = "physical attack";
const HEALING = "healing";
LEADER_SKILL_TYPES.set("physical attack", PHYS);
LEADER_SKILL_TYPES.set("healing effects", HEALING);
["fire ", "earth", "air", "water"].forEach((element)=>{
    LEADER_SKILL_TYPES.set(element, getElementByName(element));
});

export {
    LeaderSkill
};
