function clear_canvas(){
    rect("rgb(0, 155, 155)", 0, 0, 100, 100);
}

function disp_menu(){
	MASTER.clear_all_buttons();
	
	var colors = [
		"rgb(0, 255, 0)",
		"rgb(255, 0, 0)",
		"rgb(0, 0, 255)",
		"rgb(255, 255, 0)"
	];
	var mes = [
		"How to play",
		"Fight!",
		"Teambuilder",
		"Info"
	];
	var pages = [
	    undefined,
	    function(){
	    	ts.load();
	    },
	    function(){
	        tb.load();
	    },
	    undefined
	];
	function set_page(page){
	    if (page == undefined){
			return function(){
				alert("This page does not exist!");
			}
		}
		return function(){
		    page();
	    }
    }
    
	for (var c = 0; c < 4; c++){
		canvas.fillStyle = colors[c];
		var x = 25 * c;
			        
		new Button(mes[c], colors[c], x, 0, 25, 100, [set_page(pages[c])]);
	}
	help_button(ex_menu);
}

// make static? improve a bit
class Team_select{
	load(){
		if(all_teams.length < 2){	
        	alert("You must have at least 2 teams constructed to do this!");
        	disp_menu();
        	return;
    	}
    	this.pass_teams = [all_teams[0], all_teams[1]];
    	this.update();
	}
	set_team(team_num, team){
		return function(){
			this.pass_teams[team_num] = team;
		}
	}
	draw_teams(team_num, x){
		var y = 0;
		for (var team of all_teams){
			new Button(team.name, "rgb(255, 255, 255)", x + 2.5, y + 2.5, 20, 5, [this.set_team(team_num, team).bind(this), this.update.bind(this)]);
			y += 10;
			
			if(y >= 80){
				x += 25;
				y = 0;
			} 
		}
	}
	begin_fight(){
		var b = new Battle(this.pass_teams[0], this.pass_teams[1]);
		b.init();
		b.start();
	}
	update(){
		MASTER.clear_all_buttons();
		rect("rgb(0, 0, 0)", 0, 0, 100, 100);
		this.draw_teams(0, 0);
		this.draw_teams(1, 50);
		
		rect("rgb(255, 255, 255)", 0, 80, 80, 20);
	
		var t = new Text(40, "rgb(0, 0, 0)", 0, 80);
		t.add(this.pass_teams[0].name + " VS " + this.pass_teams[1].name + ": Fight!");
		
		new Button("Fight!", "rgb(255, 0, 0)", 80, 80, 20, 20, [this.begin_fight.bind(this)]);
		help_button(ex_team_sel);
	}
}
class Teambuilder{
    load(){
        //tbx: TeamBuilderX
        this.tbx = Math.round(warriors.length / 2);
        this.team_workshop = [];
        this.options = [];
        this.update();
    }
    leftTBX(){
        this.tbx -= 1;
        if (this.tbx < 0){
            this.tbx = 0;
        }
    }
    rightTBX(){
        this.tbx ++;
        if (this.tbx > this.options.length - 1){
            this.tbx = this.options.length - 1;
        }
    }
    add_warrior(warrior_num){
        return function(){
            this.team_workshop.push(this.options[warrior_num]);
            if (this.team_workshop.length == 3){
                var team_name = prompt("What do you want to call this team?");
                real_teams.push(new Team([this.team_workshop[0], this.team_workshop[1], this.team_workshop[2]], team_name));
                disp_menu();
                return;
            }
            this.tbx = Math.round(warriors.length / 2) - this.team_workshop.length;
            this.update();
        }
    }
    update(){
        MASTER.clear_all_buttons();
        
        //Find out which warriors should be in the selector
        for (var w of warriors){
            if (this.team_workshop.indexOf(w) == -1){
                this.options.push(w[0]);
            }
        }
        
        //Draw the background
        rect("rgb(200, 200, 0)", 0, 0, 100, 25);
        rect("rgb(200, 200, 0)", 0, 75, 100, 25);
        rect("rgb(0, 0, 0)", 0, 25, 100, 50);
    
        // Draw warrior cards
        if (this.tbx !== 0){
            var left_warrior = new Warrior(this.options[this.tbx - 1]);
            display_warrior_card(0, 25, 25, left_warrior);    
        }
        if (this.tbx !== this.options.length - 1){
            var right_warrior = new Warrior(this.options[this.tbx + 1]);
            display_warrior_card(75, 25, 25, right_warrior); 
        }
        var middle_warrior = new Warrior(this.options[this.tbx]);
        display_warrior_card(25, 25, 50, middle_warrior);
    
        // Draw team in development
        var t = new Text(10, "rgb(0, 0, 0)", 50, 5);
        
        for (var member of this.team_workshop){
            t.add(member);
        }
    
        // s
        new Button("Back", "rgb(255, 0, 0)", 0, 0, 25, 25, [disp_menu]);
    
        new Button("Scroll Left", "rgb(0, 255, 0)", 0, 75, 25, 25, [this.leftTBX.bind(this), this.update.bind(this)]);
        new Button("Scroll Right", "rgb(0, 0, 255)", 75, 75, 25, 25, [this.rightTBX.bind(this), this.update.bind(this)]);
    
        new Button("Add warrior", "rgb(255, 255, 0)", 33, 75, 33, 25, [this.add_warrior(this.tbx).bind(this)]);
    }
}

var ts = new Team_select();
var tb = new Teambuilder();