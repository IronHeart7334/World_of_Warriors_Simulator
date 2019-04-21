
export class HitEvent{
    constructor(hitter, hittee, using, physDmg, eleDmg){
        this.hitter = hitter;
        this.hittee = hittee;
        this.attackUsed = using;
        this.physDmg = physDmg;
        this.eleDmg = eleDmg;
    }
}