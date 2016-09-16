// move this to another doc later
// buggy, scrolling messes it up
function check_click(event){
	var x = event.clientX;
    var y = event.clientY;
    
    for (var button of active_buttons){
    	button.check_if_click(x, y);
    }
}

var active_buttons = [];

//var canvas_data = document.getElementById("canvas");
var canvas_width = 1000;


// The base values for both stats, might change them later
var OFFENSE = 33.73;
var HP = 107.0149;

var BENCH_HIT_PEN = 0.75;
var POISON_PEN = 0.67;
var STEALTH_PEN = 0.8;
var ARMOR_IGNORE_PEN = 0.88;
var SELFHEAL_PEN = 0.8;
var RECOIL_MOD = 1.2;

var b;
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



function Button(text, color, x, y, width, height, functions){
	this.text = text;
	this.color = color;
	this.x = x;
	this.y = y;
	this.w = width;
	this.h = height;
	this.functions = functions;
}

Button.prototype = {
	// change this to scale text based on length of this.text
	draw:function(){
		if (this.color !== "none"){
			canvas.fillStyle = this.color;
			canvas.fillRect(this.x, this.y, this.w, this.h);
		}
		canvas.font = "10px Arial";
		canvas.fillStyle = "rgb(0, 0, 0)";
		canvas.fillText(this.text, this.x, this.y + this.h / 2);
	},
	
	check_if_click:function(x, y){
		if (x >= this.x && x <= this.x + this.w && y >= this.y && y <= this.y + this.h){
			for (var f of this.functions){
				f();
			}
		}
	}
}


function Splash(text, color, x, y, size){
	this.text = text;
	this.color = color;
	this.x = x;
	this.y = y;
	this.size = size;
}
// work on text clearing
Splash.prototype = {
	update:function(){
		if (this.size < 1){
			this.kill();
			return;
		}
		this.size -= 0.5;
		canvas.font = this.size.toString() + "px " + "Arial";
		//canvas.clearRect(this.x, this.y, this.text.legth * this.size, this.text.length * this.size);
		canvas.fillStyle = this.color;
		//canvas.fillText(this.text, this.x, this.y);
	},
	
	run:function(){
		splash = this;
		splash.timer = setInterval(function(){ splash.update();}, 10);
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
	this.lead_skill = data[4];
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
		var mult = 1;
		for (var boosts of this.phys_boosts){
			mult += boosts[0];
		}
		return Math.round(this.phys * mult);
	},
	
	get_ele:function(){
		var mult = 1;
		for (var boosts of this.ele_boosts){
			mult += boosts[0];
		}
		return Math.round(this.ele * mult);
	},
	
	get_armor:function(){
		return 1 - this.armor * 0.12;
	},
	
	hp_perc:function(){
	/*
	Returns the percentage of your HP remaining
	AS A VALUE BETWEEN 0 AND 1
	NOT 0 AND 100
	*/
		return this.hp_rem / this.max_hp;
	},
	
	perc_hp:function(perc){
	/*
	Returns how much of your max HP will equal perc
		Example:
			With 200 HP, this.perc_hp(0.5) will return 100
	*/
		return this.max_hp * (perc);
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
	
	display_warrior_card:function(){
		var x = 0;
		var y = 0;
		var w = 1000;
		var h = w / 2;
		
		this.card_background(x, y, w, h);
		this.card_level(x, y, w, h);
		this.card_name(x, y, w, h);
		this.card_stats(x, y, w, h);
		this.card_special(x, y, w, h);
	},
	
	display_stats:function(){
		canvas.fillStyle = "rgb(255, 255, 255)";
		canvas.fillRect(300, 100, 400, 200);
		
		canvas.fillStyle = "rgb(0, 0, 0)";
		canvas.font = "40px Ariel";
		canvas.fillText(this.name, 300, 130);
		canvas.fillText("Physical: " + this.get_phys().toString(), 300, 170);
		canvas.fillText("Elemental: " + this.get_ele().toString(), 300, 210);
		canvas.fillText("Max HP: " + this.max_hp.toString(), 300, 250);
		canvas.fillText("Armor: " + this.armor.toString(), 300, 290);
	},
	
	calc_damage_taken:function(attacker, damage, coll_hearts){
		var physical_damage = damage[0] * this.get_armor();
		var elemental_damage = damage[1];
		
		if (this.element.weakness == attacker.element.name){
			elemental_damage *= 1.7;
		}
		
		else if (attacker.element.weakness == this.element.name){
			elemental_damage *= 0.3;
		}
		
		var dmg = Math.round(physical_damage) + Math.round(elemental_damage);
		this.take_damage(dmg, coll_hearts);
		return dmg;
	},
	
	check_if_ko:function(){
		return this.hp_rem <= 0;
	},
	
	use_normal_move:function(){
		var physical_damage = this.get_phys();
		var elemental_damage = this.get_ele();
		
		var user = this;
		
		this.enemy_team.active.calc_damage_taken(user, [Math.round(physical_damage), Math.round(elemental_damage)], true);
		this.enemy_team.turn_part1();
	},
	
	take_damage:function(damage, heart_coll){
		var dmg = damage;
		console.log("Damage: ", dmg);
		this.hp_rem -= dmg;
		if (!this.check_if_ko()){
			if (heart_coll){
				this.last_dmg = dmg;
			}
		}
		if (heart_coll){
			this.team.en_coll = true;
		}
		this.hp_rem = Math.round(this.hp_rem);
	},
	
	heart_collection:function(){
		var X = this;
		active_buttons.push(new Button("", "rgb(255, 0, 0)", 300, 50, 100, 100, [X.nat_regen.bind(X)]));
	},
	
	bomb:function(){
		var X = this;
		var f = function(){
			var d = X.perc_hp(0.15);
			X.hp_rem -= d;
			if (X.hp_rem <= 1){
				X.hp_rem = 1;
			}
			X.hp_rem = Math.round(X.hp_rem);
		}
		var t = X.team;
		active_buttons.push(new Button("", "rgb(0, 0, 0)", 350, 150, 100, 100, [f, t.turn_part2.bind(t)]));
	},
	
	energy_collection:function(){
		var X = this.team;
		active_buttons.push(new Button("", "rgb(0, 0, 255)", 400, 50, 100, 100, [X.gain_energy.bind(X), X.turn_part2.bind(X)]));
	},
	
	nat_regen:function(){
		var x = this;
		this.heal(x.last_dmg * 0.4);
	},
	
	reset_dmg:function(){
		this.last_dmg = 0;
	},
	
	heal:function(hp){
	/*
	Restore HP
	Prevents from healing past full
	Also rounds for you
	*/
		console.log("Healed " + hp);
		this.hp_rem += hp;
		if (this.hp_rem > this.max_hp){
			this.hp_rem = this.max_hp;
		}
		this.hp_rem = Math.round(this.hp_rem);
	},
	
	check_durations:function(){
		this.boost_up = false;
		var phys_boosts_rem = [];
		for (var boost of this.phys_boosts){
			if (boost[1] !== 0){
				phys_boosts_rem.push([boost[0], boost[1] - 1]);
			}
		}
		this.phys_boosts = phys_boosts_rem;
		
		var ele_boosts_rem = [];
		for (var boost of this.ele_boosts){
			if (boost[1] !== 0){
				ele_boosts_rem.push([boost[0], boost[1] - 1]);
			}
			if (boost[0] == 1.35 && boost[1] > 0){
				this.boost_up = true;
			}
		}
		this.ele_boosts = ele_boosts_rem;
	},
	
	calc_poison:function(){
		if (!this.poisoned){return;}
		if (this.poisoned[1] == 0){
			this.poisoned = false;
			return;
		}
		console.log("Poison damage: " + this.poisoned[0]);
		this.hp_rem -= this.poisoned[0];
		this.hp_rem = Math.round(this.hp_rem);
		this.poisoned[1] -= 1;
	},
	
	calc_regen:function(){
		if (!this.regen){return;}
		if (this.regen[1] == 0){
			this.regen = false;
			return;
		}
		this.hp_rem += this.regen[0];
		this.hp_rem = Math.round(this.hp_rem);
		this.regen[1] -= 1;
	},
	
	display_health:function(x, y){
		canvas.fillStyle = this.element.color;
		
		if (this.boost_up){
			canvas.fillRect(x, y, 100, 50);
		}
		
		canvas.beginPath();
		canvas.arc(x - 50, y + 50, 50, 0, 2 * Math.PI);
		canvas.fill();
		
		var bar_width = this.hp_perc() * 100;
		
		canvas.fillStyle = "rgb(255, 0, 0)";
		if (this.check_if_ko()){
			canvas.fillStyle = "rgb(0, 0, 0)";
		}
		if (this.poisoned !== false){
			canvas.fillStyle = "rgb(0, 255, 0)";
		}
		canvas.fillRect(x, y + 25, bar_width, 25);
		
		canvas.fillStyle = "rgb(0, 0, 0)";
		canvas.font = "30px Ariel";
		canvas.fillText(this.name, x, y + 20);
		if (!this.regen){
			canvas.fillText(this.hp_rem, x, y + 45);
		} else {
				canvas.fillText(this.hp_rem + "+", x, y + 45);
			}
	},
	
	say_name:function(){
		var text = this.name + " up!";
		var n = new Splash(text, this.element.color, this.team.x, 250, 100);
		n.run();
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
		//var s = new Splash(this.special.name + "!", this.element.color, this.team.x, 250, 100);
		//s.run();
		this.team.switchback = this.team.active;
		this.team.switchin(this);
		this.special.attack(this);
		this.team.energy -= 2;
		this.team.enemy_team.turn_part1();
	}
}



function Lead(amount, type){
	this.amount = amount / 100;
	this.type = type;
}

// need healing effects
Lead.prototype = {
	apply:function(team){
		if (this.amount >= 0.05){
			var target = team;
		}
		if (this.amount < 0.05){
			var target = team.enemy_team;
		}
		if (this.type == "p"){
			for (var member of target.members_rem){
				member.phys_boosts.push([this.amount, 1]);
			}
		}
		if (this.type == "f"){
			for (var member of target.members_rem){
				if (member.element == fire){
					member.ele_boosts.push([this.amount, 1]);
				}
			}
		}
		if (this.type == "e"){
			for (var member of target.members_rem){
				if (member.element == earth){
					member.ele_boosts.push([this.amount, 1]);
				}
			}
		}
		if (this.type == "a"){
			for (var member of target.members_rem){
				if (member.element == air){
					member.ele_boosts.push([this.amount, 1]);
				}
			}
		}
		if (this.type == "w"){
			for (var member of target.members_rem){
				if (member.element == water){
					member.ele_boosts.push([this.amount, 1]);
				}
			}
		}
		
	}
}



function Team(members, name){
	this.members_rem = members;
	this.name = name;
	teams.push(this);
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
			member.phys_boosts = [];
			member.ele_boosts = [];
			member.poisoned = false;
			member.regen = false;
		}
		this.leader = this.members_rem[0];
		this.active = this.members_rem[0];
		this.energy = 2;
		this.en_coll = false;
		this.active.last_dmg = 0;
	},
	
	display_vs: function(){
		canvas.fillStyle = "rgb(255, 255, 255)";
		canvas.fillRect(300, 25, 400, 50);
		
		var message = this.active.name + " VS " + this.enemy_team.active.name;
		canvas.fillStyle = "rgb(0, 0, 0)";
		canvas.font = "30px Ariel";
		canvas.fillText(message, 305, 50);
	},
	
	display_all_hp:function(){
		var y = 0;
		for (var member of this.members_rem){
			member.display_health(this.x, y);
			var x = this.x - 100;
			active_buttons.push(new Button("", "none", x, y, 100, 100, [member.display_stats.bind(member)]));
			y += 100;
		}
	},
	
	
	// shorten these buttons
	display_nm:function(){
		var team = this;
		var new_button = new Button("Normal Move", team.active.element.color, 475, 325, 100, 100, [team.active.use_normal_move.bind(team.active)]);
		active_buttons.push(new_button);
		new_button.draw();
	},
	
	display_specials:function(){
	/*
	List all of a team's Special Moves
	as icons across the screen.
	Click on them to use them.
	*/
		var x = this.x - 200;
		var team = this;
		for (var member of team.members_rem){
			var new_button = new Button(member.special.name, member.element.color, x, 325, 100, 100, [member.use_special.bind(member)]);
			active_buttons.push(new_button);
			x += canvas_width * 0.1;
			
		}
	},
	
	
	
	display_energy:function(){
		canvas.fillStyle = "rgb(0, 100, 255)";
		var x = this.x - 150;
		for (var count = 0; count < this.energy; count ++){
			canvas.beginPath();
			canvas.arc(x, 450, 25, 0, 2 * Math.PI);
			canvas.fill();
			x += 75;
		}
	},
	
	gain_energy:function(){
		if (this.energy < 0){
			this.energy = 0;
		}
		if (this.energy < 4){
			this.energy += 1;
		}
	},
	
	check_lead:function(){
		if (!this.leader.check_if_ko()){
			var team = this;
			this.leader.lead_skill.apply(team);
		}
	},
	
	next:function(num){
		var nextup = num + 1;
		if (nextup >= this.members_rem.length){
			nextup = 0;
		}
		return nextup;
	},
	
	switchin:function(warrior){
		for (var member of this.members_rem){
			if (this.members_rem.length == 1){
				this.active = this.members_rem[0];
				this.active.say_name();
				return;
			}
			if (typeof warrior == "number"){
				if (this.members_rem.length <= warrior){
					warrior = 0;
				}
				this.active = this.members_rem[warrior];
				this.active.say_name();
				return;
			}
			
			if (member == warrior){
				this.active = member;
				this.active.say_name();
				return;
			}
			if (member.name == warrior){
				this.active = member;
				this.active.say_name();
				return;
			}
		}
		console.log("That warrior isn't on that team");
	},
	
	check_durations:function(){
		for (var member of this.members_rem){
			member.check_durations();
			member.calc_poison();
			member.calc_regen();
		}
	},
	
	check_if_ko:function(){
		// He's ded Jim!
		var lead_ded = false;
		if (this.active.hp_rem <= 0){
			lead_ded = true;
			var index = this.members_rem.indexOf(this.active);
		}
		var new_members_rem = [];
		for (var member of this.members_rem){
			if (!member.check_if_ko()){
				new_members_rem.push(member);
			}
		}
		this.members_rem = new_members_rem;
		
		if (this.members_rem.length == 0){
			this.enemy_team.win();
		}
		
		if (this.active.hp_rem <= 0){
			this.switchin(index);
		}
	},
	
	turn_part1:function(){
		/*
		Heart collection phase
		*/
		
		clear_canvas();
		active_buttons = [];
		this.display_all_hp();
		this.display_energy();
		this.display_vs();
		this.enemy_team.display_all_hp();
		this.enemy_team.display_energy();
		
		if (this.en_coll){
			this.active.energy_collection();
		}
		if (this.active.last_dmg > 0){
			this.active.heart_collection();
			this.active.bomb();
		}
		if (!this.en_coll && (this.active.last_dmg >= 0 || this.active.last_dmg == undefined)){
			this.turn_part2();
			return;
		}
		
		for (var button of active_buttons){
			button.draw();
		}
	},
	
	turn_part2:function(){
		/*
		Action phase
		*/
		
		clear_canvas();
		active_buttons = [];
		this.active.reset_dmg();
		this.en_coll = false;
		this.check_lead();
		this.check_durations();
		this.check_if_ko();
		this.display_all_hp();
		this.display_energy();
		this.display_nm();
		this.display_vs();
		
		this.enemy_team.display_all_hp();
		this.enemy_team.display_energy();
		
		if (this.energy >= 2){
			this.display_specials();
		}
		for (var button of active_buttons){
			button.draw();
		}
	},
	
	win:function(){
		console.log(this.name + " wins!");
	}
}



function Battle(team1, team2){
	this.teams = [team1, team2];
	for (var team of this.teams){
		var slice = this.teams.slice();
		var enemy = slice.splice(this.teams.indexOf(team), 1);
		team.assign_enemy(slice[0]);
	}
	team1.x = 200;
	team2.x = 800;
}

Battle.prototype = {
	init:function(){
		for (var team of this.teams){
			team.init_for_battle();
		}
	},
	
	start:function(){
		//add random later
		this.teams[0].turn_part1();
	}
}


/*
These are Special Moves, powerful attacks that warriors can use.
Each warrior comes with a preselected Special Move, which is determined in their data.
Each Special Move has 2-3 arguments:
The mod, which determines how powerful the Special Move is compared to the user's Normal Move.
The pip, which shows how strong the user's Special Move is compared to warriors with the same Special Move.
And sometimes, the variation: Which is usually based on the user's Element.
*/

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
		user.enemy_team.en_coll = true;	
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
		console.log(to_heal);
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
	this.mod = mod * RECOIL_MOD;
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
		user.enemy_team.en_coll = true;
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


// untested
function Vengeance(mod, pip){
	this.mod = mod;
	this.pip = pip;
	this.name = "Vengeance";
	
}

Vengeance.prototype.attack = function(user){
		var mod = this.mod * (1.5 - user.hp_perc());
		var physical_damage = user.get_phys() * mod;
		var elemental_damage = user.get_ele() * mod;
		user.enemy_team.active.calc_damage_taken(user, [Math.round(physical_damage), Math.round(elemental_damage)], true)
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
