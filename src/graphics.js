//replace this stuff with react later
export class Canvas{
    constructor(elementId){
        this.htmlElement = document.getElementById(elementId);
        if(this.htmlElement === null || this.htmlElement.tagName !== "CANVAS"){
            this.htmlElement = document.createElement("canvas");
            document.appendChild(this.htmlElement);
        }
        this.draw = this.htmlElement.getContext("2d");
    }
    
    setColor(color){
        this.draw.fillStyle = color;
    }
    
    rect(x, y, w, h){
        /*
        Draws a rectangle.
        x, y, w, and h are all based on
        the size of the canvas

        EX:
            rect(50, 0, 50, 0);

            will draw a rectangle
            that covers the whole right
            side of the canvas
        */
        this.draw.fillRect(
            x / 100 * this.htmlElement.width, 
            y / 100 * this.htmlElement.height, 
            w / 100 * this.htmlElement.width, 
            h / 100 * this.htmlElement.height
        );
    }
    
    circle(x, y, diameter){
        /*
        x, y are coords of UPPER LEFT CORNER,
        not center.
        */
        let radius = diameter / 2;

        let tx = x / 100 * this.htmlElement.width;
        let ty = y / 100 * this.htmlElement.height;
        let tr = radius / 100 * ((this.htmlElement.width + this.htmlElement.height) / 2);

        this.draw.beginPath();
        this.draw.arc(tx + tr, ty + tr, tr, 0, 2 * Math.PI);
        this.draw.fill();
    }
    
    text(x, y, string){
        this.draw.fillText(string, x, y);
    }
}
// broken
function display_warrior_card(x, y, size, m){
	/*
	Draws a card displaying information about a warrior (m).
	*/
	
	var w = size;
	var h = w / 2;
	
	var font_size = w * 0.05;
	var font = font_size.toString() + "px Monospace";
	canvas.font = font;
	
	//Background
	rect("rgb(255, 215, 0)", x, y, w, h);
	
	//Foreground
	var fg_shift = w * 0.05
	rect(m.element.color, x + fg_shift, y + fg_shift, w - fg_shift * 2, h - fg_shift * 2);
	
	// The level shield thing REDO
	/*
	canvas.fillStyle = "rgb(255, 200, 125)";
	canvas.beginPath();
	canvas.moveTo(x + 25, y + 25);
	canvas.lineTo(x + 25 + w / 10, y + 25);
	canvas.lineTo(x + 25 + w / 10, y + 25 + h / 7);
	canvas.lineTo(x + 25 + w / 20, y + 25 + h / 4);
	canvas.lineTo(x + 25, y + 25 + h / 7);
	canvas.fill();
	*/
	
	// Level numerator
	var t = new Text(5, "rgb(0, 0, 0)", x + 5, y + 10);
	t.add(m.level);
	
	// Level denominator
	// add this later
	
	//Stats
	for(var i = 1; i <= 3; i++){
	    rect("rgb(255, 255, 255)", x + 75, y + h * (0.25 + 0.125 * i), w * 0.2, h * 0.1);
	}
	
	canvas.fillStyle = "rgb(0, 0, 0)";
		
	m.calc_stats();
	t = new Text(h * 0.125, "rgb(0, 0, 0)", x + 7, y + 5);
	t.add(m.phys);
	t.add(m.ele);
	t.add(m.max_hp);
	
	//Armor: replace with shield sprite later
	for(var i = 0; i <= m.armor; i++){
		rect("rgb(100, 100, 100)", x + 75 + (w * 0.1 * i), y + h * 0.75, w * 0.05, h * 0.05);
	}

	// Name
	t = new Text(10, "rgb(0, 0, 0)", x + 10, y + 10);
	t.add(m.name);
	
	// Special
	t = new Text(10, "rgb(0, 0, 0)", x + 50 * size, y);
	t.add(m.special.name);
}

function display_stats(m){
	rect("rgb(255, 255, 255)", 40, 10, 20, 50);
	var t = new Text(40, "rgb(0, 0, 0)", 40, 10);
	t.add(m.name);
	t.add("Physical: " + m.get_phys().toString());
	t.add("Elemental: " + m.get_ele().toString());
	t.add("Max HP: " + m.max_hp.toString());
	t.add("Armor: " + m.armor.toString());
}
function display_data(x, y, m){
    rect("rgb(255, 255, 255)", x, y, 25, 50);
    var armor_strs = ["Light", "Medium", "Heavy"];
    var t = new Text(25, "rgb(0, 0, 0)", x, y);
    t.add(m.name);
    t.add("Special Move: " + m.special.name + " " + m.pip.toString());
    t.add("Element: " + m.element.name);
    t.add("Base Physical Attack: " + Math.round(m.base_phys).toString());
    t.add("Base Elemental Attack: " + Math.round(m.base_ele).toString());
    t.add("Armor: " + armor_strs[m.armor]);
    t.add("Max HP: " + Math.round(m.base_hp).toString());
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
	if (m.check_if_ko()){
	    return;
	}
	
	// 'active' border
	if (m.team.active == m){
	    rect("rgb(125, 125, 125)", x, y, 20, 10);
	}
	// boost strip
	if (m.boost_up){
	    rect(m.element.color, x, y, 20, 5);
	}
	
	// health bar
	var color;
	if (m.poisoned !== false){
	    color = "rgb(0, 255, 0)";
	} else {
	    color = "rgb(255, 0, 0)";
	}
	rect(color, x + 5, y + 5, 15 * m.hp_perc(), 5);
	
	// health value
	var t = new Text(20, "rgb(0, 0, 0)", x + 10, y);
	t.add(m.name);
	if (!m.regen){
		t.add(m.hp_rem);
	} else {
		t.add(m.hp_rem + "+");
	}
	// how to squeeze these in?
	if (m.last_phys_dmg != 0){
		t.add("-" + String(Math.round(m.last_phys_dmg)));
	}
	if (m.last_ele_dmg != 0){
		t.add("-" + String(Math.round(m.last_ele_dmg)));
	}
	if (m.last_healed != 0){
		t.add("+" + String(m.last_healed));
	}
	
	// Phantom Shield overlay
	if (m.shield){
	    rect("rgba(0, 0, 155, 0.5)", x, y, 20, 10);
	}
	
	// icon
	circle(m.element.color, x, y, 5);
}
function display_vs(t){
    rect("rgb(255, 255, 255)", 40, 0, 20, 10);
	x = new Text(10, "rgb(0, 0, 0)", 40, 0);
	x.add(t.active.name + " VS " + t.enemy_team.active.name);
}