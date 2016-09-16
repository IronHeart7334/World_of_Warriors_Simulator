var fire = new Element("Fire", "rgb(255, 0, 0)", "Water");
var earth = new Element("Earth", "rgb(0, 255, 0)", "Fire");
var air = new Element("Air", "rgb(255, 255, 0)", "Earth");
var water = new Element("Water", "rgb(0, 0, 255)", "Air");
var no_ele = new Element("Null", "rgb(100, 100, 100)", undefined);



var classic_red_data = ["No name set", [1.057, 0.4, 0.95, 1], fire, new Ele_beat(1.66, 1, "f"), new Lead(5, "p")];
var classic_black_data = ["No name set", [0.967, 0.4, 1.05, 1], earth, new Ele_beat(1.81, 1, "e"), new Lead(-15, "f")];
var classic_white_data = ["No name set", [1.027, 0.45, 0.87, 1], air, new Ele_beat(1.92, 1, "a"), new Lead(15, "a")];
var classic_blue_data = ["No name set", [0.887, 0.4, 1.08, 1], water, new Ele_beat(2.1, 1, "w"), new Lead(-15, "w")];

var black_falcon_data = ["No name set", [0.967, 0.25, 1.1, 1], water, new Ele_beat(2.2, 2, undefined), new Lead(-15, "a")];
var dragon_knight_data = ["No name set", [1.127, 0.4, 0.86, 1], fire, new Ele_beat(2.1, 2, "f"), new Lead(15, "f")];
var dwarf_data = ["No name set", [1.087, 0.4, 0.82, 2], earth, new AOE(1.6, 2, "e"), new Lead(-15, "f")];
var black_knight_data = ["No name set", [1.107, 0.4, 1.12, 1], earth, new Ele_beat(1.67, 1, "e"), new Lead(5, "p")];
var royal_knight_data = ["No name set", [0.807, 0.4, 1.17, 1], air, new Boost(1, 2, air), new Lead(15, "a")];
//var jester_data
var crusader_data = ["No name set", [0.807, 0.25, 1.05, 1], fire, new Healing(1.89, 2), new Lead(15, "f")];
//var dark_forest_data
var wolfpack_data = ["No name set", [1.217, 0.1, 0.83, 0], earth, new Leech_blade(1.35, 2), new Lead(5, "p")];
//var lead_general_data
var troll_data = ["No name set", [1.057, 0.1, 1.08, 0], earth, new Leech_blade(1.4, 1), new Lead(15, "e")];

var cedric_data = ["Cedric the Bull", [0.817, 0.4, 1.23, 1], fire, new Boost(1, 2, fire), new Lead(-30, "w")];
var gilbert_data = ["Gilbert the Bad", [1.117, 0.25, 0.82, 2], earth, new Vengeance(1.99, 3), new Lead(10, "p")];
var weezil_data = ["Weezil", [0.717, 0.25, 1.17, 1], fire, new Poison(2, 1), new Lead(10, "h")];

var princess_storm_data = ["Princess Storm", [1.087, 0.4, 0.78, 1], fire, new Boost(1, 2, fire), new Lead(-30, "w")];

var gi_dan_data = ["Gi-Dan", [1.177, 0.4, 0.81, 2], water, new Ele_beat(1.87, 2, "w"), new Lead(10, "p")];
var basil_data = ["Basil the Bat Lord", [0.707, 0.1, 0.71, 1], fire, new Leech_blade(3.03, 4), new Lead(10, "p")]

var jayko_data = ["Jayko", [0.897, 0.25, 1.02, 2], water, new Ele_beat(1.95, 1, undefined), new Lead(5, "p")];
var danju_data = ["Danju", [0.757, 0.25, 1.13, 2], air, new Healing(2.35, 3), new Lead(-30, "e")];
var santis_data = ["Santis", [1.017, 0.25, 1.03, 2], fire, new Armor_break(1.99, 3), new Lead(10, "p")];
var rascus_data = ["Rascus", [0.867, 0.25, 1.2, 2], earth, new Stealth_strike(2.11, 2), new Lead(30, "e")];

var shadow_knight_data = ["No name set", [1.167, 0.4, 0.78, 1], earth, new Ele_beat(1.92, 2, "e"), new Lead(+5, "p")];
var vladek_data = ["Vladek", [1.277, 0.45, 0.65, 2], earth, new Ele_beat(2.81, 4, "e"), new Lead(-30, "f")];
var dracus_data = ["Dracus", [1.137, 0.3, 1.02, 2], air, new Boost(1, 2, air), new Lead(10, "p")];
var karzon_data = ["Karzon", [0.937, 0.25, 1.06, 2], water, new Poison(1.89, 2), new Lead(-30, "w")];

var bonsai_data = ["Bonsai", [1.167, 0.1, 1.12, 0], earth, new Boost(1, 2, earth), new Lead(5, "p")];
var kahuka_data = ["King Kahuka", [0.657, 0.2, 0.83, 0], air, new Poison(4, 4), new Lead(10, "h")];

var levahk_data = ["Levahk", [0.687, 0.5, 0.93, 1], air, new Ele_beat(3.95, 2, "a"), new Lead(30, "a")];
var nuhvok_data = ["Nuhvok", [0.687, 0.45, 1.04, 1], earth, new AOE(3.2, 3, "e"), new Lead(-30, "e")];
var pahrak_data = ["Pahrak", [0.687, 0.4, 0.78, 1], earth, new Poison_hive(4, 3), new Lead(-30, "f")];

var kai_data = ["Kai", [1.317, 0.5, 0.65, 0], fire, new Ele_beat(1.72, 2, "f"), new Lead(30, "f")];
var jay_data = ["Jay", [0.877, 0.5, 0.72, 0], water, new Rolling_thunder(2.4, 4), new Lead(-30, "a")];
var cole_data = ["Cole", [0.967, 0.5, 0.87, 0], earth, new AOE(2.6, 4, "e"), new Lead(-30, "e")];
var zane_data = ["Zane", [0.837, 0.5, 0.95, 0], water, new AOE(2.96, 4, "w"), new Lead(30, "w")];


// need to set these guys leader skills
var first_war_vet = ["No name set", [1.175, 0.45, 0.88, 2], earth, new Ele_beat(1.8, 2, "e"), new Lead(5, "p")];
var saracen_data = ["No name set", [1.075, 0.33, 0.92, 0], fire, new Ele_beat(1.88, 1, "f"), new Lead(5, "p")];
var peter_data = ["Peter", [1.105, 0.66, 0.77, 1], water, new Ele_beat(2.5, 2, "w"), new Lead(-30, "w")];
var lanze_data = ["Lanze", [0.905, 0.55, 1.01, 1], earth, new Ele_beat(3.25, 2, undefined), new Lead(-30, "f")];
var anyo_data = ["Anyo", [1.115, 0.2, 0.9, 1], fire, new Poison(1.66, 2), new Lead(-30, "f")];

var onua_data = ["Onua", [0.973, 0.2, 1.13, 1], earth, new Ele_beat(1.3, 2, "e"), new Lead(5, "p")];
var lewa_data = ["Lewa", [0.983, 0.05, 1.2, 1], air, new Ele_beat(1.6, 1, "a"), new Lead(10, "h")];

var tahu_u_data = ["Tahu Uniter", [1.123, 0.5, 1.12, 2], fire, new Ele_beat(2.1, 2, "f"), new Lead(30, "f")];
var kopaka_u_data = ["Kopaka Uniter", [1.033, 0.25, 1.07, 1], water, new Ele_beat(1.8, 2, "w"), new Lead(10, "p")];



var teams = [];

var MNTS = new Team([new Warrior(levahk_data, 34), new Warrior(dragon_knight_data, 34), new Warrior(gi_dan_data, 34)], "MNTS");
var M_dual_boosts = new Team([new Warrior(karzon_data, 34), new Warrior(dracus_data, 34), new Warrior(princess_storm_data, 34)], "M_dual_boosts");
var morcia = new Team([new Warrior(santis_data, 34), new Warrior(rascus_data, 34), new Warrior(danju_data, 34)], "morcia");
var stall = new Team([new Warrior(basil_data, 34), new Warrior(pahrak_data, 34), new Warrior(danju_data, 34)], "Stall");
var kk_villains = new Team([new Warrior(cedric_data, 34), new Warrior(weezil_data, 34), new Warrior(gilbert_data, 34)], "Villains of Knights' Kingdom I");

var NNTS = new Team([new Warrior(kopaka_u_data, 34), new Warrior(tahu_u_data, 34), new Warrior(lewa_data, 34)], "NNTS");

var paul_team = new Team([new Warrior(anyo_data, 34), new Warrior(lanze_data, 34), new Warrior(peter_data, 34)], "paul_team");
