var warriors = [];
/*
var zazan = ["Zazan", [0.9, 0.25, 0.96, 1], fire, new Phantom_shield(), new Lead(15, "f")];
var sakuma = ["Sakuma", [1.1665, 0.15, 0.75, 2], air, new Phantom_strike(1.4, 2), new Lead(5, "p")];

var breth = ["Breth", [1.1834, 0.25, 0.85, 1], water, new Phantom_shield(), new Lead(-30, "a")];

var sama = ["Sama", [1.0834, 0.3, 1.03, 1], air, new Phantom_shield(), new Lead(10, "p")];
var agoolik = ["agoolik", [0.9334, 0.30, 1.1, 1], water, new Phantom_shield(), new Lead(-30, "a")];

warriors = warriors.concat([abu, brutus, zazan, gunnar, osgood, blaine, toki, kendrix, le_roc, sakuma, zenghis, clovis, yada, ram]);
warriors = warriors.concat([naro, aka, crixus, alkan]);
warriors = warriors.concat([breth]);
warriors = warriors.concat([agoolik, sama]);

var arena = new Team([new Warrior(abu, 5), new Warrior(gunnar, 5), new Warrior(sakuma, 5)], "Arena Favorites");
var real_teams = [starter, arena];
*/

// eventually autoconcat warriors to array
class Naro extends Warrior{
    constructor(){
        super(["Naro", [0.766, 0.25, 0.6, 1, 3], fire, new Beat(false), new Lead(25, "p")]);
    }
}
class Lance extends Warrior{

}
class Le_roc extends Warrior{
    constructor(){
        super(["Le Roc", [1.05, 0.25, 0.7, 2, 3], air, new Beat(false), new Lead(15, "a")]);
    }
}
class Yada extends Warrior{
    constructor(){
        super(["Yada", [0.7, 0.25, 1.1, 2, 1], water, new Beat(false), new Lead(10, "h")]);
    }
}
class Abu extends Warrior{
    constructor(){
        super(["Abu", [0.9334, 0.4, 1.05, 1, 1], fire, new Beat(true), new Lead(15, "f")]);
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
	constructor(){
		super(["Aka", [1.0165, 0.4, 0.9, 0, 2], earth, new Beat(true), new Lead(5, "p")]);
	}
}
class Doongara extends Warrior{

}
class Seni extends Warrior{

}
class Toki extends Warrior{
	constructor(){
		super(["Toki", [1, 0.4, 1, 0, 2], air, new Beat(true), new Lead(-15, "e")]);
	}
}
class Maximus extends Warrior{

}
class Viriathus extends Warrior{

}
class Zenghis extends Warrior{
	constructor(){
		super(["Zenghis", [1.05, 0.4, 0.95, 1, 1], water, new Beat(true), new Lead(-15, "a")]);
	}
}
class Kasim extends Warrior{

}
class Alkan extends Warrior{
	constructor(){
		super(["Alkan", [0.9332, 0.5, 0.7, 1, 3], water, new Beat(true), new Lead(15, "w")]);
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
    constructor(){
        super(["Osgood", [0.7334, 0.4, 1.15, 1, 1], earth, new AOE(), new Lead(-15, "e")]);
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
    constructor(){
        super(["Crixus", [0.8667, 0.4, 1.05, 2, 2], air, new Boost(air), new Lead(-15, "e")]);
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
    constructor(){
        super(["Ram", [0.8334, 0.25, 1.13, 0, 1], water, new Poison(), new Lead(15, "w")]);
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

class Gonzalo extends Warrior{

}
class Mccabe extends Warrior{

}
class Kanar extends Warrior{

}
class Gunther extends Warrior{

}
class Everard extends Warrior{

}
class Clovis extends Warrior{
    constructor(){
        super(["Clovis", [0.8, 0.3, 0.91, 1, 2], water, new Healing(), new Lead(-15, "w")]);
    }
}
class Amadok extends Warrior{

}
class Bibi extends Warrior{

}
class Otto extends Warrior{

}
class Brutus extends Warrior{
    constructor(){
        super(["Brutus", [0.9334, 0.1, 0.8, 2, 2], fire, new Soul_steal(), new Lead(-15, "f")]);
    }
}
class Vlad extends Warrior{

}
class Juba extends Warrior{

}

class Unk extends Warrior{

}
class Gunnar extends Warrior{
    constructor(){
        super(["Gunnar", [1.0665, 0.1, 0.78, 2, 3], earth, new Berserk(), new Lead(15, "e")]);
    }
}
class Kendrix extends Warrior{
    constructor(){
        super(["Kendrix", [0.9334, 0.1, 1.1, 1, 2], air, new Berserk(), new Lead(-15, "e")]);
    }
}
class Mungo extends Warrior{

}
class Kofi extends Warrior{

}
class Tarhu extends Warrior{

}
class Agripa extends Warrior{

}
class Isak extends Warrior{

}
class Malik extends Warrior{

}
class Blaine extends Warrior{
    constructor(){
        super(["Blaine", [0.9167, 0.25, 0.75, 2, 2], earth, new Regeneration(), new Lead(15, "e")]);
    }
}
class Wu extends Warrior{

}

class Wang extends Warrior{

}
class Ten_bears extends Warrior{

}
class Ragnar extends Warrior{

}
class Yi_ho extends Warrior{

}
class Bikili extends Warrior{

}
class Waza extends Warrior{

}
class Kashta extends Warrior{

}
class Botheric extends Warrior{

}
class Benkei extends Warrior{

}
class Kido extends Warrior{

}

var starter = new Team([new Abu(), new Zenghis(), new Toki()], "Starter Team");
var abu1 = new Team([new Brutus(), new Osgood(), new Crixus()], "ABU");
var abu2 = new Team([new Naro(), new Ram(), new Le_roc()], "NOT ABU");
var real_teams = [starter, abu1, abu2];
