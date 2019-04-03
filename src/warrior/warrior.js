import {warriors} from "./realWarriors.js";
import {findSpecial} from "./specials.js";
import {getElement, NO_ELE} from "./elements.js";
import {OnUpdateAction} from "../onUpdateAction.js";

// The base values for both stats, might change them later
export const OFFENSE = 33.73;
export const HP = 107.0149;


//change how attacking, energy works


export class Warrior{
    //better way to do this?
    constructor(name, skills){
	    /*
	    The warrior Class takes data from an array:
	    new Warrior([name, [off, ele, hp, arm, pip], element, special, leader_skill]);
	    */
	    let data = this.find_warrior(name);
	    this.name = data[0];
	    this.base_off = OFFENSE * data[1][0];
		this.base_ele = this.base_off * data[1][1];
		this.base_phys = this.base_off - this.base_ele;
	    this.base_hp = HP * data[1][2];
	    this.armor = data[1][3];
	    this.pip = data[1][4];
	    this.element = getElement(data[2]);
	    this.special = findSpecial(data[3]);
	    this.lead_skill = new Lead(data[4][0], data[4][1]);
	    this.skills = skills;
	    this.level = 34;
	    
	    this.special.set_user(this);
    }
    find_warrior(name){
    	for(let warrior of warriors){
    		if(warrior[0] === name){
    			return warrior;
    		}
    	}
    	return ["ERROR", [1, 0.5, 1, 1, 2], "none", "ERROR", [5, "p"]];
    }
    
	calcStats(){
		/*
		Calculate a warrior's stats
		Increases by 7% per level
		*/
		
		this.max_hp = Math.round(this.base_hp * Math.pow(1.07, this.level));
		this.phys = Math.round(this.base_phys * Math.pow(1.07, this.level));
		this.ele = Math.round(this.base_ele * Math.pow(1.07, this.level));
	}
	
	// one method? one boost array?
	get_phys(){
		var mult = 1;
		for (var boost of this.phys_boosts){
			mult += boost.amount;
		}
		return Math.round(this.phys * mult);
	}
	get_ele(){
		var mult = 1;
		for (var boost of this.ele_boosts){
			mult += boost.amount;
		}
		return Math.round(this.ele * mult);
	}
	get_armor(){
	    var reduction = this.armor * 0.12;
	    
	    for(var boost of this.armor_boosts){
	        reduction += boost.amount;
	    }
		return 1 - reduction;
	}
	
	hp_perc(){
	    /*
	    Returns the percentage of your HP remaining
	    AS A VALUE BETWEEN 0 AND 1
	    NOT 0 AND 100
	    */
		return this.hp_rem / this.max_hp;
	}
	perc_hp(perc){
	    /*
	    Returns how much of your max HP will equal perc
		Example:
			With 200 HP, this.perc_hp(0.5) will return 100
	    */
		return this.max_hp * (perc);
	}
	
	calc_damage_taken(phys, ele){
		var physical_damage = phys * this.get_armor();
		var elemental_damage = ele;
		
		if (this.element.weakness === this.team.enemyTeam.active.element.name){
			elemental_damage *= 1.7;
		}
		
		else if (this.element.name === this.team.enemyTeam.active.element.weakness){
			elemental_damage *= 0.3;
		}
		
		this.take_damage(physical_damage, elemental_damage);
		this.last_hitby = this.team.enemyTeam.active;
		return physical_damage + elemental_damage;
	}
	take_damage(phys, ele){
	/*
	Lose HP equal to the damage you took
	If you survive, you can heal some of it off
	*/
		var dmg = phys + ele;
		this.hp_rem -= dmg;
		this.last_phys_dmg += phys;
		this.last_ele_dmg += ele;
		
		this.hp_rem = Math.round(this.hp_rem);
		
		if(this.skills[0] === "shell"){
		    if(this.hp_perc() <= 0.5){
		        this.in_shell = true;
		    }
		}
	}
	heal(hp){
	/*
	Restore HP
	Prevents from healing past full
	Also rounds for you
	*/
		this.last_healed += Math.round(hp);
		this.hp_rem += hp;
		if (this.hp_rem > this.max_hp){
			this.hp_rem = this.max_hp;
		}
		this.hp_rem = Math.round(this.hp_rem);
		if(this.skills[0] === "shell"){
		    if(this.hp_perc() > 0.5){
		        this.in_shell = false;
		    }
		}
	}
	check_if_ko(){
	/*
	An I dead yet?
	*/
		return this.hp_rem <= 0;
	}
	
	strike(pd, ed){
	    var t = this.team.enemyTeam;
	    t.gainEnergy();
	    var dmg = t.active.calc_damage_taken(pd, ed);
	    return dmg;
	}
	pass(){
	    //var t = this.team.enemyTeam;
	    //t.gainEnergy();
	    //t.turn_part1();
	}
	
	use_normal_move(){
	/*
	Strike at your enemy team's active warrior with your sword!
	*/
	    var mod = 1.0;
	    if(this.skills[0] === "critical hit"){
	        if(Math.random() <= 0.24){
	            console.log("Critical hit!");
	            mod += 0.24;
	        }
	    }
	    if(this.team.enemyTeam.active.skills[0] === "guard"){
	        if(Math.random() <= 0.24){
	            console.log("Guard!");
	            mod -= 0.24;
	        }
	    }
		this.strike(this.get_phys() * mod, this.get_ele() * mod);
	}
	use_special(){
		/*
		Use your powerful Special Move!
		*/
		this.team.switchback = this.team.active;
		this.team.switchin(this);
		this.special.attack();
		this.team.energy -= 2;
	}
    
    addOnUpdateAction(action){
        this.onUpdateActions.set(action.id, action);
    }
	
	update(){
        this.check_durations();
		this.poisoned = false;
		this.regen = false;
		
		if(this.in_shell){
		    this.armor_boosts.push(new Stat_boost("shell", 0.36, 1));
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
		this.hp_rem = this.max_hp;
		
		this.phys_boosts = [];
		this.ele_boosts = [];
		this.armor_boosts = [];
		
		this.poisoned = false;
		this.regen = false;
		this.shield = false;
		
		this.last_phys_dmg = 0;
		this.last_ele_dmg = 0;
		this.last_hitby = undefined;
		this.last_healed = 0;
		
		this.in_shell = false;
		
        this.onUpdateActions = new Map(); //new version
	}
    
	// update this once Resilience out
	nat_regen(){
		let x = this;
		this.heal((x.last_phys_dmg + x.last_ele_dmg) * 0.4);
	}
	reset_dmg(){
	    /*
	    Reset your most recent damage to 0
	    DOES NOT HEAL YOU
	    Used for heart collection
	    */
		this.last_phys_dmg = 0;
		this.last_ele_dmg = 0;
	}
	reset_heal(){
	    this.last_healed = 0;
	}
	// can be shortened?
	check_durations(){
	    /*
	    Check to see how long each of your boosts has left
	    Then push whatever ones are left to a new array
	    Your boosts become the new array
	    */
		let phys_boosts_rem = [];
		for (var boost of this.phys_boosts){
			boost.update();
			if(!boost.should_terminate){
			    phys_boosts_rem.push(boost);
			}
		}
		this.phys_boosts = phys_boosts_rem;
		
		this.boost_up = false;
		let ele_boosts_rem = [];
		for (var boost of this.ele_boosts){
			boost.update();
			if(!boost.should_terminate){
			    ele_boosts_rem.push(boost);
			    if(boost.id === this.element.name + " Boost"){
			        this.boost_up = true;
			    }
			}
		}
		this.ele_boosts = ele_boosts_rem;
		
		this.shield = false;
		let armor_boosts_rem = [];
		for(var boost of this.armor_boosts){
		    boost.update();
		    if(!boost.should_terminate){
		        armor_boosts_rem.push(boost);
		        if(boost.id === "Phantom Shield"){
		            this.shield = true;
		        }
		    }
		}
		this.armor_boosts = armor_boosts_rem;
	}

    poison(amount){
        this.addOnUpdateAction(new OnUpdateAction(
            "poison",
            ()=>{
                this.poisoned = true;
                this.take_damage(amount, 0);
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

export class Lead{
    constructor(amount, type){
	    this.amount = amount / 100;
        switch(type){
            case "p":
                this.type = "p";
                break;
            case "h":
                this.type = "h";
                break;
            default:
                this.type = getElement(type);
                break;
        }
    }
    
    // need healing effects
	// improve
	apply(team){
		if (this.amount >= 0){
			var target = team;
		}
		if (this.amount < 0){
			var target = team.enemyTeam;
		}
		if (this.type === "p"){
			target.forEach((member)=>{
				member.phys_boosts.push(new Stat_boost("Leader Skill", this.amount, 1));
			});
		}else{
		    target.forEach((member)=>{
		        if(member.element === this.type){
		            member.ele_boosts.push(new Stat_boost("Leader Skill", this.amount, 1));
		        }
		    });
		}
	}
}