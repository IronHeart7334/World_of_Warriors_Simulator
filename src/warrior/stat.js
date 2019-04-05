export class Stat{
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
        let mod = 1;
        this.boosts.values().forEach((boost)=>{
            mod += boost.amount;
        });
        return Math.round(this.value * mod);
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