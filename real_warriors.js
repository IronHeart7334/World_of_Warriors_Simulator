var warriors = [];
/*
var brutus = ["Brutus", [0.9334, 0.1, 0.8, 2], fire, new Leech_blade(2.05, 2), new Lead(-15, "f")];
var zazan = ["Zazan", [0.9, 0.25, 0.96, 1], fire, new Phantom_shield(), new Lead(15, "f")];
var gunnar = ["Gunnar", [1.0665, 0.1, 0.78, 2], earth, new Berserk(2.05, 3), new Lead(15, "e")];
var blaine = ["Blaine", [0.9167, 0.25, 0.75, 2], earth, new Regeneration(2.6, 2), new Lead(15, "e")];
var kendrix = ["Kendrix", [0.9334, 0.1, 1.1, 1], air, new Berserk(1.68, 2), new Lead(-15, "3")];
var sakuma = ["Sakuma", [1.1665, 0.15, 0.75, 2], air, new Phantom_strike(1.4, 2), new Lead(5, "p")];
var clovis = ["Clovis", [0.8, 0.3, 0.91, 1], water, new Healing(3.1, 2), new Lead(-15, "w")];

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

// eventually autoconcat warriors to array
class Naro extends Warrior{
    constructor(level){
        super(["Naro", [0.766, 0.25, 0.6, 1, 3], fire, new Beat(false), new Lead(25, "p")], level);
    }
}
class Lance extends Warrior{

}
class Le_roc extends Warrior{
    constructor(level){
        super(["Le Roc", [1.05, 0.25, 0.7, 2, 3], air, new Beat(false), new Lead(15, "a")], level);
    }
}
class Yada extends Warrior{
    constructor(level){
        super(["Yada", [0.7, 0.25, 1.1, 2, 1], water, new Beat(false), new Lead(10, "h")], level);
    }
}
class Abu extends Warrior{
    constructor(level){
        super(["Abu", [0.9334, 0.4, 1.05, 1, 1], fire, new Beat(true), new Lead(15, "f")], level);
    }
}
class Kadam extends Warrior{

}
class Volten extends Warrior{

}
class Anil extends Warrior{

}
class Pacorus extends Warrior{

}
class Aka extends Warrior{
	constructor(level){
		super(["Aka", [1.0165, 0.4, 0.9, 0, 2], earth, new Beat(true), new Lead(5, "p")], level);
	}
}
class Doongara extends Warrior{

}
class Seni extends Warrior{

}
class Toki extends Warrior{
	constructor(level){
		super(["Toki", [1, 0.4, 1, 0, 2], air, new Beat(true), new Lead(-15, "e")], level);
	}
}
class Maximus extends Warrior{

}
class Viriathus extends Warrior{

}
class Zenghis extends Warrior{
	constructor(level){
		super(["Zenghis", [1.05, 0.4, 0.95, 1, 1], water, new Beat(true), new Lead(-15, "a")], level);
	}
}
class Kasim extends Warrior{

}
class Alkan extends Warrior{
	constructor(level){
		super(["Alkan", [0.9332, 0.5, 0.7, 1, 3], water, new Beat(true), new Lead(15, "w")], level);
	}
}
class GajahMada extends Warrior{

}
class Boris extends Warrior{
	
}
class Hector extends Warrior{

}
class Gwen extends Warrior{

}
class Osgood extends Warrior{
    constructor(level){
        super(["Osgood", [0.7334, 0.4, 1.15, 1, 1], earth, new AOE(), new Lead(-15, "e")], level);
    }
}
class Ironhart extends Warrior{

}
class Zuu extends Warrior{

}
class Khutulune extends Warrior{

}
class Balash extends Warrior{

}
class Erika extends Warrior{

}
class Ping extends Warrior{

}
class Grim extends Warrior{

}
class Leon extends Warrior{

}
class Cutbert extends Warrior{

}
class Joan extends Warrior{

}
class Alboin extends Warrior{

}
class Tiberius extends Warrior{

}
class Mohinder extends Warrior{

}
class Badda extends Warrior{

}
class Spurius extends Warrior{

}
class Crixus extends Warrior{
    constructor(level){
        super(["Crixus", [0.8667, 0.4, 1.05, 2, 2], air, new Boost(air), new Lead(-15, "e")], level);
    }
}
class Labashi extends Warrior{

}
class Utu extends Warrior{

}
class Kwan extends Warrior{

}
class Simo extends Warrior{

}
class Manawa extends Warrior{

}

class Ram extends Warrior{
    constructor(level){
        super(["Ram", [0.8334, 0.25, 1.13, 0, 1], water, new Poison(), new Lead(15, "w")], level);
    }
}
class Soaring_eagle extends Warrior{

}
class Zuma extends Warrior{

}
class Amina extends Warrior{

}
class Akbar extends Warrior{

}
class Zafir extends Warrior{

}
class Anchaly extends Warrior{

}
class Zenobia extends Warrior{

}
class Hua extends Warrior{

}
class Kazumi extends Warrior{

}
class Wulf extends Warrior{

}
class Kuro extends Warrior{

}


var abu1 = new Team([new Abu(5), new Osgood(5), new Crixus(5)], "ABU");
var abu2 = new Team([new Naro(5), new Ram(5), new Le_roc(5)], "NOT ABU");
var real_teams = [abu1, abu2];
