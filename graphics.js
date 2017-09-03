// warrior
function display_warrior_card(x, y, size, m){
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
	canvas.fillStyle = m.element.color;
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
	canvas.fillText(m.level, x + 25, y + 60);
	
	// Level denominator
	// add this later
	
	//Stats
	canvas.fillStyle = "rgb(255, 255, 255)";
	canvas.fillRect(x + 75, y + h * 0.375, w * 0.2, h * 0.1);
	canvas.fillRect(x + 75, y + h * 0.5, w * 0.2, h * 0.1);
	canvas.fillRect(x + 75, y + h * 0.625, w * 0.2, h * 0.1);
	
	canvas.fillStyle = "rgb(0, 0, 0)";
		
	m.calc_stats();
		
	canvas.fillText(m.phys, x + 75, y + h * 0.375 + 35);
	canvas.fillText(m.ele, x + 75, y + h * 0.5 + 35);
	canvas.fillText(m.max_hp, x + 75, y + h * 0.625 + 35);
	
	//Armor: replace with shield sprite later
	canvas.fillStyle = "rgb(100, 100, 100)";
	for(var i = 0; i <= m.armor; i++){
		canvas.fillRect(x + 75 + (w * 0.1 * i), y + h * 0.75, w * 0.05, h * 0.05);
	}

	// Name
	canvas.fillText(m.name, x + 110, y + 50);
	
	// Special
	var spec_shift = m.special.name.length * font_size + fg_shift;
	canvas.fillText(m.special.name, x + w - spec_shift, y + h * 0.15);
}
function display_stats(m){
	canvas.fillStyle = "rgb(255, 255, 255)";
	canvas.fillRect(300, 100, 400, 200);
	
	canvas.fillStyle = "rgb(0, 0, 0)";
	canvas.font = "40px Ariel";
	canvas.fillText(m.name, 300, 130);
	canvas.fillText("Physical: " + m.get_phys().toString(), 300, 170);
	canvas.fillText("Elemental: " + m.get_ele().toString(), 300, 210);
	canvas.fillText("Max HP: " + m.max_hp.toString(), 300, 250);
	canvas.fillText("Armor: " + m.armor.toString(), 300, 290);
}
function display_health(x, y, m){
	/*
	Display a Warrior's icon, showing:
		If their boost is up
		Their element
		Their % of HP remaining (as a horizontal bar)
		Their name
		Their actual HP remaining
	*/
	if (m.team.active == m){
		canvas.fillStyle = "rgb(125, 125, 125)";
		canvas.fillRect(x - 50, y, 150, 100);
	}
	
	canvas.fillStyle = m.element.color;
	if (m.boost_up){
		canvas.fillRect(x, y, 100, 50);
	}
	canvas.beginPath();
	canvas.arc(x - 50, y + 50, 50, 0, 2 * Math.PI);
	canvas.fill();
	
	var bar_width = m.hp_perc() * 100;
	canvas.fillStyle = "rgb(255, 0, 0)";
	if (m.check_if_ko()){return;}
	if (m.poisoned !== false){canvas.fillStyle = "rgb(0, 255, 0)";}
	canvas.fillRect(x, y + 25, bar_width, 25);
	
	canvas.fillStyle = "rgb(0, 0, 0)";
	canvas.font = "30px Ariel";
	canvas.fillText(m.name, x, y + 20);
	if (!m.regen){
		canvas.fillText(m.hp_rem, x, y + 45);
	} else {
		canvas.fillText(m.hp_rem + "+", x, y + 45);
	}
	if (m.last_dmg != 0){
		canvas.fillStyle = "rgb(255, 0, 0)";
		canvas.fillText("-" + String(m.last_dmg), x, y + 75);
	} else if (m.last_healed != 0){
		canvas.fillStyle = "rgb(0, 255, 0)";
		canvas.fillText("+" + String(m.last_healed), x, y + 75);
	}
	if (m.shield != false){
		canvas.fillStyle = "rgba(0, 0, 155, 0.5)";
		canvas.fillRect(x, y, 100, 50);
	}
}

// team
function display_vs(t){
	canvas.fillStyle = "rgb(255, 255, 255)";
	canvas.fillRect(300, 25, 400, 50);
	
	var message = t.active.name + " VS " + t.enemy_team.active.name;
	canvas.fillStyle = "rgb(0, 0, 0)";
	canvas.font = "30px Ariel";
	canvas.fillText(message, 305, 50);
}