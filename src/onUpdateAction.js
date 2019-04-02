export class OnUpdateAction{
    constructor(id, f, uses){
        this.id = id;
        this.f = f;
        this.dur = uses;
        this.should_terminate = false;
    }
    run(){
        this.f();
        this.dur -= 1;
        if(this.dur <= 0){
            this.should_terminate = true;
        }
    }
}