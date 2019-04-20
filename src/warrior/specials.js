import {OnUpdateAction} from "../actions/onUpdateAction.js";
import {Stat} from "./stat.js";
import {Stat_boost} from "./warrior.js";
/*
These are Special Moves, powerful attacks that warriors can use.
Each warrior comes with a preselected Special Move, which is determined in their data.
*/

// currently in the process of redoing, balancing
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



export class NormalMove extends Attack{
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
        this.multiplies_ele = mult_ele;
        this.gives_energy = true;
        this.ignores_ele = false;
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
        if(this.ignores_ele){
            this.mod = this.base * Math.pow(1.2, user.pip - 1) / user.getBase(Stat.PHYS);
        } else {
            if(this.multiplies_ele){
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
        if(this.ignores_ele){
            ret = 0;
        }else if(this.multiplies_ele){
            ret *= this.mod;
        }
        return ret;
    }
    
    attack(){
		this.user.newStrike(this);
    }
    //used for AOE attacks
    attackAll(){
        this.user.enemyTeam.forEach((member)=>{
            this.user.newStrike(this, member);
        });
    }
}
class Beat extends SpecialMove {
    constructor(check_ele){
        super("Thunder Strike", 40, false);
        this.should_check_ele = check_ele;
    }
    setUser(user){
        super.setUser(user);
        
        if(this.should_check_ele){
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
        this.gives_energy = false;
    }
    setUser(user){
        this.user = user;
        this.mod = 1;
        this.name = user.element.name + " Boost";
    }
    attack(){
		this.user.team.forEach((member)=>{
			if (member.element === this.user.element){
				member.boost_up = true;
                member.applyBoost(Stat.ELE, new Stat_boost(this.name, 1.35, 3));
			}
		});   
    };
}
class Poison extends SpecialMove{
    constructor(){
        super("Poison", 15, false);
        this.ignores_ele = true;
    }
    attack(){
		var dmg = this.user.getStat(Stat.PHYS) * this.mod;
		this.user.enemyTeam.active.poison(dmg);
		this.user.pass();        
    }
}
// will need to be changed once I update energy
class Rolling_thunder extends SpecialMove{
    constructor(){
        super("Rolling Thunder", 7, true);
    }
    attack(){
        var physical_damage = this.user.getStat(Stat.PHYS) * this.mod;
	    var elemental_damage = this.user.getStat(Stat.ELE) * this.mod;
		
	    var gained_energy = false;
		
	    for(var i = 0; i < 3; i++){
		    var target_team = this.user.enemyTeam;
		    var num_targ = target_team.membersRem.length;
		    
		    if(num_targ === 0){
			    return;
		    }
			
		    var target = target_team.membersRem[Math.floor(Math.random() * num_targ)];
		    
		    if (target_team.active === target){
			    // this part
			    if (gained_energy){
				    target_team.energy -= 1;
			    }
			    gained_energy = true;
		    }
			
		    target.calc_damage_taken(physical_damage, elemental_damage);
		    target_team.check_if_ko();
	    }
	    this.user.pass();
    }
}
class Stealth_strike extends SpecialMove{
    constructor(){
        super("Stealth Strike", 40, false);
    }
    attack(){
        super.attack();
		this.user.team.switchin(this.user.team.switchback);        
    }
}
class Armor_break extends SpecialMove{
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
        this.gives_energy = false;
        this.ignores_ele = true;
    }
    attack(){
		var to_heal = undefined;
		var lowest = 1;
		this.user.team.forEach((member)=>{
			if (member !== this.user){
				if (member.hp_perc() < lowest){
                    to_heal = member;
                    lowest = member.hp_perc();
                }
			}
		});
		var total_heal = this.user.getStat(Stat.PHYS) * this.mod;
		
		this.user.heal(total_heal * 0.2);
		if (to_heal !== undefined){
			to_heal.heal(total_heal * 0.8);
        }
        this.user.pass();
    }
}
class Soul_steal extends SpecialMove{
    constructor(){
        super("Soul Steal", 30, false);
        this.ignores_ele = true;
    }
    attack(){
		var physical_damage = this.user.getStat(Stat.PHYS) * this.mod;
		this.user.heal(this.user.newStrike(this, phys=physical_damage) * 0.3);        
    }
}
class Berserk extends SpecialMove{
    constructor(){
        super("Berserk", 50, false);
    }
    attack(){
		
		this.user.take_damage(this.user.newStrike(this) * 0.2, 0);
		if (this.user.hp_rem < 1){
			this.user.hp_rem = 1;
		}        
    }
}
class Poison_hive extends SpecialMove{
    constructor(){
        super("Poison Hive", 10, false);
        this.ignores_ele = true;
    }
    attack(){
		let dmg = this.user.getStat(Stat.PHYS) * this.mod;
		this.user.enemyTeam.forEach((member)=>member.poison(dmg));
    }
}
class Regeneration extends SpecialMove{
    constructor(){
        super("Regeneration", 3, false);
        this.ignores_ele = true;
    }
    attack(){
		let healing = this.user.getStat(Stat.PHYS) * this.mod;
		
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
	    var mod = this.mod * (1.5 - this.user.hp_perc());
	    var physical_damage = this.user.getStat(Stat.PHYS) * mod;
	    var elemental_damage = this.user.getStat(Stat.ELE) * mod;
	    this.user.newStrike(this, phys=physical_damage, ele=elemental_damage);        
    }
}
class Twister extends SpecialMove{
    constructor(){
        super("Twister", 10, true);
    }
    attack(){
		var mod = this.mod * (1.5 - this.user.hp_perc());
		var physical_damage = this.user.getStat(Stat.PHYS) * mod;
		var elemental_damage = this.user.getStat(Stat.ELE) * mod;
		//can't use attackAll here
		this.user.enemyTeam.forEach((member)=>{
			member.calc_damage_taken(physical_damage, elemental_damage);
		});  
        this.user.enemyTeam.gainEnergy();
    }
}
class Stealth_assault extends SpecialMove{
    constructor(){
        super("Stealth Assault", 15, true);
    }
    attack(){
	    this.attackAll();
	    this.user.team.switchin(this.user.team.switchback);        
    }
}

//work here
class Team_strike extends SpecialMove{
	constructor(){
		super("Team Strike", 60, true);
	}
	attack(){
		var pow = this.user.team.membersRem.length - 1;
		var mod = this.mod * Math.pow(RECOIL_MOD, pow);
		var physical_damage = this.user.getStat(Stat.PHYS) * mod;
		var elemental_damage = this.user.getStat(Stat.ELE) * mod;
		
		let dmg = this.user.newStrike(this, phys=physical_damage, ele=elemental_damage); 
		this.user.team.forEach((member)=>{
			member.take_dmg(dmg / 6, 0);
			member.hp_rem = Math.round(member.hp_rem);
		});
		if (this.user.hp_rem <= 1){
			this.user.hp_rem = 1;
		}	
	}
}
class Phantom_strike extends SpecialMove{
	constructor(){
		super("Phantom Strike", 10, true);
	}
	attack(){
		var physical_damage = this.user.getStat(Stat.PHYS) * this.mod;
		var elemental_damage = this.user.getStat(Stat.ELE) * this.mod;
		var target_team = this.user.enemyTeam;
		
		//first hit
		var pd = physical_damage * 1.33;
		var ed = elemental_damage * 1.33;
		target_team.active.calc_damage_taken(pd, ed);
		if (target_team.membersRem.length < 2){return;}
		
		//second hit
		var target = target_team.next();
		target.calc_damage_taken(physical_damage, elemental_damage);
		if (target_team.membersRem.length < 3){return;}
		
		//third hit
		pd = physical_damage * 0.67;
		ed = elemental_damage * 0.67;
		target = target_team.prev();
		target.calc_damage_taken(pd, ed);
		
		this.user.pass();
	}
}

//provides +3 armor for 3 turns
class Phantom_shield extends SpecialMove{
	constructor(){
		super("Phantom Shield", 0, false);
		this.ignores_ele = true;
		this.gives_energy = false;
	}
	setUser(user){
		this.user = user;
		this.mod = 1;
	}
	attack(){
		this.user.team.forEach((member)=>{
            member.applyBoost(Stat.ARM, new Stat_boost("Phantom Shield", 3, 3));
    	});
	}
}

export function findSpecial(name){
    switch(name){
		case "beat":
			return new Beat(true);
		case "aoe":
			return new AOE();
		case "boost":
			return new Boost();
		case "poison":
			return new Poison();
		case "rolling thunder":
			return new Rolling_thunder();
		case "stealth strike":
			return new Stealth_strike();
		case "armor break":
			return new Armor_break();
		case "healing":
			return new Healing();
		case "soul steal":
			return new Soul_steal();
		case "berserk":
			return new Berserk();
		case "poison hive":
			return new Poison_hive();
		case "regeneration":
			return new Regeneration();
		case "vengeance":
			return new Vengeance();
		case "twister":
			return new Twister();
		case "stealth assault":
			return new Stealth_assault();
		case "team strike":
			return new Team_strike();
		case "phantom strike":
			return new Phantom_strike();
		case "phantom shield":
			return new Phantom_shield();
		default:
			console.log("The Special move by the name of " + name + " does not exist. Defaulting to Thunder Strike");
			return new Beat(false);
	}
}