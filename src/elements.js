class Element{
    constructor(name, color, weakness){
	    this.name = name;
	    this.color = color;
	    this.weakness = weakness;
	}
}

export let fire = new Element("Fire", "rgb(255, 0, 0)", "Water");
export let earth = new Element("Earth", "rgb(0, 255, 0)", "Fire");
export let air = new Element("Air", "rgb(255, 255, 0)", "Earth");
export let water = new Element("Water", "rgb(0, 0, 255)", "Air");
export let no_ele = new Element("Null", "rgb(100, 100, 100)", undefined);


