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
	    load_teambuilder,
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
function load_teambuilder(){
    tbx = Math.round(warriors.length / 2);
    team_in_dev = [];
    update_teambuilder();
}

function update_teambuilder(){
    active_buttons = [];
    
    //Find out which warriors should be in the selector
    var options = [];
    for (var w of warriors){
        if (team_in_dev.indexOf(w) == -1){
            options.push(w);
        }
    }
    
    function leftTBX(){
        tbx -= 1;
        if (tbx < 0){
            tbx = 0;
        }
    }
    function rightTBX(){
        tbx ++;
        if (tbx > options.length - 1){
            tbx = options.length - 1;
        }
    }
    function add_warrior(warrior_num){
        return function(){
            team_in_dev.push(options[warrior_num]);
            if (team_in_dev.length == 3){
                var team_name = prompt("What do you want to call this team?");
                var team_level = 34;
                real_teams.push(new Team([new Warrior(team_in_dev[0], team_level), new Warrior(team_in_dev[1], team_level), new Warrior(team_in_dev[2], team_level)], team_name));
                disp_menu();
                return;
            }
            tbx = 0;
            update_teambuilder();
        }
    }
    //Draw the background
    canvas.fillStyle = "rgb(200, 200, 0)";
    canvas.fillRect(0, 0, base_canvas.width, base_canvas.height / 4);
    canvas.fillRect(0, base_canvas.height / 4 * 3, base_canvas.width, base_canvas.height / 4);
    canvas.fillStyle = "rgb(0, 0, 0)";
    canvas.fillRect(0, base_canvas.height / 4, base_canvas.width, base_canvas.height / 2);
    
    // Draw warrior cards
    if (tbx !== 0){
        var left_warrior = new Warrior(options[tbx - 1], 0);
        display_warrior_card(0, 25, 25, left_warrior);    
    }
    
    if (tbx !== options.length - 1){
        var right_warrior = new Warrior(options[tbx + 1], 0);
        display_warrior_card(75, 25, 25, right_warrior); 
    }
    var middle_warrior = new Warrior(options[tbx], 0);
    display_warrior_card(25, 25, 50, middle_warrior);
    
    // Draw team in development
    var y = base_canvas.height * 0.05;
    canvas.fillStyle = "rgb(0, 0, 0)";
    for (var member of team_in_dev){
        canvas.fillText(member[0], base_canvas.width / 2, y);
        y += base_canvas.height * 0.05;
    }
    
    // Buttons
    active_buttons.push(new Button("Back", "rgb(255, 0, 0)", 0, 0, base_canvas.width / 4, base_canvas.height / 4, [disp_menu]));
    
    active_buttons.push(new Button("Scroll Left", "rgb(0, 255, 0)", 0, base_canvas.height * 0.75, base_canvas.width / 4, base_canvas.height / 4, [leftTBX, update_teambuilder]));
    active_buttons.push(new Button("Scroll Right", "rgb(0, 0, 255)", base_canvas.width * 0.75, base_canvas.height * 0.75, base_canvas.width / 4, base_canvas.height / 4, [rightTBX, update_teambuilder]));
    
    active_buttons.push(new Button("Add warrior", "rgb(255, 255, 0)", base_canvas.width / 3, base_canvas.height * 0.75, base_canvas.width / 3, base_canvas.height / 4, [add_warrior(tbx)]));
    for (var button of active_buttons){
        button.draw();
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
