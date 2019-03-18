
export class GuiElement{
    constructor(x=0, y=0, w=0, h=0){
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        
        this.onClick = [];
    }
    
    setPos(x, y){
        this.x = x;
        this.y = y;
    }
    
    setSize(w, h){
        this.w = w;
        this.h = h;
    }
    
    checkClick(x, y){
        if (
            x > this.x &&
            x < this.x + this.w &&
            y > this.y &&
            y < this.y + this.h
        ){
            this.click();
        }
    }
    
    click(){
        this.onClick.forEach((f)=>f());
    }
    
    draw(canvas){
        throw new Error("Method draw is not defined for " + this);
    }
}
