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

var b;

function Element(name, color, weakness){
	this.name = name;
	this.color = color;
	this.weakness = weakness;
}

var fire = new Element("Fire", "rgb(255, 0, 0)", "Water");
var earth = new Element("Earth", "rgb(0, 255, 0)", "Fire");
var air = new Element("Air", "rgb(255, 255, 0)", "Earth");
var water = new Element("Water", "rgb(0, 0, 255)", "Air");
var no_ele = new Element("Null", "rgb(100, 100, 100)", undefined);

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
		canvas.fillText(this.text, this.x + this.w / 2 - this.text.length * 10, this.y + this.h / 2);
	},
	
	check_if_click:function(x, y){
		if (x >= this.x && x <= this.x + this.w && y >= this.y && y <= this.y + this.h){
			for (var f of this.functions){
				f();
			}
		}
	}
}

function Warrior(data, level) {
	/*
	The warrior Class takes data from an array:
	new Warrior([name, [off, ele, hp, arm], element, special, leader_skill], level);
	*/
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
		/*
		Calculate a warrior's stats
		Increases by 7% per level
		*/
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
	    var reduction = 1 - this.armor * 0.12;
		if (this.shield != false){
		    reduction *= 0.45;
		}
		console.log(reduction);
		return reduction;
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
	
	// make scale better
	display_warrior_card:function(x, y, size){
		/*
		Draws a card displaying information about a warrior.
		*/
		
		var w = size;
		var h = w / 2;
		
		var font_size = w * 0.05;
		var font = font_size.toString() + "px Monospace";
		canvas.font = font;
		
		//Background
		canvas.fillStyle = "rgb(255, 215, 0)";
		canvas.fillRect(x, y, w, h);
		
		//Foreground
		var fg_shift = w * 0.05
		canvas.fillStyle = this.element.color;
		canvas.fillRect(x + fg_shift, y + fg_shift, w - fg_shift * 2, h - fg_shift * 2);
		
		// The level shield thing
		canvas.fillStyle = "rgb(255, 200, 125)";
		canvas.beginPath();
        canvas.moveTo(x + 25, y + 25);
        canvas.lineTo(x + 25 + w / 10, y + 25);
        canvas.lineTo(x + 25 + w / 10, y + 25 + h / 7);
        canvas.lineTo(x + 25 + w / 20, y + 25 + h / 4);
        canvas.lineTo(x + 25, y + 25 + h / 7);
        canvas.fill();
        
        // Level numerator
        canvas.fillStyle = "rgb(0, 0, 0)";
        canvas.fillText(this.level, x + 25, y + 60);
        
        // Level denominator
        // add this later
		
		//Stats
		canvas.fillStyle = "rgb(255, 255, 255)";
		canvas.fillRect(x + 75, y + h * 0.375, w * 0.2, h * 0.1);
		canvas.fillRect(x + 75, y + h * 0.5, w * 0.2, h * 0.1);
		canvas.fillRect(x + 75, y + h * 0.625, w * 0.2, h * 0.1);
		
		canvas.fillStyle = "rgb(0, 0, 0)";
			
		this.calc_stats();
			
		canvas.fillText(this.phys, x + 75, y + h * 0.375 + 35);
		canvas.fillText(this.ele, x + 75, y + h * 0.5 + 35);
		canvas.fillText(this.max_hp, x + 75, y + h * 0.625 + 35);
		
		//Armor: replace with shield sprite later
		canvas.fillStyle = "rgb(100, 100, 100)";
		for(var i = 0; i <= this.armor; i++){
			canvas.fillRect(x + 75 + (w * 0.1 * i), y + h * 0.75, w * 0.05, h * 0.05);
		}

		// Name
		canvas.fillText(this.name, x + 110, y + 50);
		
		// Special
		var spec_shift = this.special.name.length * font_size + fg_shift;
        canvas.fillText(this.special.name, x + w - spec_shift, y + h * 0.15);
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
	
	calc_damage_taken:function(attacker, damage){
		var physical_damage = damage[0] * this.get_armor();
		var elemental_damage = damage[1];
		
		if (this.element.weakness == attacker.element.name){
			elemental_damage *= 1.7;
		}
		
		else if (attacker.element.weakness == this.element.name){
			elemental_damage *= 0.3;
		}
		
		var dmg = Math.round(physical_damage) + Math.round(elemental_damage);
		this.take_damage(dmg);
		
		console.log("Damage: " + dmg);
		
		return dmg;
	},
	
	check_if_ko:function(){
	/*
	An I dead yet?
	*/
		return this.hp_rem <= 0;
	},
	
	use_normal_move:function(){
	/*
	Strike at your enemy team's active warrior with your sword!
	*/
		var physical_damage = this.get_phys();
		var elemental_damage = this.get_ele();
		
		var user = this;
		this.enemy_team.gain_energy();
		this.enemy_team.active.calc_damage_taken(user, [Math.round(physical_damage), Math.round(elemental_damage)]);
		this.enemy_team.turn_part1();
	},
	
	take_damage:function(damage){
	/*
	Lose HP equal to the damage you took
	If you survive, you can heal some of it off
	*/
		var dmg = damage;
		this.hp_rem -= dmg;
		this.last_dmg += dmg;
		
		this.hp_rem = Math.round(this.hp_rem);
	},
	
	heart_collection:function(){
	/*
	Adds a button that, when clicked, heals you based on how much damage you took
	*/
		var w = this;
		var t = this.team;
		var button_size = canvas_width * 0.1
		var x = canvas_width * 0.5 - button_size;
		var y = canvas_width * 0.1;
		active_buttons.push(new Button("Heart Collection", "rgb(255, 0, 0)", x, y, button_size, button_size, [w.nat_regen.bind(w), t.turn_part2.bind(t)]));
	},
	
	bomb:function(){
	/*
	Or maybe you'd like to take damage instead?
	Useful for vengeance/Twister warriors
	*/
		var w = this;
		var t = this.team;
		var button_size = canvas_width * 0.1;
		var x = canvas_width * 0.5;
		var y = canvas_width * 0.1;
		var f = function(){
			var d = w.perc_hp(0.15);
			w.hp_rem -= d;
			if (w.hp_rem <= 1){
				w.hp_rem = 1;
			}
			w.hp_rem = Math.round(w.hp_rem);
		}
		active_buttons.push(new Button("", "rgb(0, 0, 0)", x, y, button_size, button_size, [f, t.turn_part2.bind(t)]));
	},

	// update this once Resilience out
	nat_regen:function(){
	/*
	*/
		var x = this;
		this.heal(x.last_dmg * 0.4);
	},
	
	reset_dmg:function(){
	/*
	Reset your most recent damage to 0
	DOES NOT HEAL YOU
	Used for heart collection
	*/
		this.last_dmg = 0;
	},
	
	reset_heal:function(){
	    this.last_healed = 0;
	},
	
	heal:function(hp){
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
	},
	
	// update this once Phantom Shield and Armor Boost come out
	check_durations:function(){
	    /*
	    Check to see how long each of your boosts has left
	    Then push whatever ones are left to a new array
	    Your boosts become the new array
	    
	    Next comes Phantom Shield
	    */
		var phys_boosts_rem = [];
		for (var boost of this.phys_boosts){
			if (boost[1] !== 0){
				phys_boosts_rem.push([boost[0], boost[1] - 1]);
			}
		}
		this.phys_boosts = phys_boosts_rem;
		
		this.boost_up = false;
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
		
		if (this.shield != false){
		    if (this.shield == 0){
		        this.shield = false;
		    } else {
		        this.shield -= 1;
		    }
		}
	},
	
	calc_poison:function(){
	/*
	Check to see if you are poisoned
	Then take damage
	*/
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
		/*
		Check if the Regeneration Special Move has been used on your team
		Then heal accordingly
		*/
		if (!this.regen){return;}
		if (this.regen[1] == 0){
			this.regen = false;
			return;
		}
		this.heal(this.regen[0]);
		this.regen[1] -= 1;
	},
	
	display_health:function(x, y){
		/*
		Display a Warrior's icon, showing:
			If their boost is up
			Their element
			Their % of HP remaining (as a horizontal bar)
			Their name
			Their actual HP remaining
		*/
		if (this.team.active == this){
		    canvas.fillStyle = "rgb(125, 125, 125)";
		    canvas.fillRect(x - 50, y, 150, 100);
		}
		
		canvas.fillStyle = this.element.color;
		if (this.boost_up){
			canvas.fillRect(x, y, 100, 50);
		}
		canvas.beginPath();
		canvas.arc(x - 50, y + 50, 50, 0, 2 * Math.PI);
		canvas.fill();
		
		var bar_width = this.hp_perc() * 100;
		canvas.fillStyle = "rgb(255, 0, 0)";
		if (this.check_if_ko()){return;}
		if (this.poisoned !== false){canvas.fillStyle = "rgb(0, 255, 0)";}
		canvas.fillRect(x, y + 25, bar_width, 25);
		
		canvas.fillStyle = "rgb(0, 0, 0)";
		canvas.font = "30px Ariel";
		canvas.fillText(this.name, x, y + 20);
		if (!this.regen){
			canvas.fillText(this.hp_rem, x, y + 45);
		} else {
			canvas.fillText(this.hp_rem + "+", x, y + 45);
		}
		if (this.last_dmg != 0){
		    canvas.fillStyle = "rgb(255, 0, 0)";
		    canvas.fillText("-" + String(this.last_dmg), x, y + 75);
		} else if (this.last_healed != 0){
		    canvas.fillStyle = "rgb(0, 255, 0)";
		    canvas.fillText("+" + String(this.last_healed), x, y + 75);
		}
		if (this.shield != false){
		    canvas.fillStyle = "rgba(0, 0, 155, 0.5)";
		    canvas.fillRect(x, y, 100, 50);
		}
	},
	
	use_special:function(){
		/*
		Use your powerful Special Move!
		*/
		this.team.switchback = this.team.active;
		this.team.switchin(this);
		this.special.attack(this);
		this.team.energy -= 2;
		
		if (this.special.gives_energy){
			this.team.enemy_team.gain_energy();
		}
		
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
	this.members = members;
	this.name = name;
	all_teams.push(this);
}

Team.prototype = {
	assign_enemy:function(enemy_team){
		this.enemy_team = enemy_team;
		for (var member of this.members){
			member.enemy_team = enemy_team;
		}
	},
	
	init_for_battle:function(){
		this.members_rem = [];
		for (var member of this.members){
			member.team = this;
			member.calc_stats();
			member.hp_rem = member.max_hp;
			member.phys_boosts = [];
			member.ele_boosts = [];
			member.poisoned = false;
			member.regen = false;
			member.shield = false;
			member.last_dmg = 0;
			member.last_healed = 0;
			this.members_rem.push(member);
		}
		this.leader = this.members_rem[0];
		this.active = this.members_rem[0];
		this.energy = 2;
		this.won = false;
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
			this.energy = 1;
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
	
	prev:function() {
		/*
		Returns the member of this' members
		above num
		as an index
		*/
		var prev = this.members_rem.indexOf(this.active) - 1;
		if (prev == -1){
			prev = this.members_rem.length - 1;
		}
		return this.members_rem[prev];
	},
	
	next:function(){
		/*
		Returns the next member of this' members
		*/
		var nextup = this.members_rem.indexOf(this.active) + 1;
		if (nextup >= this.members_rem.length){
			nextup = 0;
		}
		return this.members_rem[nextup];
	},
	
	switchin:function(warrior){
		for (var member of this.members_rem){
			if (this.members_rem.length == 1){
				this.active = this.members_rem[0];
				return;
			}
			if (typeof warrior == "number"){
				if (this.members_rem.length <= warrior){
					warrior = 0;
				}
				this.active = this.members_rem[warrior];
				return;
			}
			
			if (member == warrior){
				this.active = member;
				return;
			}
			if (member.name == warrior){
				this.active = member;
				return;
			}
		}
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
		var act_koed = false;
		if (this.active.hp_rem <= 0){
			act_koed = true;
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
		for (var member of this.members_rem){
			member.reset_heal();
		}
		
		this.check_if_ko();
		
		if (this.won || this.enemy_team.won){
			return;
		}
		
		this.display_all_hp();
		this.display_energy();
		
		this.display_vs();
		this.enemy_team.display_all_hp();
		this.enemy_team.display_energy();
		
		if (this.active.last_dmg > 0){
			this.active.heart_collection();
			this.active.bomb();
		}
		
		if (this.active.last_dmg <= 0){
			this.turn_part2();
			return;
		}
		
		help_button(ex_gui);
		
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
		for (var member of this.members_rem){
			member.reset_dmg();
		}
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
		
		help_button(ex_gui);
		
		for (var button of active_buttons){
			button.draw();
		}
	},
	
	win:function(){
		alert(this.name + " wins!");
		this.won = true;
		disp_menu();
	}
}

/*
The Battle class is used to pit teams against each other
then start the match by letting a random team do the first part of their turn
*/

function Battle(team1, team2){
	this.teams = [team1, team2];
	for (var team of this.teams){
		var slice = this.teams.slice();
		var enemy = slice.splice(this.teams.indexOf(team), 1);
		team.assign_enemy(slice[0]);
	}
	team1.x = canvas_width * 0.2;
	team2.x = canvas_width * 0.8;
}

Battle.prototype = {
	init:function(){
		/*
		Prepare the teams for battle
		*/
		for (var team of this.teams){
			team.init_for_battle();
		}
	},
	
	start:function(){
		/*
		initiate the first turn
		for a random team
		Warrior and Team do the rest
		*/
		this.teams[Math.round(Math.random())].turn_part1();
	}
}