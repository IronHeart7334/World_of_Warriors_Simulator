import {GuiElement} from "./guiElement.js";
/*
 * The gamePane class is used to store components, 
 * making it easier to manage many at the same time
 */

export class GamePane extends GuiElement{
    constructor(){
        super();
        this.children = [];
    }
    
    addChild(guiElement){
        this.children.push(guiElement);
    }
    
    setClickListener(elementId){
        document.getElementById(elementId).onclick = (event)=>{
            //more here
        };
    }
    
    checkClick(x, y){
        let trueX = x - this.x;
        let trueY = y - this.y;
        
        this.children.forEach((element)=>element.checkClick(trueX, trueY));
    }
    
    draw(canvas){
        this.children.forEach((child)=>child.draw(canvas));
    }
}