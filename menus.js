function load_canvas(){
	base_canvas = document.getElementById("canvas");
	canvas = base_canvas.getContext("2d");		
}

function clear_canvas(){
    rect("rgb(0, 155, 155)", 0, 0, 100, 100);
}

function disp_menu(){
	active_buttons = [];
	
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
	    load_team_select,
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
			        
		active_buttons.push(new Button(mes[c], colors[c], x, 0, 25, 100, [set_page(pages[c])]));
	}
	help_button(ex_menu);
	for (var button of active_buttons){
		button.draw();
	}
}


// work here

// make static? improve a bit
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
        if (this.tbx > options.length - 1){
            this.tbx = options.length - 1;
        }
    }
    add_warrior(warrior_num){
        return function(){
            this.team_workshop.push(options[warrior_num]);
            if (team_in_dev.length == 3){
                var team_name = prompt("What do you want to call this team?");
                real_teams.push(new Team([team_workshop[0], team_workshop[1], team_workshop[2]], team_name));
                disp_menu();
                return;
            }
            this.tbx = Math.round(warriors.length / 2) - this.team_workshop.length;
            this.update();
        }
    }
    update(){
        active_buttons = [];
        
        //Find out which warriors should be in the selector
        for (var w of warriors){
            if (this.team_workshop.indexOf(w) == -1){
                this.options.push(w);
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
    
        // Buttons
        active_buttons.push(new Button("Back", "rgb(255, 0, 0)", 0, 0, 25, 25, [disp_menu]));
    
        active_buttons.push(new Button("Scroll Left", "rgb(0, 255, 0)", 0, 75, 25, 25, [this.leftTBX, this.update]));
        active_buttons.push(new Button("Scroll Right", "rgb(0, 0, 255)", 75, 75, 25, 25, [this.rightTBX, this.update]));
    
        active_buttons.push(new Button("Add warrior", "rgb(255, 255, 0)", 33, 75, 33, 25, [this.add_warrior(this.tbx)]));
        for (var button of active_buttons){
            button.draw();
        }
    }
}


function load_team_select(){
    if (real_teams.length >= 2){
        pass_teams = [real_teams[0], real_teams[1]];
    } else {
        alert("You must have at least 2 teams constructed to do this!");
        disp_menu();
        return;
    }
    update_team_select();
}

function update_team_select(){
	active_buttons = [];
	rect("rgb(0, 0, 0)", 0, 0, 100, 100);
	
	function set_team(team_num, team){
	    return function(){
		    pass_teams[team_num] = team;
	    }
    }

    function draw_teams(team_num, x){
	    var y = 0;
	    for (var team of real_teams){
		    var new_button = new Button(team.name, "rgb(255, 255, 255)", x, y, 25, 10, [set_team(team_num, team), update_team_select]);
		    active_buttons.push(new_button);
		    y += 10;
		
		    if (y >= 80){
			    x += 25;
			    y = 0;
		    }
	    }
    }
	
	draw_teams(0, 0);
	draw_teams(1, 50);
	
	rect("rgb(255, 255, 255)", 0, 80, 80, 20);
	
	var t = new Text(40, "rgb(0, 0, 0)", 0, 80);
	t.add(pass_teams[0].name + " VS " + pass_teams[1].name + ": Fight!");
	
	active_buttons.push(new Button("Fight!", "rgb(255, 0, 0)", 80, 80, 20, 20, [begin_fight]));
	help_button(ex_team_sel);
	
	for (var button of active_buttons){
		button.draw();
	}
}

function begin_fight(){
	b = new Battle(pass_teams[0], pass_teams[1]);
	b.init();
	b.start();
}


var tb = new Teambuilder();