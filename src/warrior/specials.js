import {OnUpdateAction} from "../actions/onUpdateAction.js";
import {Stat} from "./stat.js";
import {Stat_boost} from "./warrior.js";
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
}



class NormalMove extends Attack{
    constructor(){
        super("Normal Move");
    }

    getPhysicalDamage(){
        return this.user.getStat(Stat.PHYS);
    }

    getElementalDamage(){
        return this.user.getStat(Stat.ELE);
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
        return this.user.getStat(Stat.PHYS) * this.mod;
    }

    getElementalDamage(){
        let ret = this.user.getStat(Stat.ELE);
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
                member.applyBoost(Stat.ELE, new Stat_boost(this.name, 1.35, 3));
			}
		});
    };
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
		    targetTeam.check_if_ko();
	    }
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
}



class ArmorBreak extends SpecialMove{
    constructor(){
        super("Armor Break", 40, true);
    }
    attack(){
        super.attack();
        this.user.enemyTeam.active.applyBoost(Stat.ARM, new Stat_boost("Armor Break", -2, 3));
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
				if (member.hp_perc() < lowest){
                    toHeal = member;
                    lowest = member.hp_perc();
                }
			}
		});
		let totalHeal = this.getPhysicalDamage();

		this.user.heal(totalHeal * 0.2);
		if (toHeal !== undefined){
			toHeal.heal(totalHeal * 0.8);
        }
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
}

class Berserk extends SpecialMove{
    constructor(){
        super("Berserk", 50, false);
    }
    attack(){
		let recoil = this.user.strike(this) * 0.2;
		this.user.takeDamage(recoil);
		if (this.user.hp_rem < 1){
			this.user.hp_rem = 1;
		}
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
}

class Vengeance extends SpecialMove{
    constructor(){
        super("Vengeance", 25, true);
    }
    attack(){
	    let mod = (1.5 - this.user.hp_perc());
	    let p = this.getPhysicalDamage() * mod;
	    let e = this.getElementalDamage() * mod;
	    this.user.strike(this, this.user.enemyTeam.active, p, e);
    }
}

class Twister extends SpecialMove{
    constructor(){
        super("Twister", 10, true);
    }
    attack(){
		let mod = (1.5 - this.user.hp_perc());
	    let p = this.getPhysicalDamage() * mod;
	    let e = this.getElementalDamage() * mod;
		//can't use attackAll here
		this.user.enemyTeam.forEach((member)=>{
			this.user.strike(this, member, p, e);
		});
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
}

//might want to make this do less damage
class TeamStrike extends SpecialMove{
	constructor(){
		super("Team Strike", 40, true);
	}
	attack(){
		let pow = this.user.team.membersRem.length - 1;
		let mod = Math.pow(1.2, pow);
		let p = this.getPhysicalDamage() * mod;
		let e = this.getElementalDamage() * mod;

		let dmg = this.user.strike(this, this.user.enemyTeam.active, p, e);
		this.user.team.forEach((member)=>{
			member.takeDamage(dmg / 6, 0);
			member.hp_rem = Math.round(member.hp_rem);
		});
		if (this.user.hp_rem <= 1){
			this.user.hp_rem = 1;
		}
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
            member.applyBoost(Stat.ARM, new Stat_boost("Phantom Shield", 3, 3));
            member.shield = true;
    	});
	}
}

//might want to change this to not use a huge switch statement
function findSpecial(name){
    switch(name.toLowerCase()){
        case "thunder strike":
            return new Beat(false);
		case "beat":
			return new Beat(true);
        case "inferno":
            return new Beat(true);
        case "claw crush":
            return new Beat(true);
        case "tornado strike":
            return new Beat(true);
        case "frozen crunch":
            return new Beat(true);
		case "aoe":
			return new AOE();
        case "fire storm":
            return new AOE();
        case "boulder bash":
            return new AOE();
        case "tempest":
            return new AOE();
        case "ice storm":
            return new AOE();
		case "boost":
			return new Boost();
        case "fire boost":
            return new Boost();
        case "earth boost":
            return new Boost();
        case "air boost":
            return new Boost();
        case "water boost":
            return new Boost();
		case "poison":
			return new Poison();
		case "rolling thunder":
			return new RollingThunder();
		case "stealth strike":
			return new StealthStrike();
		case "armor break":
			return new ArmorBreak();
		case "healing":
			return new Healing();
		case "soul steal":
			return new SoulSteal();
		case "berserk":
			return new Berserk();
		case "poison hive":
			return new PoisonHive();
		case "regeneration":
			return new Regeneration();
		case "vengeance":
			return new Vengeance();
		case "twister":
			return new Twister();
		case "stealth assault":
			return new StealthAssault();
		case "team strike":
			return new TeamStrike();
		case "phantom strike":
			return new PhantomStrike();
		case "phantom shield":
			return new PhantomShield();
		default:
			throw new Error("The Special move by the name of " + name + " does not exist.");
	}
}

export {
    NormalMove,
    findSpecial
};
