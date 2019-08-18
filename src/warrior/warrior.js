import {warriors} from "./realWarriors.js";
import {NormalMove, findSpecial} from "./specials.js";
import {getElement, NO_ELE} from "./elements.js";
import {Stat} from "./stat.js";
import {Lead} from "./leaderSkill.js";
import {OnUpdateAction} from "../actions/onUpdateAction.js";
import {OnHitAction} from "../actions/onHitAction.js";
import {HitEvent} from "../actions/hitEvent.js";

// The base values for both stats, might change them later
const OFFENSE = 33.73;
const HP = 107.0149;

let nextId = 0;
export class Warrior{
    //better way to do this?
    constructor(name){
	    /*
	    The warrior Class takes data from an array:
	    new Warrior([name, [off, ele, hp, arm, pip], element, special, leader_skill]);
	    */
	    let data = this.find_warrior(name);
	    this.name = data[0];
        this.stats = new Map();
        
	    let baseOff = OFFENSE * data[1][0];
        
        this.stats.set(Stat.PHYS, new Stat(Stat.PHYS, baseOff * (1 - data[1][1]), true));
        this.stats.set(Stat.ELE, new Stat(Stat.ELE, baseOff * data[1][1], true));
        this.stats.set(Stat.ARM, new Stat(Stat.ARM, data[1][3]));
        this.stats.set(Stat.HP, new Stat(Stat.HP, HP * data[1][2], true));
        
	    this.pip = data[1][4];
	    this.element = getElement(data[2]);
	    this.special = findSpecial(data[3]);
	    this.lead_skill = new Lead(data[4][0], data[4][1]);
	    this.level = 34;
	    
        this.warriorSkills = [];
        
        this.normalMove = new NormalMove();
        this.normalMove.setUser(this);
	    this.special.setUser(this);
        
        this.koListeners = []; //fired when this is KOed
        
        this.id = nextId;
        nextId++;
    }
    
    //change this to look in the player's warriors
    find_warrior(name){
    	for(let warrior of warriors){
    		if(warrior[0] === name){
    			return warrior;
    		}
    	}
    	return ["ERROR", [1, 0.5, 1, 1, 2], "none", "ERROR", [5, "p"]];
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
    calcEleDmg(ele, attack){
        if (this.element.weakness === attack.user.element.name){
			ele *= 1.7;
		} else if (this.element.name === attack.user.element.weakness){
			ele *= 0.3;
		}
        return ele;
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
	
    addKoListener(f){
        this.koListeners.push(f);
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
            this.applyBoost(Stat.ARM, new Stat_boost("shell", 3, 1));
		}
		
		let new_update = new Map();
		for(let a of this.onUpdateActions.values()){
		    a.run();
		    if(!a.should_terminate){
		        new_update.set(a.id, a);
		    }
		}
		this.onUpdateActions = new_update;
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
}

export class Stat_boost{
    constructor(id, amount, dur){
        this.id = id;
        this.amount = amount;
        this.max_dur = dur;
        this.dur_rem = dur;
        this.should_terminate = false;
    }
    update(){
        this.dur_rem -= 1;
        if(this.dur_rem <= 0){
            this.should_terminate = true;
        }
    }
}