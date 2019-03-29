let NEXT_ID = 0;
export class GuiElement{
    constructor(x=0, y=0, w=0, h=0){
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.children = [];
        this.onClick = [];
        this.id = NEXT_ID;
        NEXT_ID++;
    }
    
    setPos(x, y){
        this.x = x;
        this.y = y;
    }
    
    setSize(w, h){
        this.w = w;
        this.h = h;
    }
    
    addChild(guiElement){
        this.children.push(guiElement);
    }
    
    removeChild(guiElement){
        let found = false;
        for(let i = 0; i < this.children.length && !found; i++){
            if(guiElement.id === this.children[i].id){
                this.children.splice(i);
                found = true;
            }
        }
    }
    
    addOnClick(func){
        this.onClick.push(func);
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
        this.children.forEach((child)=>{
            child.checkClick(x, y);
        });
    }
    
    click(){
        this.onClick.forEach((f)=>f());
    }
    
    draw(canvas){
        this.children.forEach((child)=>{
            child.draw(canvas);
        });
    }
}
