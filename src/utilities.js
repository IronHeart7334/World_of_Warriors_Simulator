// buggy, scrolling messes it up
export function check_click(event){
	let x = event.clientX;
    let y = event.clientY;
    
    for (let button of MASTER.active_buttons){
    	button.check_if_click(x, y);
    }
}

class Button{
    constructor(text, color, x, y, width, height, functions){
        this.text = text;
        this.color = color;
        this.x = x;
        this.y = y;
        this.w = width;
        this.h = height;
        this.functions = functions;
        MASTER.active_buttons.push(this);
        this.draw();
    }
	// change this to scale text based on length of this.text
	draw(){
		if (this.color !== "none"){
		    rect(this.color, this.x, this.y, this.w, this.h);
		    var t = new Text(10, "rgb(0, 0, 0)", this.x, this.y);
		    t.add(this.text);
		}
	}
	check_if_click(x, y){
	    var c = document.getElementById("canvas");
	    var tx = this.x / 100 * c.width;
	    var ty = this.y / 100 * c.height;
	    var tw = this.w / 100 * c.width;
	    var th = this.h / 100 * c.height;
	    
		if (x >= tx && x <= tx + tw && y >= ty && y <= ty + th){
			for (var f of this.functions){
				f();
			}
		}
	}
}