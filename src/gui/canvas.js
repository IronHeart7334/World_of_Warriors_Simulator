export class Canvas{
    constructor(elementId){
        this.htmlElement = document.getElementById(elementId);
        if(this.htmlElement === null || this.htmlElement.tagName !== "CANVAS"){
            throw new Error("The is no HTML element with an ID of " + elementId);
        }
        this.draw = this.htmlElement.getContext("2d");
    }
    
    setColor(color){
        this.draw.fillStyle = color;
    }
    
    clear(){
        let oldColor = this.draw.fillStyle;
        this.setColor("white");
        this.rect(0, 0, 100, 100);
    }
    
    rect(x, y, w, h){
        /*
        Draws a rectangle.
        x, y, w, and h are all based on
        the size of the canvas

        EX:
            rect(50, 0, 50, 0);

            will draw a rectangle
            that covers the whole right
            side of the canvas
        */
        this.draw.fillRect(
            x / 100 * this.htmlElement.width, 
            y / 100 * this.htmlElement.height, 
            w / 100 * this.htmlElement.width, 
            h / 100 * this.htmlElement.height
        );
    }
    
    circle(x, y, diameter){
        /*
        x, y are coords of UPPER LEFT CORNER,
        not center.
        */
        let radius = diameter / 2;

        let tx = x / 100 * this.htmlElement.width;
        let ty = y / 100 * this.htmlElement.height;
        let tr = radius / 100 * ((this.htmlElement.width + this.htmlElement.height) / 2);

        this.draw.beginPath();
        this.draw.arc(tx + tr, ty + tr, tr, 0, 2 * Math.PI);
        this.draw.fill();
    }
    
    //better way?
    text(x, y, string){
        let oldColor = this.draw.fillStyle;
        this.setColor("black");
        this.draw.fillText(string, x / 100 * this.htmlElement.width, y / 100 * this.htmlElement.height + 30);
        this.setColor(oldColor);
    }
}