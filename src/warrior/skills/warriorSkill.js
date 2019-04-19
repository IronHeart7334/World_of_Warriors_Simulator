export class WarriorSkill{
    constructor(name, pip=1){
        this.name = name;
        this.pip = pip;
        this.user = undefined;
    }
    
    setUser(warrior){
        this.user = warrior;
    }
    
    apply(){
        throw new Error("Method apply not set for " + name);
    }
    
    checkForTrigger(){
        throw new Error("Method checkForTrigger not set for " + name);
    }
    
    run(){
        throw new Error("Method run not set for " + name);
    }
}