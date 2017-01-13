function Arcphantom_strike(mod, pip){
	this.pip = pip;
	this.mod = mod * Math.pow(BENCH_HIT_PEN, 3);
	this.name = "Arcphantom Strike"; 
}

Arcphantom_strike.prototype.attack = function(user){
	var physical_damage = user.get_phys() * this.mod;
	var elemental_damage = user.get_ele() * this.mod;
	var target_team = user.enemy_team;
	
	//first hit
	var pd = physical_damage * 0.67;
	var ed = elemental_damage * 0.67;
	target_team.active.calc_damage_taken(user, [Math.round(pd), Math.round(ed)], true);
	if (target_team.members_rem.length < 2){return;}
	
	//second hit
	var target = target_team.next();
	target.calc_damage_taken(user, [Math.round(physical_damage), Math.round(elemental_damage)], false);
	if (target_team.members_rem.length < 3){return;}	
	console.log(target);
	//third hit
	pd = physical_damage * 1.33;
	ed = elemental_damage * 1.33;
	target = target_team.prev();
	target.calc_damage_taken(user, [Math.round(pd), Math.round(ed)], false);
	console.log(target);
}

function Combo_rolling_thunder(mod, pip){
	this.mod = mod * Math.pow(BENCH_HIT_PEN, 3);
	this.pip = pip;
	this.name = "Combo rolling Thunder";
}

Combo_rolling_thunder.prototype.attack = function(user){
	var physical_damage = user.get_phys() * this.mod;
	var elemental_damage = user.get_ele() * this.mod;
	
	switch (user.team.energy) {
		case 2:
			var hits = 3;
			break;
		case 3:
			var hits = 4;
			break;
		case 4:
			var hits = 6;
			break;
	}
		
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

function Bomb(mod, pip){
	this.mod = mod * Math.pow(BENCH_HIT_PEN, 3);
	this.pip = pip;
	this.name = "Bomb";
}

Bomb.prototype.attack = function(user){
	var physical_damage = user.get_phys() * this.mod;
	var elemental_damage = user.get_ele() * this.mod;
	
	var target_team = user.enemy_team;
		
	switch (user.team.energy) {
		case 2:
			var hits = 3;
			break;
		case 3:
			var hits = 4;
			break;
		case 4:
			var hits = 6;
			break;
		}
		
	while(hits !== 0){
		if (target_team.check_if_ko()){return;}
		for (var member of target_team.members_rem){
			if (gained_energy){
				target_team.energy -= 1;
			}
			if (target_team.active == member){
				var coll_hearts = true;
				var gained_energy = true;
			} else {
				var coll_hearts = false;
			}
			member.calc_damage_taken(user, [Math.round(physical_damage), Math.round(elemental_damage)], coll_hearts);
			target_team.check_if_ko();
		}
		hits -= 1;
	}
}


var matt = ["Matt", [1.1557, 0.3, 1.13, 1], earth, new Arcphantom_strike(1.4, 2), new Lead(-30, "f")];
var nick = ["Nick", [1.2, 0.2, 0.98, 1], earth, new Combo_rolling_thunder(1.6, 3), new Lead(10, "h")];
var paul = ["Paul", [1, 0.3, 1.3, 2], water, new Bomb(1.75, 3), new Lead(-30, "f")];
warriors = warriors.concat([matt, nick, paul]);