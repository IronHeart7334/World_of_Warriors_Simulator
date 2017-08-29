var warriors = [];
/*
var abu = ["Abu", [0.9334, 0.4, 1.05, 1], fire, new Ele_beat(1.7, 1, "f"), new Lead(15, "f")];
// mod?
var brutus = ["Brutus", [0.9334, 0.1, 0.8, 2], fire, new Leech_blade(2.05, 2), new Lead(-15, "f")];
var zazan = ["Zazan", [0.9, 0.25, 0.96, 1], fire, new Phantom_shield(), new Lead(15, "f")];
var gunnar = ["Gunnar", [1.0665, 0.1, 0.78, 2], earth, new Berserk(2.05, 3), new Lead(15, "e")];
var osgood = ["Osgood", [0.7334, 0.4, 1.15, 1], earth, new AOE(1.8, 1, "e"), new Lead(-15, "e")];
var blaine = ["Blaine", [0.9167, 0.25, 0.75, 2], earth, new Regeneration(2.6, 2), new Lead(15, "e")];
var toki = ["Toki", [1, 0.4, 1, 0], air, new Ele_beat(1.85, 2, "a"), new Lead(-15, "e")];
var kendrix = ["Kendrix", [0.9334, 0.1, 1.1, 1], air, new Berserk(1.68, 2), new Lead(-15, "3")];
var le_roc = ["Le Roc", [1.05, 0.25, 0.7, 2], air, new Ele_beat(2.15, 3, undefined), new Lead(15, "a")];
// mod?
var sakuma = ["Sakuma", [1.1665, 0.15, 0.75, 2], air, new Phantom_strike(1.4, 2), new Lead(5, "p")];
var zenghis = ["Zenghis", [1.05, 0.4, 0.95, 1], water, new Ele_beat(1.55, 1, "w"), new Lead(-15, "a")];
// mod?
var clovis = ["Clovis", [0.8, 0.3, 0.91, 1], water, new Healing(3.1, 2), new Lead(-15, "w")];
var yada = ["Yada", [0.7, 0.25, 1.1, 2], water, new Ele_beat(2.1, 1, undefined), new Lead(10, "h")];
var ram = ["Ram", [0.8334, 0.25, 1.13, 0], water, new Poison(2.1, 1), new Lead(15, "w")];

var naro = ["Naro", [0.766, 0.25, 0.6, 1], fire, new Ele_beat(3.5, 3, undefined), new Lead(25, "p")];
var aka = ["Aka", [1.0165, 0.4, 0.9, 0], earth, new Ele_beat(2.2, 2, "e"), new Lead(5, "p")];
var crixus = ["Crixus", [0.8667, 0.4, 1.05, 2], air, new Boost(air), new Lead(-15, "e")];
var alkan = ["Alkan", [0.9332, 0.5, 0.7, 1], water, new Ele_beat(3.9, 3, "w"), new Lead(15, "w")];

var breth = ["Breth", [1.1834, 0.25, 0.85, 1], water, new Phantom_shield(), new Lead(-30, "a")];

var sama = ["Sama", [1.0834, 0.3, 1.03, 1], air, new Phantom_shield(), new Lead(10, "p")];
var agoolik = ["agoolik", [0.9334, 0.30, 1.1, 1], water, new Phantom_shield(), new Lead(-30, "a")];

warriors = warriors.concat([abu, brutus, zazan, gunnar, osgood, blaine, toki, kendrix, le_roc, sakuma, zenghis, clovis, yada, ram]);
warriors = warriors.concat([naro, aka, crixus, alkan]);
warriors = warriors.concat([breth]);
warriors = warriors.concat([agoolik, sama]);

var starter = new Team([new Warrior(abu, 5), new Warrior(zenghis, 5), new Warrior(toki, 5)], "Starter Team");
var arena = new Team([new Warrior(abu, 5), new Warrior(gunnar, 5), new Warrior(sakuma, 5)], "Arena Favorites");
var real_teams = [starter, arena];
*/
var abu = ["Abu", [0.9334, 0.4, 1.05, 1, 1], fire, new Beat(true), new Lead(15, "f")];
warriors.push(abu);
var abu1 = new Team([new Warrior(abu, 5), new Warrior(abu, 5), new Warrior(abu, 5)], "ABU");
var abu2 = new Team([new Warrior(abu, 5), new Warrior(abu, 5), new Warrior(abu, 5)], "ABU");
var real_teams = [abu1, abu2];
