var pass_teams = [teams[0], teams[1]];

function set_team(team_num, team){
	return function(){
		pass_teams[team_num] = team;
	}
}

function draw_teams(team_num, x){
	var y = 0;
	for (var team of teams){
		var new_button = new Button(team.name, "rgb(255, 255, 255)", x, y, 100, 40, [set_team(team_num, team), update_team_select]);
		active_buttons.push(new_button);
		y += 50;
	}
}

function update_team_select(){
	active_buttons = [];
	canvas.fillStyle = "rgb(0, 0, 0)";
	canvas.fillRect(0, 0, 1000, 500);
	
	draw_teams(0, 50);
	draw_teams(1, 550);
	
	canvas.fillStyle = "rgb(255, 255, 255)";
	canvas.fillRect(50, 450, 900, 45);
	
	canvas.fillStyle = "rgb(0, 0, 0)";
	canvas.font = "40px Ariel";
	var msg = pass_teams[0].name + " VS " + pass_teams[1].name + ": Fight!";
	canvas.fillText(msg, 70, 470);
	active_buttons.push(new Button("Fight!", "rgb(255, 0, 0)", 950, 450, 50, 50, [begin_fight]));
	
	for (var button of active_buttons){
		button.draw();
	}
}

function begin_fight(){
	b = new Battle(pass_teams[0], pass_teams[1]);
	b.init();
	b.start();
}