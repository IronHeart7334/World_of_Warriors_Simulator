import {verifyType, TYPES, notNegative} from "../util/verifyType.js";
import {Terminable, TerminableList} from "../util/terminable.js";



// The base values for both stats
const OFFENSE = 33.73;
const HP = 107.0149;

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
    value: the multiplier for the stat relative to the base value.
    */
    constructor(type, multiplier){
        verifyType(type, TYPES.number);
        notNegative(multiplier);
        type = parseInt(type);
        switch(type){
            case Stat.PHYS:
                this.name = "Physical attack";
                this.type = type;
                this.base = OFFENSE * multiplier;
                this.levelsUp = true;
                break;
            case Stat.ELE:
                this.name = "Elemental attack";
                this.type = type;
                this.base = OFFENSE * multiplier;
                this.levelsUp = true;
                break;
            case Stat.ARM:
                this.name = "Armor";
                this.type = type;
                this.base = multiplier;
                this.levelsUp = false;
                break;
            case Stat.HP:
                this.name = "HP";
                this.type = type;
                this.base = HP * multiplier;
                this.levelsUp = true;
                break;
            default:
                throw new Error(`type cannot be ${type}, it must be either Stat.PHYS, Stat.ELE, Stat.ARM, or Stat.HP`);
                break;
        }

        this.ctorMultiplier = multiplier;
        this.value = this.base;
        this.boosts = new Map();
    }

    copy(newBase=null){
        if(newBase===null){
            newBase = this.ctorMultiplier;
        }
        let ret = new Stat(this.type, newBase);
        ret.value = this.value;
        ret.boosts = this.boosts;
        //need to do deep copy here

        return ret;
    }

    calc(lv){
        this.boosts.clear();
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
