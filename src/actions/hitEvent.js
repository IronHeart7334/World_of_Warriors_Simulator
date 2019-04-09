
export class HitEvent{
    constructor(hitter, hittee, using, damage){
        this.hitter = hitter;
        this.hittee = hittee;
        this.attackUsed = using;
        this.damage = damage;
    }
}