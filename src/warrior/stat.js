export class Stat{
    // type is a Stat enum
    constructor(type, base, levelsUp=false){
        this.type = type;
        this.base = base;
        this.levelsUp = levelsUp;
        this.value = this.base;
    }
    
    copy(){
        let ret = new Stat(this.type, this.base, this.levelsUp);
        ret.value = this.value;
        return ret;
    }
    
    getBase(){
        return this.base;
    }
    
    getValue(){
        return this.value;
    }
}
Stat.PHYS = 0;
Stat.ELE = 1;
Stat.ARM = 2;
Stat.HP = 3;