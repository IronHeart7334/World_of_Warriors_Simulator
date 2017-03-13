function help_button(help_with){
    active_buttons.push(new Button("?", "rgb(100, 100, 100)", base_canvas.width * 0.95, base_canvas.height * 0.95, base_canvas.width * 0.95, base_canvas.height 0.95, [help_with]));
}

function ex_menu() {
	alert("This is the main menu. You are automatically sent here when you start the game.");
	alert("If the game starts acting wierd or stops working, just reload the page to fix it. Note that this will reset everything.");
	alert("Start by clicking the red 'Fight!' button. You can't miss it.");
}

function ex_team_sel() {
	alert("This is the team selector. You don't have many teams yet, so just use the prebuilt teams here.");
	alert("Click the little red 'Fight!' button to begin.");
}
// not done
function ex_gui(){
	alert("This is the battle Graphic User Interface.");
	alert("Each of the big colored circles with a name next to it represents a warrior in the fight.");
	alert("The color of the circle shows the characters' element: Red for fire, green is earth, yellow is air, and blue is water.");
	alert("A warrior's element determines if it will do extra damage to another warrior, based on their element.");
	alert("For example, Zenghis is a water warrior, so he will do extra damage against fire warriors like Abu.");
	alert("Just a little to the right of a warrior's icon is their remaining Hit Points.");
	alert("The grey boarder behind a warrior's icon shows that they are that team's active warrior. Only active warrior's can make attacks.");
	alert("The left side shows the team of the first player, right is the second.");
}