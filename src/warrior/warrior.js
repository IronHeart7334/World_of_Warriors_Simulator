import {NormalMove, findSpecial} from "./specials.js";
import {Stat, StatBoost} from "./stat.js";
import {getWarriorSkill} from "./warriorSkills.js";
import {OnUpdateAction} from "../actions/onUpdateAction.js";
import {OnHitAction} from "../actions/onHitAction.js";
import {HitEvent} from "../actions/hitEvent.js";
import {TYPES, notNull, verifyType, inRange, notNegative, positive} from "../util/verifyType.js";

/*
The warrior.js module contains most of the classes and functions relevant to player characters (Warriors) in battle.
The exceptions are Special Moves (active abilities), which are stored in specials.js,
and Warrior Skills (passive abilities), which are stored in warriorSkills.js.
In the future, Talismans (items), will have their own file.

This module contains the following exports:
- Warrior: the class representing player characters.
*/

// The base values for both stats
const OFFENSE = 33.73;
const HP = 107.0149;

let nextId = 0;
class Warrior{
    /*
    Arguments:
    - name: a string, the name of this warrior.
    - element: the name of this warrior's element.
    - offMult: a floating point number around 1.0. How high this warrior's offensive stats are relative to the base.
    - eleRatio: a number between 0 and 1.0, showing what percentage of this warrior's offensive stats are in elemental attack. The rest go into physical attack.
    - armor: either 0, 1, or 2; representing Light, Medium, or Heavy armor respectively.
    - hpMult: a floating point number around 1.0. How high this warrior's HP is relative to the base.
    */
    constructor(name, element, offMult, eleRatio, armor, hpMult, leaderSkillAmount=10, leaderSkillType="p", special="Berserk", pip=2, skills=["Critical Hit"]){
        verifyType(name, TYPES.string);
        verifyType(element, TYPES.string);
        positive(offMult);
        inRange(0, eleRatio, 1.0);
        inRange(0, armor, 2);
        positive(hpMult);

        this.ctorArgs = Array.from(arguments);
        this.name = name;
        this.stats = new Map();
        this.stats.set(Stat.PHYS, new Stat(Stat.PHYS, OFFENSE * offMult * (1.0 - eleRatio), true));
        this.stats.set(Stat.ELE, new Stat(Stat.ELE, OFFENSE * offMult * eleRatio, true));
        this.stats.set(Stat.ARM, new Stat(Stat.ARM, armor));
        this.stats.set(Stat.HP, new Stat(Stat.HP, HP * hpMult, true));
	    this.pip = pip;
	    this.element = getElementByName(element);
	    this.special = findSpecial(special);
        this.lead_skill = new LeaderSkill(leaderSkillAmount, leaderSkillType);
	    this.level = 34;

        this.warriorSkills = [];
        skills.forEach((skill)=>addSkill(getWarriorSkill(skill)));

        this.normalMove = new NormalMove();
        this.normalMove.setUser(this);
	    this.special.setUser(this);

        this.damageListeners = [];
        this.healListeners = [];
        this.koListeners = []; //fired when this is KOed
        this.updateListeners = [];

        this.id = nextId;
        nextId++;
    }

    addSkill(warriorSkill){
        this.warriorSkills.push(warriorSkill);
        warriorSkill.setUser(this);
    }

	calcStats(){
		/*
		Calculate a warrior's stats
		Increases by 7% per level
		*/
        //values is a generator, not an array
        for(let stat of this.stats.values()){
            stat.calc(this.level);
        }
	}

    getBase(statEnum){
        return this.stats.get(statEnum).getBase();
    }

    getStat(statEnum){
        return this.stats.get(statEnum).getValue();
    }

    applyBoost(statEnum, boost){
        if(this.stats.has(statEnum)){
            this.stats.get(statEnum).applyBoost(boost);
        } else {
            console.log("Stat not found: " + statEnum);
        }
    }

	hp_perc(){
	    /*
	    Returns the percentage of your HP remaining
	    AS A VALUE BETWEEN 0 AND 1
	    NOT 0 AND 100
	    */
		return this.hp_rem / this.getStat(Stat.HP);
	}

	perc_hp(perc){
	    /*
	    Returns how much of your max HP will equal perc
		Example:
			With 200 HP, this.perc_hp(0.5) will return 100
	    */
		return this.getStat(Stat.HP) * (perc);
    }

    check_if_ko(){
        /*
        An I dead yet?
        */
		return this.hp_rem <= 0;
	}

    // new attack stuff
    calcPhysDmg(phys, attack){
        return phys * (1 - this.getStat(Stat.ARM) * 0.12);
    }

    //...against this
    calcEleDmg(ele, attack){
        return ele * attack.user.element.getMultiplierAgainst(this.element);
    }
    calcDamage(phys, ele, attack){
        return this.calcPhysDmg(phys, attack) + this.calcEleDmg(ele, attack);
    }

    /*
     * This is what all attacking should call.
     * this warrior performs an attack against a given target,
     * going through a series of steps:
     * 1. calculate how much damage the attack will do to the target,
     *    reducing the physical damage of the attack by 12% for each point of armor the target has,
     *    and dealing more (+70%) or less (-70%) elemental damage based on the matchup between the user and target's elements
     * 2. generates a HitEvent to keep track of the details for this attack
     * 3. calls all functions in this warrior's onHitActions that have their applyBeforeHit flag set to true
     * 4. does the same for all the functions in the target's onHitActions that meet the same condition
     * 5. Some things to note about these onHitActions:
     *    (a): they should check if their user is the hitter or the hittee in the attack
     *    (b): they should check if the attack used is an instance of NormalMove (see warriorSkills.js)
     *    (c): they may modify the damage passed into the event, so you should never reference the local variables
     *         physDmg, eleDmg, and dmg in this function, only use the event's properties.
     * 6. after running all of these pre-hit functions, the target takes damage
     *    using the damage values from the event.
     * 7. runs any on hit functions in this and the target's onHitActions that have to applyBeforeHit flag set to false
     *    (not using this currently, will need for poison edge I think)
     * 8. if the target is the active warrior for his team, allows them to recover the damage during heart collection,
     *    and gives their team energy.
     *
     * @param {Attack} using the NormalMove or SpecialMove the attack was made using.
     * @param {Warrior} target who the attack is made against. Defaults to the active enemy.
     * @param {number} phys the base physical damage of the attack. Defaults to using.getPhysicalDamage()
     * @param {number} ele the base elemental damage of the attack. Defaults to using.getElementalDamage()
     * @returns {HitEvent.eleDmg|HitEvent.physDmg}
     */
    strike(using, target=undefined, phys=undefined, ele=undefined){
        if(target === undefined){
            target = this.enemyTeam.active;
        }
        if(phys === undefined){
            phys = using.getPhysicalDamage();
        }
        if(ele === undefined){
            ele = using.getElementalDamage();
        }

        let physDmg = target.calcPhysDmg(phys, using);
        let eleDmg = target.calcEleDmg(ele, using);
        let dmg = target.calcDamage(phys, ele, using);
        let event = new HitEvent(this, target, using, physDmg, eleDmg);

        this.onHitActions.forEach((v, k)=>{
            if(v.applyBeforeHit){
                v.run(event);
            }
        });
        target.onHitActions.forEach((v, k)=>{
            if(v.applyBeforeHit){
                v.run(event);
            }
        });



        target.takeDamage(event.physDmg, event.eleDmg);
        target.last_hitby = this;


        this.onHitActions.forEach((v, k)=>{
            if(!v.applyBeforeHit){
                v.run(event);
            }
        });
        target.onHitActions.forEach((v, k)=>{
            if(!v.applyBeforeHit){
                v.run(event);
            }
        });

        if(target.team.active === target){
            //damage that can be healed from heart collection
            target.healableDamage += event.physDmg + event.eleDmg;
            target.team.gainEnergy();
        }

        return event.physDmg + event.eleDmg; //for Soul Steal
    }

    //shell here
    takeDamage(phys, ele=0){
        let amount = phys + ele;
        this.lastPhysDmg += phys;
        this.lastEleDmg += ele;
        this.hp_rem -= amount;
        this.hp_rem = Math.round(this.hp_rem);

        if(this.check_if_ko()){
            this.knockOut();
        }

        this.damageListeners.forEach((f)=>{
            f(amount);
        });
    }

    useNormalMove(){
        this.strike(this.normalMove);
    }

    useSpecial(){
		/*
		Use your powerful Special Move!
		*/
		this.team.switchback = this.team.active;
		this.team.switchin(this);
		this.special.attack();
		this.team.energy -= 2;
	}

    //shell here
	heal(hp){
        /*
        Restore HP
        Prevents from healing past full
        Also rounds for you
        */
		this.last_healed += Math.round(hp);
		this.hp_rem += hp;
		if (this.hp_rem > this.getStat(Stat.HP)){
			this.hp_rem = this.getStat(Stat.HP);
		}
		this.hp_rem = Math.round(this.hp_rem);

        this.healListeners.forEach((f)=>{
            f(hp);
        });
        /*
		if(this.skills[0] === "shell"){
		    if(this.hp_perc() > 0.5){
		        this.in_shell = false;
		    }
		}*/
	}

    addOnHitAction(action){
        this.onHitActions.set(action.id, action);
        action.setUser(this);
    }

    addOnUpdateAction(action){
        this.onUpdateActions.set(action.id, action);
    }

    addDamageListener(f){
        this.damageListeners.push(f);
    }
    addHealListener(f){
        this.healListeners.push(f);
    }
    addKoListener(f){
        this.koListeners.push(f);
    }
    addUpdateListener(f){
        this.updateListeners.push(f);
    }

    knockOut(){
        let warrior = this;
        this.koListeners.forEach((f)=>{
            f(warrior);
        });
    }

	update(){
        this.check_durations();
		this.poisoned = false;
		this.regen = false;

		if(this.in_shell){
            this.applyBoost(Stat.ARM, new StatBoost("shell", 3, 1));
		}

		let new_update = new Map();
		for(let a of this.onUpdateActions.values()){
		    a.run();
		    if(!a.should_terminate){
		        new_update.set(a.id, a);
		    }
		}
		this.onUpdateActions = new_update;

        let self = this;
        this.updateListeners.forEach((f)=>{
            f(self);
        });
	}

	// make this stuff better
	init(){
		this.calcStats();
		this.hp_rem = this.getStat(Stat.HP);

		this.poisoned = false;
		this.regen = false;
		this.shield = false;

		this.lastPhysDmg = 0; //these first two are just used for the GUI for now
		this.lastEleDmg = 0;
        this.healableDamage = 0; //damage that can be healed through heart collection
		this.last_hitby = undefined;
		this.last_healed = 0;

		this.in_shell = false;

        this.onUpdateActions = new Map();
        this.onHitActions = new Map();

        this.warriorSkills.forEach((skill)=>{
            skill.apply();
        });
	}

	// update this once Resilience out
	nat_regen(){
		let x = this;
		this.heal(x.healableDamage * 0.4);
	}
	reset_dmg(){
	    /*
	    Reset your most recent damage to 0
	    DOES NOT HEAL YOU
	    Used for heart collection
	    */
		this.lastPhysDmg = 0;
		this.lastEleDmg = 0;
        this.healableDamage = 0;
	}
	reset_heal(){
	    this.last_healed = 0;
	}

	check_durations(){
	    /*
	    Check to see how long each of your boosts has left
	    Then push whatever ones are left to a new array
	    Your boosts become the new array
	    */

        this.stats.forEach((stat)=>{
            stat.update();
        });

        this.boostIsUp = false;
        for(let boost of this.stats.get(Stat.ELE).boosts.values()){
            if(boost.id === this.element.name + " Boost"){
                this.boostIsUp = true;
                break;
            }
        }

		this.shield = false;
        for(let boost of this.stats.get(Stat.ARM).boosts.values()){
            if(boost.id === "Phantom Shield"){
                this.shield = true;
                break;
            }
        }
	}

    poison(amount){
        this.addOnUpdateAction(new OnUpdateAction(
            "poison",
            ()=>{
                this.poisoned = true;
                this.takeDamage(amount);
            }, 3
        ));
    }

    copy(){
        let ret = new Warrior(...(this.ctorArgs));
        //currenly need this, as constructor doesn't yet add warrior skills
        this.warriorSkills.forEach((skill)=>{
            ret.addSkill(skill.copy());
        });
        return ret;
    }

    toString(){
        return `Warrior:
            Name: ${this.name}
            Level: ${this.level}
            Element: ${this.element.name}
            Physical attack: ${this.getStat(Stat.PHYS)}
            Elemental attack: ${this.getStat(Stat.ELE)}
            Armor: ${this.getStat(Stat.ARM)}
            Max HP: ${this.getStat(Stat.HP)}
            Leader Skill: ${this.lead_skill.toString()}
            Special move: ${this.special.toString()}
            Warrior skills: ${this.warriorSkills.map((skill)=>skill.name).toString()}`;
    }
}



/*
The Element class is used only by this file.
It is used to calculate how much elemental
damage warrior's deal to each other, based
on their elemental matchup.
*/
class Element{
    constructor(name, color, weakness){
        verifyType(name, TYPES.string);
        verifyType(color, TYPES.string);
        verifyType(weakness, TYPES.string);
        this.name = name;
	    this.color = color;
	    this.weakness = weakness;
	}

    getMultiplierAgainst(target){
        notNull(target);
        let ele = null;
        let ret = 0;
        if(target instanceof Element){
            ele = target;
        } else if(target instanceof Warrior){
            ele = target.element;
        } else {
            throw new Error("parameter must be either an Element or a Warrior");
        }

        if(this.weakness === ele.name){
            ret = 0.7;
        } else if(ele.weakness === this.name){
            ret = 1.7;
        } else {
            ret = 1.0;
        }

        return ret;
    }

    toString(){
        return this.name;
    }
}

const ELEMENTS = new Map();
ELEMENTS.set("f", new Element("Fire", "rgb(255, 0, 0)", "Water"));
ELEMENTS.set("e", new Element("Earth", "rgb(0, 255, 0)", "Fire"));
ELEMENTS.set("a", new Element("Air", "rgb(255, 255, 0)", "Earth"));
ELEMENTS.set("w", new Element("Water", "rgb(0, 0, 255)", "Air"));
ELEMENTS.set("n", new Element("Null", "rgb(100, 100, 100)", ""));

/*
Returns the element whose first letter
is the same of that of the given parameter.
*/
function getElementByName(name){
    verifyType(name, TYPES.string);
    let ret = null;
    let letter = name[0].toLowerCase();

    if(ELEMENTS.has(letter)){
        ret = ELEMENTS.get(letter);
    } else {
        let options = "";
        ELEMENTS.forEach((value, key)=>{
            options += `\'${key}\' (${value.name})\n`;
        });
        throw new Error(`There is no element starting with \'${letter}\'. Options are\n${options} Note that this is case insensitive`);
    }
    return ret;
}



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

        let letter = type[0].toLowerCase();
        if(LEADER_SKILL_TYPES.has(letter)){
            this.type = LEADER_SKILL_TYPES.get(letter);
        } else {
            let options = "";
            LEADER_SKILL_TYPES.forEach((value, key)=>{
                options += `\'${key}\' (${value})\n`;
            });
            throw new Error(`There is no leader skill type starting with \'${letter}\'. Options are\n${options} Note that this is case insensitive`);
        }

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

const LEADER_SKILL_TYPES = new Map();
const PHYS = "physical attack";
const HEALING = "healing";
LEADER_SKILL_TYPES.set("p", PHYS);
LEADER_SKILL_TYPES.set("h", HEALING);
["f", "e", "a", "w"].forEach((element)=>{
    LEADER_SKILL_TYPES.set(element, getElementByName(element));
});



export {
    Warrior
};
