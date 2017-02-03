/*
These are Special Moves, powerful attacks that warriors can use.
Each warrior comes with a preselected Special Move, which is determined in their data.
Each Special Move has 2-3 arguments:
The mod, which determines how powerful the Special Move is compared to the user's Normal Move.
The pip, which shows how strong the user's Special Move is compared to warriors with the same Special Move.
And sometimes, the variation: Which is usually based on the user's Element.
*/

// get rid of these eventually
var BENCH_HIT_PEN = 0.75;
var POISON_PEN = 0.67;
var STEALTH_PEN = 0.8;
var ARMOR_IGNORE_PEN = 0.88;
var SELFHEAL_PEN = 0.8;
var RECOIL_MOD = 1.2;


// remove variation eventually
function Ele_beat(mod, pip, variation){
	this.mod = mod;
	this.pip = pip;
	switch(variation){
		case "f":
			this.name = "Inferno";
			break;
		case "e":
			this.name = "Claw Crush";
			break;
		case "a":
			this.name = "Tornado Strike";
			break;
		case "w":
			this.name = "Frozen Crunch";
			break;
		default:
			this.name = "Thunder Strike";
	}
}

Ele_beat.prototype.attack = function(user){
		var physical_damage = user.get_phys() * this.mod;
		var elemental_damage = user.get_ele();
		
		user.enemy_team.active.calc_damage_taken(user, [Math.round(physical_damage), Math.round(elemental_damage)], true);
	}

function AOE(mod, pip, variation){
	this.mod = mod * Math.pow(BENCH_HIT_PEN, 3);
	this.pip = pip;
	switch(variation){
		case "f":
			this.name = "Fire Storm";
			break;
		case "e":
			this.name = "Boulder Bash";
			break;
		case "a":
			this.name = "Tempest";
			break;
		case "w":
			this.name = "Ice Storm";
			break;
		default:
			this.name = "AOE no name set";
	} 
}

AOE.prototype.attack = function(user){
		var physical_damage = user.get_phys() * this.mod;
		var elemental_damage = user.get_ele() * this.mod;
		
		var target_team = user.enemy_team;
		
		for (var member of target_team.members_rem){
			if (target_team.active == member){
				var coll_hearts = true;
			} else {
				var coll_hearts = false;
			}
			member.calc_damage_taken(user, [Math.round(physical_damage), Math.round(elemental_damage)], coll_hearts);
		}
	}

function Boost(variation){
	this.element = variation;
	this.mod = 1;
	this.pip = 2;
	switch(variation){
		case fire:
			this.name = "Fire Boost";
			break;
		case earth:
			this.name = "Earth Boost";
			break;
		case air:
			this.name = "Air Boost";
			break;
		case water:
			this.name = "Water Boost";
			break;
		default:
			this.name = "Nothing boost";
	}
}

Boost.prototype.attack = function(user){
		for (var member of user.team.members_rem){
			if (member.element !== this.element){
				continue;
			}
			member.boost_up = true;
			var add_boost = true;
			for (var boost of member.ele_boosts){
				if (boost[0] == 1.35){
					boost[1] = 3;
					add_boost = false;
				}
			}
			
			if (add_boost){
				member.ele_boosts.push([1.35, 3]);
			}
		}
	}

function Poison(mod, pip){
	this.mod = mod * Math.pow(POISON_PEN, 2);
	this.pip = pip;
	this.name = "Poison";
}

Poison.prototype.attack = function(user){
		var dmg = user.get_phys() * this.mod;
		user.enemy_team.active.poisoned = [dmg, 3];
		user.enemy_team.gain_energy();
}

function Rolling_thunder(mod, pip){
	this.mod = mod * Math.pow(BENCH_HIT_PEN, 3);
	this.pip = pip;
	this.name = "Rolling Thunder";
}

Rolling_thunder.prototype.attack = function(user){
	var physical_damage = user.get_phys() * this.mod;
	var elemental_damage = user.get_ele() * this.mod;
		
	var hits = 3;
		
	var gained_energy = false;
		
	while(hits !== 0){
		
		var target_team = user.enemy_team;
		var num_targ = target_team.members_rem.length;
		
		if(num_targ == 0){
			return;
		}
			
		var target = target_team.members_rem[Math.floor(Math.random() * num_targ)];
		console.log(target.name);
		
		if (target_team.active == target){
			if (gained_energy){
				target_team.energy -= 1;
			}
			var coll_hearts = true;
			gained_energy = true;
		} else {
			var coll_hearts = false;
		}
			
		target.calc_damage_taken(user, [Math.round(physical_damage), Math.round(elemental_damage)], coll_hearts);
		target_team.check_if_ko();
		hits -= 1;
	}
}

function Stealth_strike(mod, pip){
	this.mod = mod * STEALTH_PEN;
	this.pip = pip;
	this.name = "Stealth Strike";
}

Stealth_strike.prototype.attack = function(user){
		var physical_damage = user.get_phys() * this.mod;
		var elemental_damage = user.get_ele();
		user.enemy_team.active.calc_damage_taken(user, [Math.round(physical_damage), Math.round(elemental_damage)], true);
		
		user.team.switchin(user.team.switchback);
	}

// update this later once Phantom shield / armor boost out
function Armor_break(mod, pip){
	this.mod = mod * Math.pow(ARMOR_IGNORE_PEN, 2);
	this.pip = pip;
	this.name = "Armor Break";
}

Armor_break.prototype.attack = function(user){
		var physical_damage = user.get_phys() * this.mod;
		var elemental_damage = user.get_ele() * this.mod;
		
		var target = user.enemy_team.active;
		var save = target.armor;
		
		target.armor = 0;
		
		target.calc_damage_taken(user, [Math.round(physical_damage), Math.round(elemental_damage)], true);
		
		target.armor = save;
	}

function Healing(mod, pip){
	this.mod = mod * SELFHEAL_PEN;
	this.pip = pip;
	this.name = "Healing"
}

Healing.prototype.attack = function(user){
		var to_heal = undefined;
		var lowest = 1;
		for (var member of user.team.members_rem){
			if (member == user){
				continue;
			}
			if (member.hp_perc() < lowest){
				to_heal = member;
				lowest = member.hp_perc();
			}
		}
		var total_heal = user.get_phys() * this.mod;
		
		user.heal(total_heal * 0.2);
		if (to_heal !== undefined){
			to_heal.heal(total_heal * 0.8);
		}
}

function Leech_blade(mod, pip){
	this.mod = mod * SELFHEAL_PEN;
	this.pip = pip;
	this.name = "Leech Blade";
}

Leech_blade.prototype.attack = function(user){
		var physical_damage = user.get_phys() * this.mod;
		user.heal(user.enemy_team.active.calc_damage_taken(user, [Math.round(physical_damage), 0], true) * 0.3);
	}

function Berserk(mod, pip){
	this.mod = mod;
	this.pip = pip;
	this.name = "Berserk";
}

Berserk.prototype.attack = function(user){
		var physical_damage = user.get_phys() * this.mod;
		var elemental_damage = user.get_ele();
		
		user.take_damage(user.enemy_team.active.calc_damage_taken(user, [Math.round(physical_damage), Math.round(elemental_damage)], true) * 0.2, false);
		if (user.hp_rem < 1){
			user.hp_rem = 1;
		}
	}

function Poison_hive(mod, pip){
	this.mod = mod * Math.pow(BENCH_HIT_PEN, 3) * Math.pow(POISON_PEN, 2);
	this.pip = pip;
	this.name = "Poison Hive";
}

Poison_hive.prototype.attack = function(user){
		var dmg = user.get_phys() * this.mod;
		for (var member of user.enemy_team.members_rem){
			member.poisoned = [dmg, 3];		
		}
		user.enemy_team.gain_energy();
}

function Regeneration(mod, pip){
	this.mod = mod * Math.pow(BENCH_HIT_PEN, 3) * Math.pow(SELFHEAL_PEN, 3);
	this.pip = pip;
	this.name = "Regeneration";
}

Regeneration.prototype.attack = function(user){
		var healing = user.get_phys() * this.mod;
		for (var member of user.team.members_rem){
			member.regen = [healing, 3];
			member.calc_regen(); 
		}
	}

function Vengeance(mod, pip){
	this.mod = mod;
	this.pip = pip;
	this.name = "Vengeance";
	
}

Vengeance.prototype.attack = function(user){
	var mod = this.mod * (1.5 - user.hp_perc());
	var physical_damage = user.get_phys() * mod;
	var elemental_damage = user.get_ele() * mod;
	user.enemy_team.active.calc_damage_taken(user, [Math.round(physical_damage), Math.round(elemental_damage)], true);
}

//untested
function Twister(mod, pip){
	this.mod = mod * Math.pow(BENCH_HIT_PEN, 3);
	this.pip = pip;
	this.name = "Twister";
}

Twister.prototype.attack = function(user){
		var mod = this.mod * (1.5 - user.hp_perc());
		console.log(mod);
		var physical_damage = user.get_phys() * mod;
		var elemental_damage = user.get_ele() * mod;
		
		var target_team = user.enemy_team;
		
		for (var member of target_team.members_rem){
			if (target_team.active == member){
				var coll_hearts = true;
			} else {
				var coll_hearts = false;
			}
			member.calc_damage_taken(user, [Math.round(physical_damage), Math.round(elemental_damage)], coll_hearts);
		}
	}

function Stealth_assault(mod, pip){
	this.mod = mod * Math.pow(BENCH_HIT_PEN, 3) * STEALTH_PEN;
	this.pip = pip;
	this.name = "Stealth Assault";
}

Stealth_assault.prototype.attack = function(user){
	var physical_damage = user.get_phys() * this.mod;
	var elemental_damage = user.get_ele() * this.mod;
	var target_team = user.enemy_team;
	for (var member of target_team.members_rem){
		if (target_team.active == member){
			var coll_hearts = true;
		} else {
			var coll_hearts = false;
		}
		member.calc_damage_taken(user, [Math.round(physical_damage), Math.round(elemental_damage)], coll_hearts);
	}
		
	user.team.switchin(user.team.switchback);
}

function Team_strike(mod, pip){
	this.mod = mod;
	this.pip = pip;
	this.name = "Team Strike";
}

Team_strike.prototype.attack = function(user){
	var pow = user.team.members_rem.length - 1;
	var mod = this.mod * Math.pow(RECOIL_MOD, pow);
	var physical_damage = user.get_phys() * mod;
	var elemental_damage = user.get_ele() * mod;
	
	var dmg = user.enemy_team.active.calc_damage_taken(user, [Math.round(physical_damage), Math.round(elemental_damage)], true); 
	for (var member of user.team.members_rem){
		member.hp_rem -= dmg / 6;
		member.hp_rem = Math.round(member.hp_rem);
	}
	if (user.hp_rem <= 1){
		user.hp_rem = 1;
	}
}

function Phantom_strike(mod, pip){
	this.pip = pip;
	this.mod = mod * Math.pow(BENCH_HIT_PEN, 3);
	this.name = "Phantom Strike"; 
}

Phantom_strike.prototype.attack = function(user){
	var physical_damage = user.get_phys() * this.mod;
	var elemental_damage = user.get_ele() * this.mod;
	var target_team = user.enemy_team;
	
	//first hit
	var pd = physical_damage * 1.33;
	var ed = elemental_damage * 1.33;
	target_team.active.calc_damage_taken(user, [Math.round(pd), Math.round(ed)], true);
	if (target_team.members_rem.length < 2){return;}
	
	//second hit
	var target = target_team.next();
	console.log(target);
	target.calc_damage_taken(user, [Math.round(physical_damage), Math.round(elemental_damage)], false);
	if (target_team.members_rem.length < 3){return;}
	
	//third hit
	pd = physical_damage * 0.67;
	ed = elemental_damage * 0.67;
	target = target_team.prev();
	console.log(target);
	target.calc_damage_taken(user, [Math.round(pd), Math.round(ed)], false);
}

function Phantom_shield(){
    this.pip = 2;
    this.mod = 1;
    this.name = "Phantom Shield";
}
Phantom_shield.prototype.attack = function(user){
    for (var member of user.team.members_rem){
        member.shield = 3;
    }
}