import {NormalMove, getSpecialByName} from "./specials.js";
import {Stat, StatBoost} from "./stat.js";
import {getWarriorSkillByName} from "./warriorSkills.js";
import {getElementByName} from "./element.js";
import {LeaderSkill} from "./leaderSkill.js";
import {TYPES, notNull, verifyType, verifyClass, inRange, notNegative, positive, array} from "../util/verifyType.js";
import {
    EventListenerRegister,
    EventListener,
    EVENT_TYPE,
    HitEvent,
    DamageEvent,
    HealEvent,
    KOEvent,
    UpdateEvent
} from "../events/events.js";



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
    - leaderSkillAmount: the boost provided by this Warrior's leader skill. See leaderSkill.js for more details.
    - leaderSkillType: the stat boosted by this Warrior's leader skill. Must start with either f, e, a, w, p, or h. See leaderSkill.js for more details.
    - specialName: the name of the Special Move of this Warrior
    - pip: the relative power level of the special move (1-4)
    - skills: an array of strings, the names of warrior skills this warrir has.
    */
    constructor(name, element, offMult, eleRatio, armor, hpMult, leaderSkillAmount, leaderSkillType, specialName, pip, skills=[]){
        verifyType(name, TYPES.string);
        verifyType(element, TYPES.string);
        positive(offMult);
        inRange(0, eleRatio, 1.0);
        inRange(0, armor, 2);
        positive(hpMult);
        verifyType(leaderSkillAmount, TYPES.number);
        verifyType(leaderSkillType, TYPES.string);
        verifyType(specialName, TYPES.string);
        inRange(1, pip, 4);
        array(skills);
        skills.forEach((skill)=>verifyType(skill, TYPES.string));

        this.ctorArgs = Array.from(arguments);
        this.name = name;
        this.stats = new Map();
        this.stats.set(Stat.PHYS, new Stat(Stat.PHYS, offMult * (1.0 - eleRatio)));
        this.stats.set(Stat.ELE, new Stat(Stat.ELE, offMult * eleRatio));
        this.stats.set(Stat.ARM, new Stat(Stat.ARM, armor));
        this.stats.set(Stat.HP, new Stat(Stat.HP, hpMult));
	    this.pip = pip;
	    this.element = getElementByName(element);
	    this.special = getSpecialByName(specialName);
        this.leaderSkill = new LeaderSkill(leaderSkillAmount, leaderSkillType);
	    this.level = 34;

        this.warriorSkills = [];
        skills.forEach((skill)=>this.addSkill(getWarriorSkillByName(skill)));

        this.normalMove = new NormalMove();
        this.normalMove.setUser(this);
	    this.special.setUser(this);

        this.eventListenReg = new EventListenerRegister();
        this.id = nextId;
        nextId++;
    }

    copy(){
        let ret = new Warrior(...(this.ctorArgs));
        //currenly need this, as constructor doesn't yet add warrior skills
        this.warriorSkills.forEach((skill)=>{
            ret.addSkill(skill.copy());
        });
        return ret;
    }

    /*
    returns the base value for the given stat.
    used by SpecialMove to calculate pip modifier
    */
    getBase(statEnum){
        verifyType(statEnum, TYPES.number);
        return this.stats.get(statEnum).getBase();
    }

    /*
    returns the calculated value
    for the given stat
    */
    getStatValue(statEnum){
        verifyType(statEnum, TYPES.number);
        return this.stats.get(statEnum).getValue();
    }

    /*
    Returns the percentage of your HP remaining
    AS A VALUE BETWEEN 0 AND 1
    NOT 0 AND 100
    */
	getPercHPRem(){
		return this.hpRem / this.getStatValue(Stat.HP);
	}

    /*
    Returns how much of your max HP will equal perc
    Example:
        With 200 HP, this.percOfMaxHP(0.5) will return 100
    */
	percOfMaxHP(perc){
	    inRange(0, perc, 1.0);
		return this.getStatValue(Stat.HP) * perc;
    }

    /*
    returns whether or not
    this warrior has been knocked out
    */
    isKoed(){
		return this.hpRem <= 0;
	}

    /*
    Calculate a warrior's stats
    Increases by 7% per level
    */
    calcStats(){
        //values is a generator, not an array
        for(let stat of this.stats.values()){
            stat.calc(this.level);
        }
	}

    /*
    If roundTo1 is set to true, this warrior
    is guaranteed to survive with at lease 1 HP
    */
    takeDamage(phys, ele=0, roundTo1=false){
        notNegative(phys);
        notNegative(ele);
        verifyType(roundTo1, TYPES.boolean);

        let amount = phys + ele;
        this.lastPhysDmg += phys;
        this.lastEleDmg += ele;
        this.hpRem -= amount;
        this.hpRem = Math.round(this.hpRem);
        if(roundTo1 && this.hpRem <= 0){
            this.hpRem = 1;
        }
        if(this.isKoed()){
            this.eventListenReg.fireEventListeners(new KOEvent(this));
        }

        //this may change once I figure out what DamageEvents need to contain
        let dmgEvent = new DamageEvent(this, Math.round(phys), Math.round(ele));
        this.eventListenReg.fireEventListeners(dmgEvent);
    }

    /*
    Restore HP
    Prevents from healing past full
    Also rounds for you
    */
	heal(hp){
		this.lastHealed += Math.round(hp);
		this.hpRem += hp;
		if (this.hpRem > this.getStatValue(Stat.HP)){
			this.hpRem = this.getStatValue(Stat.HP);
		}
		this.hpRem = Math.round(this.hpRem);

        let healEvent = new HealEvent(this, Math.round(hp));
        this.eventListenReg.fireEventListeners(healEvent);
	}

    //update this once poison amulet is implemented
    poison(dmgPerTurn){
        this.addEventListener(new EventListener(
            "poison",
            EVENT_TYPE.warriorUpdated,
            ()=>{
                this.poisoned = true;
                this.takeDamage(dmgPerTurn);
            },
            3
        ));
    }

    // update this once Resilience out
	heartCollect(){
		this.heal(this.healableDamage * 0.4);
	}

    /*
    Strategically take damage instead
    of heart collection.
    */
    bomb(){
        let d = this.percOfMaxHP(0.15);
        this.takeDamage(d, 0, true);
    }

    /*
    Sets all of this' damage related flags
    back to 0. Note that this does not heal
    the Warrior.
    */
	clearDamageFlags(){
	    /*
	    Reset your most recent damage to 0
	    DOES NOT HEAL YOU
	    Used for heart collection
	    */
		this.lastPhysDmg = 0;
		this.lastEleDmg = 0;
        this.healableDamage = 0;
	}

    /*
    Sets the lastHealed flag to 0.
    */
	clearHealingFlag(){
	    this.lastHealed = 0;
	}

    useNormalMove(){
        this.strike(this.normalMove);
    }

    /*
    Use your powerful Special Move!
    */
    useSpecial(){
		this.team.switchback = this.team.active;
		this.team.switchin(this);
		this.special.attack();
		this.team.energy -= 2;
	}

    toString(){
        return `Warrior:
            Name: ${this.name}
            Level: ${this.level}
            Element: ${this.element.name}
            Physical attack: ${this.getStatValue(Stat.PHYS)}
            Elemental attack: ${this.getStatValue(Stat.ELE)}
            Armor: ${this.getStatValue(Stat.ARM)}
            Max HP: ${this.getStatValue(Stat.HP)}
            Leader Skill: ${this.leaderSkill.toString()}
            Special move: ${this.special.toString()}
            Warrior skills: ${this.warriorSkills.map((skill)=>skill.name).toString()}`;
    }

    //change this to accept a string and verify skill combination is valid
    addSkill(warriorSkill){
        this.warriorSkills.push(warriorSkill);
        warriorSkill.setUser(this);
    }

    /*
    Initializes the warrior for battle,
    clearing all flags and applying event
    listeners from warrior skills.
    */
	init(){
		this.calcStats();
		this.hpRem = this.getStatValue(Stat.HP);

		this.poisoned = false;
		this.regen = false;
		this.shield = false;

		this.lastPhysDmg = 0; //these first two are just used for the GUI
		this.lastEleDmg = 0;
        this.healableDamage = 0; //damage that can be healed through heart collection
		this.lastHealed = 0;

        this.eventListenReg.clear();

        this.warriorSkills.forEach((skill)=>{
            skill.apply();
        });
	}

    //I may want to change how stat boosts work
    applyBoost(statEnum, boost){
        if(this.stats.has(statEnum)){
            this.stats.get(statEnum).applyBoost(boost);
        } else {
            console.log("Stat not found: " + statEnum);
        }
    }

    /*
     * This is what all attacking should call.
     * this warrior performs an attack against a given target,
     * going through a series of steps:
     * 1. calculate how much damage the attack will do to the target,
     *    reducing the physical damage of the attack by 12% for each point of armor the target has,
     *    and dealing more (+70%) or less (-70%) elemental damage based on the matchup between the user and target's elements
     * 2. generates a HitEvent to keep track of the details for this attack
     * 3. fires a hit event for the attacker, then the target, potentially modifying the damage
     * 4. Some things to note about the hit event:
     *    (a): EventListeners should check if their user is the hitter or the hittee in the attack
     *    (b): EventListeners should check if the attack used is an instance of NormalMove (see warriorSkills.js)
     *    (c): they may modify the damage passed into the event, so you should never reference the local variables
     *         physDmg, eleDmg, and dmg in this function, only use the event's properties.
     * 5. after running all of these pre-hit functions, the target takes damage
     *    using the damage values from the event.
     * 6. if the target is the active warrior for his team, allows them to recover the damage during heart collection,
     *    and gives their team energy.
     *
     * @param {Attack} using the NormalMove or SpecialMove the attack was made using.
     * @param {Warrior} target who the attack is made against. Defaults to the active enemy.
     * @param {number} phys the base physical damage of the attack. Defaults to using.getPhysicalDamage()
     * @param {number} ele the base elemental damage of the attack. Defaults to using.getElementalDamage()
     * @returns {the damage inflicted}
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

        let physDmg = phys * (1 - target.getStatValue(Stat.ARM) * 0.12);
        let eleDmg = ele * this.element.getMultiplierAgainst(target);
        let dmg = phys + ele;
        let event = new HitEvent(this, target, using, physDmg, eleDmg);

        this.eventListenReg.fireEventListeners(event);
        target.eventListenReg.fireEventListeners(event);

        target.takeDamage(event.physDmg, event.eleDmg);

        if(target.team.active === target){
            //damage that can be healed from heart collection
            target.healableDamage += event.physDmg + event.eleDmg;
            target.team.gainEnergy();
        }

        return event.physDmg + event.eleDmg; //for Soul Steal
    }

    addEventListener(eventListener){
        verifyClass(eventListener, EventListener);
        this.eventListenReg.addEventListener(eventListener);
    }

	update(){
        this.stats.forEach((stat)=>{
            stat.update();
        });

        //there has to be a better way to do this.
        this.boostIsUp = false;
        for(let boost of this.stats.get(Stat.ELE).boosts.values()){
            if(boost.id === this.element.name + " Boost"){
                this.boostIsUp = true;
                break;
            }
        }

        //same for here
		this.shield = false;
        for(let boost of this.stats.get(Stat.ARM).boosts.values()){
            if(boost.id === "Phantom Shield"){
                this.shield = true;
                break;
            }
        }

		this.poisoned = false;
		this.regen = false;


        this.eventListenReg.fireEventListeners(new UpdateEvent(this));
	}

}

export {
    Warrior
};
