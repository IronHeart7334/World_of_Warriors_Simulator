import {verifyType, TYPES, positive} from "../util/verifyType.js";
import {Terminable, TerminableList} from "../util/terminable.js";

/*
The Stat class represents one of a Warrior's
4 stats:
(1) Physical attack
(2) Elemental attack
(3) Armor
(4) Hit points
*/
class Stat{
    /*
    type: an integer between 0 and 3 (inclusive).
        use one of the following:
            - Stat.PHYS
            - Stat.ELE
            - Stat.ARM
            - Stat.HP
    base: the base value for the stat.
    levelsUp: if set to false, the level of
        the warrior this stat belongs to does
        not affect the calculated value of this
        stat. If set to true, the calculated value
        of this stat is base * 1.07^LV
    */
    constructor(type, base, levelsUp=false){
        verifyType(type, TYPES.number);
        positive(base);
        verifyType(levelsUp, TYPES.boolean);
        type = parseInt(type);
        switch(type){
            case Stat.PHYS:
                this.type = type;
                break;
            case Stat.ELE:
                this.type = type;
                break;
            case Stat.ARM:
                this.type = type;
                break;
            case Stat.HP:
                this.type = type;
                break;
            default:
                throw new Error(`type cannot be ${type}, it must be either Stat.PHYS, Stat.ELE, Stat.ARM, or Stat.HP`);
                break;
        }

        this.base = base;
        this.levelsUp = levelsUp;
        this.value = this.base;
        this.boosts = new Map();
    }

    copy(newBase=null){
        if(newBase===null){
            newBase = this.base;
        }
        let ret = new Stat(this.type, newBase, this.levelsUp);
        ret.value = this.value;
        ret.boosts = this.boosts;
        //need to do deep copy here

        return ret;
    }

    calc(lv){
        this.boosts = new Map(); //reset boosts
        if(this.levelsUp){
            this.value = Math.round(this.base * Math.pow(1.07, lv));
        }
    }

    applyBoost(boost){
        this.boosts.set(boost.id, boost);
    }

    getBase(){
        return this.base;
    }

    getValue(){
        let ret;
        let mod = 1;
        for(let boost of this.boosts.values()){
            mod += boost.amount;
        }

        if(this.type === Stat.ARM){
            //                    since mod starts at 1
            ret = this.value + mod - 1;
        } else {
            ret = this.value * mod;
        }
        return Math.round(ret);
    }

    update(){
        let newBoosts = new Map();
        this.boosts.forEach((v, k)=>{
            v.update();
            if(!v.should_terminate){
                newBoosts.set(k, v);
            }
        });
        this.boosts = newBoosts;
    }
}
Stat.PHYS = 0;
Stat.ELE = 1;
Stat.ARM = 2;
Stat.HP = 3;

const STATS = new Map();
STATS.set("p", new Stat(0, 1, true));
STATS.set("e", new Stat(1, 1, true));
STATS.set("a", new Stat(2, 1, false));
STATS.set("h", new Stat(3, 1, true));

function getStatByName(name, base){
    verifyType(name, TYPES.string);
    verifyType(base, TYPES.number);
    let ret = null;
    let letter = name[0].toLowerCase();

    if(STATS.has(letter)){
        ret = STATS.get(letter).copy(base);
    }
    return ret;
}

class StatBoost extends Terminable{
    constructor(id, amount, dur){
        super(id, (stat)=>{
            //not implemented yet
        }, dur);
        this.id = id;
        this.amount = amount;
        this.max_dur = dur;
        this.dur_rem = dur;
        this.should_terminate = false;
    }
    update(){
        this.dur_rem -= 1;
        if(this.dur_rem <= 0){
            this.should_terminate = true;
        }
    }
}

export {
    Stat,
    StatBoost
};
