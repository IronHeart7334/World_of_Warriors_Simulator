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
    
    clear(){
        let oldColor = this.draw.fillStyle;
        this.setColor("white");
        this.rect(0, 0, 100, 100);
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
        let oldColor = this.draw.fillStyle;
        this.setColor("black");
        this.draw.fillText(string, x / 100 * this.htmlElement.width, y / 100 * this.htmlElement.height + 30);
        this.setColor(oldColor);
    }
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
	x.add(t.active.name + " VS " + t.enemyTeam.active.name);
}