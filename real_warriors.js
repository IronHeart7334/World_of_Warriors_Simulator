var warriors = [];

var abu = ["Abu", [0.9334, 0.4, 1.05, 1], fire, new Ele_beat(1.7, 1, "f"), new Lead(15, "f")];
// mod?
var brutus = ["Brutus", [0.9334, 0.1, 0.8, 2], fire, new Leech_blade(2.05, 2), new Lead(-15, "f")];
// add later, put into warriors array
// var zazan = ["Zazan", [0.9, 0.25, 0.96, 1], fire, new Phantom_shield(1, 2), new Lead(15, "f")];
var gunnar = ["Gunnar", [1.0665, 0.1, 0.78, 2], earth, new Berserk(1.71, 3), new Lead(15, "e")];
// not sure if pip mod correct
var osgood = ["Osgood", [0.7334, 0.4, 1.15, 1], earth, new AOE(1.8, 1, "e"), new Lead(-15, "e")];
var blaine = ["Blaine", [0.9167, 0.25, 0.75, 2], earth, new Regeneration(2.6, 2), new Lead(15, "e")];
var toki = ["Toki", [1, 0.4, 1, 0], air, new Ele_beat(1.85, 2, "a"), new Lead(-15, "e")];
var kendrix = ["Kendrix", [0.9334, 0.1, 1.1, 1], air, new Berserk(1.4, 2), new Lead(-15, "3")];
var le_roc = ["Le Roc", [1.05, 0.25, 0.7, 2], air, new Ele_beat(2.15, 3, undefined), new Lead(15, "a")];
// mod?
var sakuma = ["Sakuma", [1.1665, 0.15, 0.75, 2], air, new Phantom_strike(1.4, 2), new Lead(5, "p")];
var zenghis = ["Zenghis", [1.05, 0.4, 0.95, 1], water, new Ele_beat(1.55, 1, "w"), new Lead(-15, "a")];
// mod?
var clovis = ["Clovis", [0.8, 0.3, 0.91, 1], water, new Healing(3.1, 2), new Lead(-15, "w")];
var yada = ["Yada", [0.7, 0.25, 1.1, 2], water, new Ele_beat(2.1, 1, undefined), new Lead(10, "h")];
var ram = ["Ram", [0.8334, 0.25, 1.13, 0], water, new Poison(2.1, 1), new Lead(15, "w")];

warriors = warriors.concat([abu, brutus, gunnar, osgood, blaine, toki, kendrix, le_roc, sakuma, zenghis, clovis, yada, ram]);

var starter = new Team([new Warrior(abu, 5), new Warrior(zenghis, 5), new Warrior(toki, 5)], "Starter Team");
var arena = new Team([new Warrior(abu, 5), new Warrior(gunnar, 5), new Warrior(sakuma, 5)], "Arena Favorites");
var real_teams = [starter, arena];