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

function display_vs(t){
    rect("rgb(255, 255, 255)", 40, 0, 20, 10);
	x = new Text(10, "rgb(0, 0, 0)", 40, 0);
	x.add(t.active.name + " VS " + t.enemyTeam.active.name);
}