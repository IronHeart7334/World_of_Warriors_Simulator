import {TYPES, verifyType} from "../util/verifyType.js";
import {OnUpdateAction} from "../actions/onUpdateAction.js";
import {Stat, StatBoost} from "./stat.js";
import {Terminable} from "../util/terminable.js";
import {PartialMatchingMap} from "../util/partialMap.js";

/*
These are Special Moves, powerful attacks that warriors can use.
Each warrior comes with a preselected Special Move, which is determined in their data.
*/


class Attack{
    constructor(name){
        this.name = name;
        this.user = null;
    }

    setUser(warrior){
        this.user = warrior;
    }

    getPhysicalDamage(){
        throw new Error("getPhysicalDamage not overridden for " + this.name);
    }

    getElementalDamage(){
        throw new Error("getPhysicalDamage not overridden for " + this.name);
    }

    copy(){
        throw new Error("classes inheriting from Attack must implement copy method");
    }
}



class NormalMove extends Attack{
    constructor(){
        super("Normal Move");
    }

    getPhysicalDamage(){
        return this.user.getStatValue(Stat.PHYS);
    }

    getElementalDamage(){
        return this.user.getStatValue(Stat.ELE);
    }

    copy(){
        return new NormalMove();
    }
}



class SpecialMove extends Attack{
    constructor(name, base_damage, mult_ele){
        super(name);
        this.base = base_damage;
        this.multipliesEle = mult_ele;
        this.ignoresEle = false;
    }

    setUser(user){
        this.user = user;
        user.calcStats();

        //calculate pip modifier
        /*
         * Each special move has a base damage value,
         * which is how much damage it should do when used
         * by a level 0 warrior, based on their pip level.
         * Some special moves multiply the user's elemental
         * damage for the attack, while others don't deal any
         * elemental damage at all.
         */
        let dmg = this.base * Math.pow(1.2, user.pip - 1);
        let multiplied = user.getBase(Stat.PHYS);
        if(this.ignoresEle){
            this.mod = this.base * Math.pow(1.2, user.pip - 1) / user.getBase(Stat.PHYS);
        } else {
            if(this.multipliesEle){
                multiplied += user.getBase(Stat.ELE);
                this.mod = dmg / multiplied;
            } else {
                this.mod = (dmg - user.getBase(Stat.ELE)) / multiplied;
            }
        }
    }

    getPhysicalDamage(){
        return this.user.getStatValue(Stat.PHYS) * this.mod;
    }

    getElementalDamage(){
        let ret = this.user.getStatValue(Stat.ELE);
        if(this.ignoresEle){
            ret = 0;
        }else if(this.multipliesEle){
            ret *= this.mod;
        }
        return ret;
    }

    attack(){
		this.user.strike(this);
    }
    //used for AOE attacks
    attackAll(){
        this.user.enemyTeam.forEach((member)=>{
            this.user.strike(this, member);
        });
    }

    toString(){
        return `${this.name} ${(this.user == null) ? "" : this.user.pip}`;
    }
}

class Beat extends SpecialMove {
    constructor(checkEle=true){
        super("Thunder Strike", 40, false);
        this.shouldCheckEle = checkEle;
    }
    setUser(user){
        super.setUser(user);

        if(this.shouldCheckEle){
            switch(user.element.name){
            case "Fire":
			    this.name = "Inferno";
			    break;
		    case "Earth":
			    this.name = "Claw Crush";
			    break;
		    case "Air":
			    this.name = "Tornado Strike";
			    break;
		    case "Water":
			    this.name = "Frozen Crunch";
			    break;
		    default:
			    this.name = "Thunder Strike";
            }
        }
    }

    copy(){
        return new Beat(this.shouldCheckEle);
    }
}

class AOE extends SpecialMove{
    constructor(){
        super("null", 20, true);
    }
    setUser(user){
        super.setUser(user);
        switch(user.element.name){
        case "Fire":
			this.name = "Fire Storm";
			break;
		case "Earth":
			this.name = "Boulder Bash";
			break;
		case "Air":
			this.name = "Tempest";
			break;
		case "Water":
			this.name = "Ice Storm";
			break;
		default:
			this.name = "null";
        }
    }
    attack(){
        this.attackAll();
    }
    copy(){
        return new AOE();
    }
}

class Boost extends SpecialMove{
    constructor(){
        super("null", 0, false);
    }
    setUser(user){
        this.user = user;
        this.mod = 1;
        this.name = user.element.name + " Boost";
    }
    attack(){
		this.user.team.forEach((member)=>{
			if (member.element === this.user.element){
				member.boostIsUp = true;
                member.applyBoost(Stat.ELE, new StatBoost(this.name, 1.35, 3));
			}
		});
    };
    copy(){
        return new Boost();
    }
}

//manual gainEnergy
class Poison extends SpecialMove{
    constructor(){
        super("Poison", 15, false);
        this.ignoresEle = true; //needed for pip calculation
    }
    attack(){
		this.user.enemyTeam.active.poison(this.getPhysicalDamage());
        this.user.enemyTeam.gainEnergy();
    }
    copy(){
        return new Poison();
    }
}

class RollingThunder extends SpecialMove{
    constructor(){
        super("Rolling Thunder", 7, true);
    }

    //strikes 3 random targets on the enemy team. May hit the same person multiple times
    attack(){
        let gainedEnergy = false; //keep track of if the active has been hit,
        //since teams gain energy every time the active is hit,
        ////I need to prevent them from gaining more than one energy per use of this special

        let targetTeam = this.user.enemyTeam;
        let numTargets; //need to constantly recalculate
        let target;

	    for(let i = 0; i < 3; i++){
		    numTargets = targetTeam.membersRem.length;

		    if(numTargets === 0){
			    return;
		    }

            //choose a random target
			target = targetTeam.membersRem[Math.floor(Math.random() * numTargets)];

		    if (targetTeam.active === target){
			    // this part
			    if (gainedEnergy){
				    targetTeam.energy -= 1;
			    } else {
                    gainedEnergy = true;
                }
		    }
			this.user.strike(this, target);
		    targetTeam.isKoed();
	    }
    }

    copy(){
        return new RollingThunder();
    }
}

// User switches in, attacks,
// then switches back to whoever was active before them
class StealthStrike extends SpecialMove{
    constructor(){
        super("Stealth Strike", 40, false);
    }
    attack(){
        super.attack();
		this.user.team.switchin(this.user.team.switchback);
    }
    copy(){
        return new StealthStrike();
    }
}



class ArmorBreak extends SpecialMove{
    constructor(){
        super("Armor Break", 40, true);
    }
    attack(){
        super.attack();
        this.user.enemyTeam.active.applyBoost(Stat.ARM, new StatBoost("Armor Break", -2, 3));
    }
    copy(){
        return new ArmorBreak();
    }
}

class Healing extends SpecialMove{
    constructor(){
        super("Healing", 17, false);
        this.ignoresEle = true;
    }
    attack(){
		let toHeal = undefined;
		let lowest = 1;
		this.user.team.forEach((member)=>{
			if (member !== this.user){
				if (member.getPercHPRem() < lowest){
                    toHeal = member;
                    lowest = member.getPercHPRem();
                }
			}
		});
		let totalHeal = this.getPhysicalDamage();

		this.user.heal(totalHeal * 0.2);
		if (toHeal !== undefined){
			toHeal.heal(totalHeal * 0.8);
        }
    }
    copy(){
        return new Healing();
    }
}

/*
 * Attacks the active enemy, healing
 * the user by 30% of the damage dealt
 */
class SoulSteal extends SpecialMove{
    constructor(){
        super("Soul Steal", 30, false);
        this.ignoresEle = true;
    }
    attack(){
        this.user.heal(this.user.strike(this) * 0.3);
    }
    copy(){
        return new SoulSteal();
    }
}

class Berserk extends SpecialMove{
    constructor(){
        super("Berserk", 50, false);
    }
    attack(){
		let recoil = this.user.strike(this) * 0.2;
		this.user.takeDamage(recoil, 0, true);
    }
    copy(){
        return new Berserk();
    }
}

//manual gainEnergy
class PoisonHive extends SpecialMove{
    constructor(){
        super("Poison Hive", 10, false);
        this.ignoresEle = true;
    }
    attack(){
		this.user.enemyTeam.forEach((member)=>member.poison(this.getPhysicalDamage()));
        this.user.enemyTeam.gainEnergy();
    }
    copy(){
        return new PoisonHive();
    }
}

class Regeneration extends SpecialMove{
    constructor(){
        super("Regeneration", 3, false);
        this.ignoresEle = true;
    }
    attack(){
		let healing = this.getPhysicalDamage();

		this.user.team.forEach((member)=>{
		    member.addOnUpdateAction(new OnUpdateAction("regeneration", ()=>{
                member.regen = true;
                member.heal(healing);
            }, 3));
		});
    }
    copy(){
        return new Regeneration();
    }
}

class Vengeance extends SpecialMove{
    constructor(){
        super("Vengeance", 25, true);
    }
    getPhysicalDamage(){
        return super.getPhysicalDamage() * (1.5 - this.user.getPercHPRem());
    }
    getElementalDamage(){
        return super.getElementalDamage() * (1.5 - this.user.getPercHPRem());
    }
    attack(){
	    this.user.strike(this);
    }
    copy(){
        return new Vengeance();
    }
}

class Twister extends SpecialMove{
    constructor(){
        super("Twister", 10, true);
    }
    getPhysicalDamage(){
        return super.getPhysicalDamage() * (1.5 - this.user.getPercHPRem());
    }
    getElementalDamage(){
        return super.getElementalDamage() * (1.5 - this.user.getPercHPRem());
    }
    attack(){
        this.attackAll();
		//can't use attackAll here
        /*
		this.user.enemyTeam.forEach((member)=>{
			this.user.strike(this, member);
		});*/
    }
    copy(){
        return new Twister();
    }
}



class StealthAssault extends SpecialMove{
    constructor(){
        super("Stealth Assault", 15, true);
    }
    attack(){
	    this.attackAll();
	    this.user.team.switchin(this.user.team.switchback);
    }
    copy(){
        return new StealthAssault();
    }
}

//might want to make this do less damage
class TeamStrike extends SpecialMove{
	constructor(){
		super("Team Strike", 40, true);
	}
    getPhysicalDamage(){
        return super.getPhysicalDamage() * Math.pow(1.2, this.user.team.membersRem.length - 1);
    }
    getElementalDamage(){
        return super.getElementalDamage() * Math.pow(1.2, this.user.team.membersRem.length - 1);
    }
	attack(){
		let dmg = this.user.strike(this);
		this.user.team.forEach((member)=>{
            // Should not be able to KO user
            let shoulSurviveWith1HP = (member === this.user);
			member.takeDamage(dmg / 6, 0, shoulSurviveWith1HP);
		});
	}
    copy(){
        return new TeamStrike();
    }
}

class PhantomStrike extends SpecialMove{
	constructor(){
		super("Phantom Strike", 10, true);
	}
	attack(){
		let basePhys = this.getPhysicalDamage();
		let baseEle = this.getElementalDamage();
		let targetTeam = this.user.enemyTeam;

		//first hit
        this.user.strike(
            this,
            targetTeam.active,
            basePhys * 1.33,
            baseEle * 1.33
        );
		if (targetTeam.membersRem.length < 2){return;}

		//second hit
        this.user.strike(
            this,
            targetTeam.next(),
            basePhys,
            baseEle
        );
		if (targetTeam.membersRem.length < 3){return;}

		//third hit
        this.user.strike(
            this,
            targetTeam.prev(),
            basePhys * 0.67,
            baseEle * 0.67
        );
	}
    copy(){
        return new PhantomStrike();
    }
}

//provides +3 armor for 3 turns
//change this to apply physical damage reduction of ~50%
class PhantomShield extends SpecialMove{
	constructor(){
		super("Phantom Shield", 0, false);
	}
	setUser(user){
		this.user = user;
		this.mod = 1;
	}
	attack(){
		this.user.team.forEach((member)=>{
            member.applyBoost(Stat.ARM, new StatBoost("Phantom Shield", 3, 3));
            member.shield = true;
    	});
	}
    copy(){
        return new PhantomShield();
    }
}



const SPECIALS = new PartialMatchingMap();
SPECIALS.set("thunder strike", new Beat(false));
SPECIALS.set("inferno", new Beat(true));
SPECIALS.set("claw crush", new Beat(true));
SPECIALS.set("tornado strike", new Beat(true));
SPECIALS.set("frozen crunch", new Beat(true));
SPECIALS.set("aoe", new AOE());
SPECIALS.set("fire storm", new AOE());
SPECIALS.set("boulder bash", new AOE());
SPECIALS.set("tempest", new AOE());
SPECIALS.set("ice storm", new AOE());
SPECIALS.set("boost", new Boost());
SPECIALS.set("fire boost", new Boost());
SPECIALS.set("earth boost", new Boost());
SPECIALS.set("air boost", new Boost());
SPECIALS.set("water boost", new Boost());
SPECIALS.set("poison", new Poison());
SPECIALS.set("rolling thunder", new RollingThunder());
SPECIALS.set("stealth strike", new StealthStrike());
SPECIALS.set("armor break", new ArmorBreak());
SPECIALS.set("healing", new Healing());
SPECIALS.set("soul steal", new SoulSteal());
SPECIALS.set("berserk", new Berserk());
SPECIALS.set("poison hive", new PoisonHive());
SPECIALS.set("regeneration", new Regeneration());
SPECIALS.set("vengeance", new Vengeance());
SPECIALS.set("twister", new Twister());
SPECIALS.set("stealth assault", new StealthAssault());
SPECIALS.set("team strike", new TeamStrike());
SPECIALS.set("phantom strike", new PhantomStrike());
SPECIALS.set("phantom shield", new PhantomShield());

function getSpecialByName(name){
    verifyType(name, TYPES.string)
    return SPECIALS.getPartialMatch(name.toLowerCase()).copy();
}

export {
    NormalMove,
    getSpecialByName
};
