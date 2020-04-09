
export class OnHitAction{
    constructor(id, preHitOrPostHit, func, duration=-1){
        this.id = id;
        this.applyBeforeHit = preHitOrPostHit === OnHitAction.PRE_HIT;
        this.func = func;
        this.duration = duration;
        this.shouldTerminate = false;
    }
    setUser(warrior){
        this.user = warrior;
    }
    run(hitEvent){
        this.func(hitEvent);
        this.duration--; //make this only trigger if func works?
        //if this has a negative or zero base duration, it will last forever
        this.shouldTerminate = this.duration === 0;
    }
}
OnHitAction.PRE_HIT = 0;  //trigger before inflicting final damage
OnHitAction.POST_HIT = 1; //after inflicting damage