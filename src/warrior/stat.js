import {Terminable} from "../util/terminable.js";

class Stat{
    // type is a Stat enum
    constructor(type, base, levelsUp=false){
        this.type = type;
        this.base = base;
        this.levelsUp = levelsUp;
        this.value = this.base;
        this.boosts = new Map();
    }

    copy(){
        let ret = new Stat(this.type, this.base, this.levelsUp);
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
