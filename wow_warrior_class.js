// The base values for both stats, might change them later
var OFFENSE = 33.73;
var HP = 107.0149;
var BENCH_HIT_PEN = 0.75;
var POISON_PEN = 0.67;
var splash;

function Element(name, color, weakness){
	this.name = name;
	this.color = color;
	this.weakness = weakness;
}



// work here
function swordbar(){
	canvas.fillStyle = "rgb(200, 200, 200)";
	canvas.fillRect(400, 750, 200, 50);
}



function Splash(text, color, x, y, size){
	this.text = text;
	this.color = color;
	this.x = x;
	this.y = y;
	this.size = size;
}

Splash.prototype = {
	update:function(){
		if (this.size == 1){
			this.kill();
			return;
		}
		this.size -= 1;
		canvas.font = this.size.toString() + "px " + "Arial";
		canvas.clearRect(0, 0, 500, 500);
		canvas.fillText(this.text, this.x, this.y);
	},
	
	run:function(){
		splash = this;
		splash.timer = setInterval(function(){ splash.update();}, 5);
	},
	
	kill:function(){
		clearInterval(this.timer);
	}
}



function Warrior(data, level) {
	this.name = data[0]
	this.off_mult = data[1][0];
	this.ele_rat = data[1][1];
	this.hp_mult = data[1][2];
	this.armor = data[1][3];
	this.element = data[2];
	this.special = data[3];
	this.level = level;
}

Warrior.prototype = {
	calc_stats:function(){
		this.base_hp = HP * this.hp_mult;
		this.max_hp = this.base_hp * Math.pow(1.07, this.level);
		
		this.base_off = OFFENSE * this.off_mult;
		this.base_ele = this.base_off * this.ele_rat;
		this.base_phys = this.base_off - this.base_ele;
		
		this.phys = this.base_phys * Math.pow(1.07, this.level);
		this.ele = this.base_ele * Math.pow(1.07, this.level);
		
		this.phys = Math.round(this.phys);
		this.ele = Math.round(this.ele);
		this.max_hp = Math.round(this.max_hp);
	},
	
	get_phys:function(){
		return this.phys;
	},
	
	get_ele:function(){
		var mult = 1;
		for (var boosts of this.ele_boosts){
			mult += boosts[0];
		}
		return this.ele * mult;
	},
	
	get_armor:function(){
		return 1 - this.armor * 0.12;
	},
	
	print_stats:function(){
		console.log(this.get_phys());
		console.log(this.get_ele());
		console.log(this.max_hp);
	},
	
	card_background:function(x, y, w, h){
		//Background
		canvas.fillStyle = "rgb(255, 255, 0)";
		canvas.fillRect(x, y, w, h);
		
		//Foreground
		canvas.fillStyle = this.element.color;
		canvas.fillRect(x + 25, y + 25, w - 50, h - 50);
	},
	
	card_level:function(x, y, w, h){
		canvas.fillStyle = "rgb(255, 200, 125)";
		canvas.beginPath();
        canvas.moveTo(x + 25, y + 25);
        canvas.lineTo(x + 25 + w / 10, y + 25);
        canvas.lineTo(x + 25 + w / 10, y + 25 + h / 7);
        canvas.lineTo(x + 25 + w / 20, y + 25 + h / 4);
        canvas.lineTo(x + 25, y + 25 + h / 7);
        canvas.fill();
        
        canvas.fillStyle = "rgb(0, 0, 0)";
        canvas.font = "30px Ariel";
        canvas.fillText(this.level, x + 25, y + 60);
	},
	
	card_name:function(x, y, w, h){
		canvas.fillText(this.name, x + 110, y + 50);
	},
	
	card_stats:function(x, y, w, h){
		//Stats
		canvas.fillStyle = "rgb(255, 255, 255)";
		canvas.fillRect(x + 75, y + h * 0.375, w * 0.2, h * 0.1);
		canvas.fillRect(x + 75, y + h * 0.5, w * 0.2, h * 0.1);
		canvas.fillRect(x + 75, y + h * 0.625, w * 0.2, h * 0.1);
		
		canvas.fillStyle = "rgb(0, 0, 0)";
		// Make this scale with card size later
		canvas.font = "30px Ariel";
			
		this.calc_stats();
			
		canvas.fillText(this.phys, x + 75, y + h * 0.375 + 35);
		canvas.fillText(this.ele, x + 75, y + h * 0.5 + 35);
		canvas.fillText(this.max_hp, x + 75, y + h * 0.625 + 35);
	},
	
	card_special:function(x, y, w, h){
		canvas.fillText(this.special.name, x + w * 0.8, y + h * 0.15);
	},
	
	display_warrior_card:function(x, y){
		var w = 800;
		var h = w / 2;
		
		this.card_background(x, y, w, h);
		this.card_level(x, y, w, h);
		this.card_name(x, y, w, h);
		this.card_stats(x, y, w, h);
		this.card_special(x, y, w, h);
	},
	
	calc_damage_taken:function(attacker, damage, heart_coll){
		var physical_damage = damage[0] * this.get_armor();
		var elemental_damage = damage[1];
		
		if (this.element.weakness == attacker.element.name){
			elemental_damage *= 1.72;
		}
		
		else if (attacker.element.weakness == this.element.name){
			elemental_damage *= 0.28;
		}
		
		this.take_damage([Math.round(physical_damage), Math.round(elemental_damage)], heart_coll);
	},
	
	check_if_ko:function(){
		return this.hp_rem <= 0;
	},
	
	take_damage:function(damage, heart_coll){
		var dmg = damage[0] + damage[1];
		console.log(dmg, this.hp_rem);
		this.hp_rem -= dmg;
		console.log(this.hp_rem);
		if (!this.check_if_ko()){
			if (heart_coll){
				this.heal(dmg * 0.4);
			}
		}
		console.log(this.hp_rem);
		this.hp_rem = Math.round(this.hp_rem);
	},
	
	heal:function(hp){
		this.hp_rem += hp;
		if (this.hp_rem > this.max_hp){
			this.hp_rem = this.max_hp;
		}
	},
	
	check_durations:function(){
		var boosts_rem = [];
		for (var boost of this.ele_boosts){
			if (boost[1] !== 1){
				boosts_rem.push([boost[0], boost[1] - 1]);
			}
		}
		this.ele_boosts = boosts_rem;
	},
	
	calc_poison:function(){
		if (!this.poisoned){return;}
		this.hp_rem -= this.poisoned[0];
		this.poisoned[1] -= 1;
	},
	
	draw_prep:function(){
		this.tilt = 0;
		this.lfist = 0;
		this.rfist = 1;
		//this.sword_tilt = 45;
		//this.torso_bend = 0;
		//this.knee_bend = 45;
	},
	
	draw_torso:function(x, y, s, facing){
		//Add color choices later
		canvas.translate(x, y);
		if (facing == "left"){
			canvas.rotate(this.tilt * Math.PI/180);
		}
		
		else if (facing == "right"){
			canvas.rotate(-this.tilt * Math.PI/180);
		}
		
		canvas.fillStyle = "rgb(0, 0, 0)";
		canvas.fillRect(0, 0, s, s * 2);
		
		canvas.translate(s / 2, s * 2);
		
		canvas.fillStyle = "rgb(255, 0, 0)";
		
		if (facing == "left"){
			canvas.rotate(this.torso_bend * Math.PI/180);
		}
		
		else if (facing == "right"){
			canvas.rotate(-this.torso_bend * Math.PI/180);
		}
		
		canvas.fillRect(-s / 2, 0, s, s);
	},
	
	draw_leg:function(x, y, s, facing){
		//canvas.translate(x + s * this.torso_bend / 90, (y + s) - this.torso_bend / 90);
		canvas.translate(s * (this.torso_bend / 90), s * (1 - this.torso_bend / 90));
		canvas.rotate(this.knee_bend * Math.PI/180);
		canvas.fillStyle = "rgb(0, 255, 0)";
		canvas.fillRect(-s / 4, 0, s / 2, s);	
	},
	
	// Maybe split this up later?
	draw_simple:function(x, y, s, facing){
		canvas.translate(x + s / 2, y);
		if (facing == "left"){
			canvas.rotate(this.tilt * Math.PI/180);
		}
		
		else if (facing == "right"){
			canvas.rotate(-this.tilt * Math.PI/180);
		}
		// change this later
		// Torso
		canvas.fillStyle = "rgb(0, 0, 0)";
		canvas.fillRect(-s / 2, 0, s, s * 2);
		
		// Head
		canvas.fillStyle = "rgb(232, 208, 169)";
        canvas.beginPath();
        canvas.arc(0, -s / 2, s / 2, 0, 2 * Math.PI);
        canvas.fill();
        
        // left hand
        canvas.fillStyle = "rgb(232, 208, 169)";
        
        if (facing == "left"){
        	shift = -this.lfist;
        }
        
        else if (facing == "right"){
        	shift = this.lfist;
        }
        
        else {
        	shift = 1;
        }
        
        canvas.beginPath();
        canvas.arc(shift * s, s, s / 4, 0, 2 * Math.PI);
        canvas.fill();
        /*
        // sword
        canvas.fillStyle = "rgb(200, 200, 200)";
        canvas.translate(shift * s, s);
        if (facing == "left"){
			canvas.rotate(this.sword_tilt * Math.PI/180);
		}
		
		else if (facing == "right"){
			canvas.rotate(-this.sword_tilt * Math.PI/180);
		}
        */
        
        
        // right hand
        canvas.fillStyle = "rgb(232, 208, 169)";
        
        if (facing == "left"){
        	shift = -this.rfist;
        }
        
        else if (facing == "right"){
        	shift = this.rfist;
        }
        
        else{
        	shift = -1;
        }
        
        canvas.beginPath();
        canvas.arc(shift * s, s, s / 4, 0, 2 * Math.PI);
        canvas.fill();
	},
	
	// maybe add complex model later
	draw:function(x, y, s, facing){
		canvas.save();
		//this.draw_torso(x, y, s, facing);
		//this.draw_leg(x, y, s, facing);
		this.draw_simple(x, y, s, facing);
		canvas.restore();
	},
	
	tip:function(degrees) {
		this.tilt = degrees;
	},
	
	crouch:function(degrees){
		this.torso_bend = degrees;
	},
	
	use_special:function(){
		this.special.attack(this);
	}
}



function Team(members){
	this.members_rem = members;
}

Team.prototype = {
	assign_enemy:function(enemy_team){
		this.enemy_team = enemy_team;
		for (var member of this.members_rem){
			member.enemy_team = enemy_team;
		}
	},
	
	init_for_battle:function(){
		for (var member of this.members_rem){
			member.team = this;
			member.calc_stats();
			member.hp_rem = member.max_hp;
			member.ele_boosts = [];
			member.poisoned = false;
		}
		this.leader = this.members_rem[0];
		this.active = this.members_rem[0];
	},
	
	// work here
	check_lead:function(){
		if (!this.leader.check_if_ko()){
			console.log("leader skill");
		}
	},
	
	check_durations:function(){
		for (var member of this.members_rem){
			member.check_durations();
			member.calc_poison();
		}
	},
	
	check_if_ko:function(){
		var new_members_rem = [];
		for (var member of this.members_rem){
			if (!member.check_if_ko()){
				new_members_rem.push(member);
			}
		}
		this.members_rem = new_members_rem;
	},
	
	//modify later
	turn:function(){
		this.check_durations();
		this.check_if_ko();
		this.check_lead();
	}
}



function Battle(team1, team2){
	this.teams = [team1, team2];
	for (var team of this.teams){
		var slice = this.teams.slice();
		var enemy = slice.splice(this.teams.indexOf(team), 1);
		team.assign_enemy(slice[0]);
	}
}

Battle.prototype = {
	init:function(){
		for (var team of this.teams){
			team.init_for_battle();
		}
	}
}



// Special moves
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

Ele_beat.prototype = {
	attack:function(user){
		var physical_damage = user.get_phys() * this.mod;
		var elemental_damage = user.get_ele();
		
		user.enemy_team.active.calc_damage_taken(user, [Math.round(physical_damage), Math.round(elemental_damage)], true);
	}
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

AOE.prototype = {
	attack:function(user){
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
}



function Boost(mod, pip, variation){
	this.element = variation;
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

Boost.prototype = {
	attack:function(user){
		for (var member of user.team.members_rem){
			if (member.element !== this.element){
				continue;
			}
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
}




function Poison(mod, pip){
	this.mod = mod * Math.pow(POISON_PEN, 2);
	this.pip = pip;
	this.name = "Poison";
}

Poison.prototype = {
	attack:function(user){
		var dmg = user.get_phys() * this.mod;
		user.enemy_team.active.poisoned = [dmg, 3];	
	}
}



function Rolling_thunder(mod, pip){
	this.mod = mod * Math.pow(BENCH_HIT_PEN, 3);
	this.pip = pip;
	this.name = "Rolling Thunder";
}

Rolling_thunder.prototype = {
	attack:function(user){
		var physical_damage = user.get_phys() * this.mod;
		var elemental_damage = user.get_ele() * this.mod;
		
		var hits = 3;
		
		var target_team = user.enemy_team;
		
		var num_targ = target_team.members_rem.length;
		
		while(hits !== 0){
			var target = target_team.members_rem[Math.floor(Math.random() * num_targ)];
			console.log(target.name);
			
			if (target_team.active == target){
				var coll_hearts = true;
			} else {
				var coll_hearts = false;
			}
			target.calc_damage_taken(user, [Math.round(physical_damage), Math.round(elemental_damage)], coll_hearts);
			
			hits -= 1;
		}
	}
}
