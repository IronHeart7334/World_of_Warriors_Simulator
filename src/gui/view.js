export class View{
    constructor(){
        this.controller = null;
    }
    
    setController(controller){
        this.controller = controller;
    }
    getController(){
        return this.controller;
    }
    
    linkToPage(){
        throw new Error("Method linkToPage not implemented.");
    }
}