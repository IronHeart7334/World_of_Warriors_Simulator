import {GuiElement} from "./guiElement.js";

export class EnergyIcon extends GuiElement{
    constructor(){
        super();
    }
    draw(canvas){
        super.draw(canvas);
        canvas.setColor(this.color);
        canvas.circle(this.x, this.y, this.w);
    }
};