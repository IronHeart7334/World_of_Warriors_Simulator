var fire = new Element("Fire", "rgb(255, 0, 0)", "Water");
var earth = new Element("Earth", "rgb(0, 255, 0)", "Fire");
var air = new Element("Air", "rgb(255, 255, 0)", "Earth");
var water = new Element("Water", "rgb(0, 0, 255)", "Air");
var no_ele = new Element("Null", "rgb(100, 100, 100)", undefined);


// this will need to be changed in the future			
var Abu = new Warrior(["Abu", [0.9334, 0.4, 1.05, 1], fire, new Ele_beat(1.7, 1, "f")], 34);
var Aka = new Warrior(["Aka", [1, 0.4, 0.96, 0], earth, new Ele_beat(2.2, 2, "e")], 34);
var Lance = new Warrior(["Lance", [0.7334, 0.1, 1.03, 2], earth, new Ele_beat(1.72, 1, undefined)], 34);
var Erika = new Warrior(["Erika", [1.0334, 0.4, 0.95, 1], air, new AOE(1.5, 2, "a")], 34);

// data
var bart_data = ["My name are BART", [8.999, 0.000001, 8.2, 8], water, new Ele_beat(32, 8, "f")];



var classic_red_data = ["No name set", [1.057, 0.4, 0.95, 1], fire, new Ele_beat(1.66, 1, "f")];
var classic_black_data = ["No name set", [0.967, 0.4, 1.05, 1], earth, new Ele_beat(1.81, 1, "e")];
var classic_white_data = ["No name set", [1.027, 0.45, 0.87, 1], air, new Ele_beat(1.92, 1, "a")];
var classic_blue_data = ["No name set", [0.887, 0.4, 1.08, 1], water, new Ele_beat(2.1, 1, "w")];

var black_falcon_data = ["No name set", [0.967, 0.25, 1.1, 1], water, new Ele_beat(2.2, 2, undefined)];
var dragon_knight_data = ["No name set", [1.127, 0.4, 0.86, 2], fire, new Ele_beat(2.1, 2, "f")];
var dwarf_data = ["No name set", [1.087, 0.4, 0.82, 2], earth, new Ele_beat(2.2, 2, "e")];

var levahk_data = ["Levahk", [0.687, 0.5, 0.83, 1], air, new Ele_beat(3.95, 3, "a")];
var nuhvok_data = ["Nuhvok", [0.687, 0.45, 1.04, 1], earth, new AOE(3.2, 3, "e")];


var first_war_vet = ["No name set", [1.175, 0.45, 0.88, 2], earth, new Ele_beat(1.8, 2, "e")];
var saracen_data = ["No name set", [1.075, 0.33, 0.92, 0], fire, new Ele_beat(1.88, 1, "f")];



var onua_data = ["Onua", [0.973, 0.2, 1.13, 1], earth, new Ele_beat(1.3, 2, "e")];


// warriors
var BART = new Warrior(bart_data, 34);



var cred = new Warrior(classic_red_data, 34);
var cblack = new Warrior(classic_black_data, 34);
var cwhite = new Warrior(classic_white_data, 34);
var cblue = new Warrior(classic_blue_data, 34);

var bfalc = new Warrior(black_falcon_data, 34);
var dknight = new Warrior(dragon_knight_data, 34);
var dwarf = new Warrior(dwarf_data, 34);

var levahk = new Warrior(levahk_data, 34);
var nuhvok = new Warrior(nuhvok_data, 34);


var fwv = new Warrior(first_war_vet, 34);
var saracen = new Warrior(saracen_data, 34);



var onua = new Warrior(onua_data, 34);