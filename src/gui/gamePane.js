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
        let element = document.getElementById(elementId);
        let minX = element.offsetLeft;
        let minY = element.offsetTop;
        let w = element.width;
        let h = element.height;
        
        element.onclick = (event)=>{
            this.checkClick((event.clientX - document.scrollingElement.scrollLeft - minX) / w * 100, (event.clientY - document.scrollingElement.scrollTop - minY) / h * 100);
            //not perfect. Scrolling may mess it up
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