/*
These are Special Moves, powerful attacks that warriors can use.
Each warrior comes with a preselected Special Move, which is determined in their data.
*/

// currently in the process of redoing, balancing

class Special_move {
    constructor(name, base_damage, mult_ele){
        this.name = name;
        this.base = base_damage;
        this.multiplies_ele = mult_ele;
        this.gives_energy = true;
        this.ignores_ele = false;
    }
    set_user(user){
        this.user = user;
        user.calc_stats();
        this.calc_mod(user, user.pip);
    }
    calc_mod(user, pip){
        var mod = 1.0;
        var dmg = this.base * Math.pow(1.2, pip - 1);
        var multiplied = user.base_phys;
        if(this.ignores_ele){
            this.mod = this.base * Math.pow(1.2, user.pip - 1) / user.base_phys;
            return;
        }
        if(this.multiplies_ele){
            multiplied += user.base_ele;
        }
        if(this.multiplies_ele){
            mod = dmg / multiplied;
        } else {
            mod = (dmg - user.base_ele) / multiplied;
        }
        this.mod = mod;
    }
    attack(){
        var physical_damage = this.user.get_phys() * this.mod;
		var elemental_damage = this.user.get_ele();
		if(this.multiplies_ele){
		    elemental_damage *= this.mod;
		}
		this.user.enemy_team.active.calc_damage_taken(physical_damage, elemental_damage);
    }
}
class Beat extends Special_move {
    constructor(check_ele){
        super("Thunder Strike", 40, false);
        this.should_check_ele = check_ele;
    }
    set_user(user){
        super.set_user(user);
        
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
class AOE extends Special_move{
    constructor(){
        super("null", 20, true);
    }
    set_user(user){
        super.set_user(user);
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
        var physical_damage = this.user.get_phys() * this.mod;
		var elemental_damage = this.user.get_ele() * this.mod;
		
		for (var member of this.user.enemy_team.members_rem){
			member.calc_damage_taken(physical_damage, elemental_damage);
		}
    }
}
class Boost extends Special_move{
    constructor(){
        super("null", 0, false);
        this.gives_energy = false;
    }
    set_user(user){
        this.user = user;
        this.mod = 1;
        this.name = user.element.name + " Boost";
    }
    attack(){
		for (var member of this.user.team.members_rem){
			if (member.element !== this.user.element){
				continue;
			}
			member.boost_up = true;
			var add_boost = true;
			for (var boost of member.ele_boosts){
				if (boost.id == this.name){
					boost.dur_rem = 3;
					add_boost = false;
				}
			}
			
			if (add_boost){
				member.ele_boosts.push(new Stat_boost(this.name, 1.35, 3));
			}
		}    
    }
}
class Poison extends Special_move{
    constructor(){
        super("Poison", 15, false);
        this.ignores_ele = true;
    }
    attack(){
		var dmg = this.user.get_phys() * this.mod;
		this.user.enemy_team.active.poisoned = [dmg, 3];
		this.user.enemy_team.gain_energy();        
    }
}
// will need to be changed once I update energy
class Rolling_thunder extends Special_move{
    constructor(){
        super("Rolling Thunder", 7, true);
    }
    attack(){
        var physical_damage = this.user.get_phys() * this.mod;
	    var elemental_damage = this.user.get_ele() * this.mod;
		
	    var gained_energy = false;
		
	    for(var i = 0; i < 3; i++){
		    var target_team = this.user.enemy_team;
		    var num_targ = target_team.members_rem.length;
		    
		    if(num_targ == 0){
			    return;
		    }
			
		    var target = target_team.members_rem[Math.floor(Math.random() * num_targ)];
		    
		    if (target_team.active == target){
			    // this part
			    if (gained_energy){
				    target_team.energy -= 1;
			    }
			    gained_energy = true;
		    }
			
		    target.calc_damage_taken(physical_damage, elemental_damage);
		    target_team.check_if_ko();
	    }
    }
}
class Stealth_strike extends Special_move{
    constructor(){
        super("Stealth Strike", 40, false);
    }
    attack(){
        super.attack();
		this.user.team.switchin(this.user.team.switchback);        
    }
}
class Armor_break extends Special_move{
    constructor(){
        super("Armor Break", 40, true);
    }
    attack(){
        var target = this.user.enemy_team.active;
        var save_arm = target.armor;
        var save_boosts = target.armor_boosts.slice();
        
        target.armor = 0;
        target.armor_boosts = [];
        
        super.attack();
        
        target.armor = save_arm;
        target.armor_boosts = save_boosts;
    }
}
class Healing extends Special_move{
    constructor(){
        super("Healing", 150, false);
        this.gives_energy = false;
        this.ignores_ele = true;
    }
    attack(){
		var to_heal = undefined;
		var lowest = 1;
		for (var member of this.user.team.members_rem){
			if (member == this.user){
				continue;
			}
			if (member.hp_perc() < lowest){
				to_heal = member;
				lowest = member.hp_perc();
			}
		}
		var total_heal = this.user.get_phys() * this.mod;
		
		this.user.heal(total_heal * 0.2);
		if (to_heal !== undefined){
			to_heal.heal(total_heal * 0.8);
        }
    }
}
class Soul_steal extends Special_move{
    constructor(){
        super("Soul Steal", 30, false);
        this.ignores_ele = true;
    }
    attack(){
		var physical_damage = this.user.get_phys() * this.mod;
		this.user.heal(this.user.enemy_team.active.calc_damage_taken(physical_damage, 0) * 0.3);        
    }
}
class Berserk extends Special_move{
    constructor(){
        super("Berserk", 50, false);
    }
    attack(){
		var physical_damage = this.user.get_phys() * this.mod;
		var elemental_damage = this.user.get_ele();
		
		this.user.take_damage(this.user.enemy_team.active.calc_damage_taken(physical_damage, elemental_damage) * 0.2, 0);
		if (this.user.hp_rem < 1){
			this.user.hp_rem = 1;
		}        
    }
}
class Poison_hive extends Special_move{
    constructor(){
        super("Poison Hive", 10, false);
        this.ignores_ele = true;
    }
    attack(){
		var dmg = this.user.get_phys() * this.mod;
		for (var member of this.user.enemy_team.members_rem){
			member.poisoned = [dmg, 3];		
		}
		this.user.enemy_team.gain_energy();    
    }
}
class Regeneration extends Special_move{
    constructor(){
        super("Regeneration", 3, false);
        this.ignores_ele = true;
    }
    attack(){
		var healing = this.user.get_phys() * this.mod;
		for (var member of this.user.team.members_rem){
			member.regen = [healing, 3];
			member.calc_regen(); 
		}
    }
}
class Vengeance extends Special_move{
    constructor(){
        super("Vengeance", 25, true);
    }
    attack(){
	    var mod = this.mod * (1.5 - this.user.hp_perc());
	    var physical_damage = this.user.get_phys() * mod;
	    var elemental_damage = this.user.get_ele() * mod;
	    this.user.enemy_team.active.calc_damage_taken(physical_damage, elemental_damage);        
    }
}
class Twister extends Special_move{
    constructor(){
        super("Twister", 10, true);
    }
    attack(){
		var mod = this.mod * (1.5 - this.user.hp_perc());
		console.log(mod);
		var physical_damage = this.user.get_phys() * mod;
		var elemental_damage = this.user.get_ele() * mod;
		
		for (var member of this.user.enemy_team.members_rem){
			member.calc_damage_taken(physical_damage, elemental_damage);
		}        
    }
}
class Stealth_assault extends Special_move{
    constructor(){
        super("Stealth Assault", 15, true);
    }
    attack(){
	    var physical_damage = this.user.get_phys() * this.mod;
	    var elemental_damage = this.user.get_ele() * this.mod;
	    
	    for (var member of this.user.enemy_team.members_rem){
		    member.calc_damage_taken(physical_damage, elemental_damage);
	    }
		
	    this.user.team.switchin(this.user.team.switchback);        
    }
}
class Team_strike extends Special_move{
	constructor(){
		super("Team Strike", 60, true);
	}
	attack(){
		var pow = this.user.team.members_rem.length - 1;
		var mod = this.mod * Math.pow(RECOIL_MOD, pow);
		var physical_damage = this.user.get_phys() * mod;
		var elemental_damage = this.user.get_ele() * mod;
		
		var dmg = this.user.enemy_team.active.calc_damage_taken(physical_damage, elemental_damage); 
		for (var member of this.user.team.members_rem){
			member.take_dmg(dmg / 6, 0);
			member.hp_rem = Math.round(member.hp_rem);
		}
		if (this.user.hp_rem <= 1){
			this.user.hp_rem = 1;
		}	
	}
}
class Phantom_strike extends Special_move{
	constructor(){
		super("Phantom Strike", 10, true);
	}
	attack(){
		var physical_damage = this.user.get_phys() * this.mod;
		var elemental_damage = this.user.get_ele() * this.mod;
		var target_team = this.user.enemy_team;
		
		//first hit
		var pd = physical_damage * 1.33;
		var ed = elemental_damage * 1.33;
		target_team.active.calc_damage_taken(pd, ed);
		if (target_team.members_rem.length < 2){return;}
		
		//second hit
		var target = target_team.next();
		target.calc_damage_taken(physical_damage, elemental_damage);
		if (target_team.members_rem.length < 3){return;}
		
		//third hit
		pd = physical_damage * 0.67;
		ed = elemental_damage * 0.67;
		target = target_team.prev();
		target.calc_damage_taken(pd, ed);
	}
}
class Phantom_shield extends Special_move{
	constructor(){
		super("Phantom Shield", 0, false);
		this.ignores_ele = true;
		this.gives_energy = false;
	}
	set_user(user){
		this.user = user;
		this.mod = 1;
	}
	attack(){
		for (var member of this.user.team.members_rem){
			var apply = true;
			for(var boost of member.armor_boosts){
				if(boost.id == this.name){
					boost.dur_rem = 3;
					apply = false
				}
			}
			if(apply){
    	    	member.armor_boosts.push(new Stat_boost("Phantom Shield", 0.55, 3));
    	    }
    	}
	}
}