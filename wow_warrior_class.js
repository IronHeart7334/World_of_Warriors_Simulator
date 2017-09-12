// The base values for both stats, might change them later
var OFFENSE = 33.73;
var HP = 107.0149;


//change how attacking, energy works


class Warrior{
    constructor(name, skills){
	    /*
	    The warrior Class takes data from an array:
	    new Warrior([name, [off, ele, hp, arm, pip], element, special, leader_skill]);
	    */
	    var data = this.find_warrior(name);
	    this.name = data[0]
	    this.base_off = OFFENSE * data[1][0];
		this.base_ele = this.base_off * data[1][1];
		this.base_phys = this.base_off - this.base_ele;
	    this.base_hp = HP * data[1][2];
	    this.armor = data[1][3];
	    this.pip = data[1][4];
	    this.element = data[2];
	    this.special = this.find_special(data[3]);
	    this.lead_skill = new Lead(data[4][0], data[4][1]);
	    this.skills = skills;
	    this.level = 34;
	    
	    this.special.set_user(this);
    }
    find_warrior(name){
    	for(var warrior of warriors){
    		if(warrior[0] == name){
    			return warrior;
    		}
    	}
    	return ["ERROR", [1, 0.5, 1, 1, 2], no_ele, "ERROR", [5, "p"]];
    }
    // better way?
	find_special(name){
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
	calc_stats(){
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
		
		if (this.element.weakness == this.team.enemy_team.active.element.name){
			elemental_damage *= 1.7;
		}
		
		else if (this.element.name == this.team.enemy_team.active.element.weakness){
			elemental_damage *= 0.3;
		}
		
		this.take_damage(physical_damage, elemental_damage);
		this.last_hitby = this.team.enemy_team.active;
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
		
		if(this.skills[0] == "shell"){
		    if(this.hp_perc() <= 0.5){
		        this.in_shell = true;
		    }
		}
	}
	check_if_ko(){
	/*
	An I dead yet?
	*/
		return this.hp_rem <= 0;
	}
	use_normal_move(){
	/*
	Strike at your enemy team's active warrior with your sword!
	*/
	    var mod = 1.0;
	    if(this.skills[0] == "critical hit"){
	        if(Math.random() <= 0.24){
	            console.log("Critical hit!");
	            mod += 0.24;
	        }
	    }
	    if(this.team.enemy_team.active.skills[0] == "guard"){
	        if(true || Math.random() <= 0.24){
	            console.log("Guard!");
	            mod -= 0.24;
	        }
	    }
		this.team.enemy_team.gain_energy();
		this.team.enemy_team.active.calc_damage_taken(this.get_phys() * mod, this.get_ele() * mod);
		this.team.enemy_team.turn_part1();
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
		if(this.skills[0] == "shell"){
		    if(this.hp_perc() > 0.5){
		        this.in_shell = false;
		    }
		}
	}
	use_special(){
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
	update(){
        this.check_durations();
		this.calc_poison();
		this.calc_regen();
		if(this.in_shell){
		    this.armor_boosts.push(new Stat_boost("shell", 0.36, 1));
		}   
	}
	
	// make this stuff better
	init(){
		this.calc_stats();
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
	}
	heart_collection(){
	/*
	Adds a button that, when clicked, heals you based on how much damage you took
	*/
		var w = this;
		var t = this.team;
		new Button("Heart Collection", "rgb(255, 0, 0)", 40, 90, 10, 10, [w.nat_regen.bind(w), t.turn_part2.bind(t)]);
	}
	bomb(){
	/*
	Or maybe you'd like to take damage instead?
	Useful for vengeance/Twister warriors
	*/
		var w = this;
		var t = this.team;
		var f = function(){
			var d = w.perc_hp(0.15);
			w.hp_rem -= d;
			if (w.hp_rem <= 1){
				w.hp_rem = 1;
			}
			w.hp_rem = Math.round(w.hp_rem);
		}
	    new Button("", "rgb(0, 0, 0)", 50, 90, 10, 10, [f, t.turn_part2.bind(t)]);
	}
	// update this once Resilience out
	nat_regen(){
	/*
	*/
		var x = this;
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
		var phys_boosts_rem = [];
		for (var boost of this.phys_boosts){
			boost.update();
			if(!boost.should_terminate){
			    phys_boosts_rem.push(boost);
			}
		}
		this.phys_boosts = phys_boosts_rem;
		
		this.boost_up = false;
		var ele_boosts_rem = [];
		for (var boost of this.ele_boosts){
			boost.update();
			if(!boost.should_terminate){
			    ele_boosts_rem.push(boost);
			    if(boost.id == this.element.name + " Boost"){
			        this.boost_up = true;
			    }
			}
		}
		this.ele_boosts = ele_boosts_rem;
		
		this.shield = false;
		var armor_boosts_rem = [];
		for(var boost of this.armor_boosts){
		    boost.update();
		    if(!boost.should_terminate){
		        armor_boosts_rem.push(boost);
		        if(boost.id == "Phantom Shield"){
		            this.shield = true;
		        }
		    }
		}
		this.armor_boosts = armor_boosts_rem;
	}
	calc_poison(){
	/*
	Check to see if you are poisoned
	Then take damage
	*/
		if (!this.poisoned){return;}
		if (this.poisoned[1] == 0){
			this.poisoned = false;
			return;
		}
		this.take_damage(this.poisoned[0], 0);
		this.poisoned[1] -= 1;
	}
	calc_regen(){
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
	}
}

class Stat_boost{
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

class Element{
    constructor(name, color, weakness){
	    this.name = name;
	    this.color = color;
	    this.weakness = weakness;
	}
}

var fire = new Element("Fire", "rgb(255, 0, 0)", "Water");
var earth = new Element("Earth", "rgb(0, 255, 0)", "Fire");
var air = new Element("Air", "rgb(255, 255, 0)", "Earth");
var water = new Element("Water", "rgb(0, 0, 255)", "Air");
var no_ele = new Element("Null", "rgb(100, 100, 100)", undefined);

class Lead{
    constructor(amount, type){
	    this.amount = amount / 100;
	    this.type = this.find_type(type);
    }
    find_type(type){
        switch(type){
        case "f":
            return fire;
        case "e":
            return earth;
        case "a":
            return air;
        case "w":
            return water;
        default:
            return type;
        }
    }
    
    // need healing effects
	// improve
	apply(team){
		if (this.amount >= 0){
			var target = team;
		}
		if (this.amount < 0){
			var target = team.enemy_team;
		}
		if (this.type == "p"){
			for (var member of target.members_rem){
				member.phys_boosts.push(new Stat_boost("Leader Skill", this.amount, 1));
			}
		}else{
		    for(var member of target.members_rem){
		        if(member.element == this.type){
		            member.ele_boosts.push(new Stat_boost("Leader Skill", this.amount, 1));
		        }
		    }
		}
	}
}

class Team{
    constructor(members, name){
        this.members = [];
        for(var member of members){
        	this.members.push(new Warrior(member[0], member[1]));
        }
	    this.name = name;
	    all_teams.push(this);
    }
	init_for_battle(){
		this.members_rem = [];
		for (var member of this.members){
		    member.init();
		    member.team = this;
		    member.enemy_team = this.enemy_team;
		    this.members_rem.push(member);
		}
		this.leader = this.members_rem[0];
		this.active = this.members_rem[0];
		this.energy = 2;
		this.won = false;
	}
	gain_energy(){
		if (this.energy < 0){
			this.energy = 1;
		}
		if (this.energy < 4){
			this.energy += 1;
		}
	}
	check_lead(){
		if (!this.leader.check_if_ko()){
			var team = this;
			this.leader.lead_skill.apply(team);
		}
	}
	prev(){
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
	}
	next(){
		/*
		Returns the next member of this' members
		*/
		var nextup = this.members_rem.indexOf(this.active) + 1;
		if (nextup >= this.members_rem.length){
			nextup = 0;
		}
		return this.members_rem[nextup];
	}
	switchin(warrior){
		if (this.members_rem.length == 1){
			this.active = this.members_rem[0];
			return;
		}
		for (var member of this.members_rem){
			if (member == warrior){
				this.active = member;
				return;
			}
		}
		console.log("Error: The warrior " + warrior + " does not exist!");
	}
	update(){
		for (var member of this.members_rem){
			member.update();
		}
		this.check_if_ko();
	}
	check_if_ko(){
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
		
		if (act_koed){
			if(index >= this.members_rem.length){
				index = 0;
			}
			this.switchin(this.members_rem[index]);
		}
	}
	win(){
		alert(this.name + " wins!");
		this.won = true;
		disp_menu();
	}
	
	// graphics stuff, work on
	turn_part1(){
		/*
		Heart collection phase
		*/
		
		clear_canvas();
		MASTER.clear_all_buttons();
		for (var member of this.members_rem){
			member.reset_heal();
		}
		
		this.check_if_ko();
		
		if (this.won || this.enemy_team.won){
			return;
		}
		
		this.display_all_hp();
		this.display_energy();
		
		display_vs(this);
		this.enemy_team.display_all_hp();
		this.enemy_team.display_energy();
		
		if ((this.active.last_phys_dmg + this.active.last_ele_dmg) > 0){
			this.active.heart_collection();
			this.active.bomb();
		}
		
		if ((this.active.last_phys_dmg + this.active.last_ele_dmg) <= 0){
			this.turn_part2();
			return;
		}
		
		help_button(ex_gui);
	}
	turn_part2(){
		/*
		Action phase
		*/
		
		clear_canvas();
		MASTER.clear_all_buttons();
		for (var member of this.members_rem){
			member.reset_dmg();
		}
		this.check_lead();
		this.update();
		this.check_if_ko();
		this.display_all_hp();
		this.display_energy();
		this.display_nm();
		display_vs(this);
		
		this.enemy_team.display_all_hp();
		this.enemy_team.display_energy();
		
		if (this.energy >= 2){
			this.display_specials();
		}
		
		help_button(ex_gui);
	}
	// shorten these buttons
	display_nm(){
		var team = this;
		new Button("Normal Move", team.active.element.color, 45, 70, 10, 10, [team.active.use_normal_move.bind(team.active)]);
	}
	display_specials(){
	    /*
	    List all of a team's Special Moves
	    as icons across the screen.
	    Click on them to use them.
	    */
		var x = this.x - 15;
		var team = this;
		for (var member of team.members_rem){
			new Button(member.special.name, member.element.color, x, 70, 10, 10, [member.use_special.bind(member)]);
			x += 15;	
		}
	}
	display_energy(){
		var x = this.x;
		for (var count = 0; count < this.energy; count ++){
			circle("rgb(0, 100, 255)", x, 90, 5);
			x += 5;	
		}
	}
	display_all_hp(){
		var y = 0;
		for (var member of this.members_rem){
			display_health(this.x, y, member);
			function f(m){
			    return function(){
			        display_stats(m);
			    }
			}
	        new Button("", "none", this.x, y, 20, 10, [f(member)]);
			y += 20;
		}
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
		team.enemy_team = slice[0];
	}
	team1.x = 15;
	team2.x = 75;
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