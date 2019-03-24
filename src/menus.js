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

var ts = new Team_select();