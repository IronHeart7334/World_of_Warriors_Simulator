// buggy, scrolling messes it up
function check_click(event){
	var x = event.clientX;
    var y = event.clientY;
    
    for (var button of active_buttons){
    	button.check_if_click(x, y);
    }
}

var active_buttons = [];
var canvas_width = 1000;

function Button(text, color, x, y, width, height, functions){
	this.text = text;
	this.color = color;
	this.x = x;
	this.y = y;
	this.w = width;
	this.h = height;
	this.functions = functions;
}
Button.prototype = {
	// change this to scale text based on length of this.text
	draw:function(){
		if (this.color !== "none"){
			canvas.fillStyle = this.color;
			canvas.fillRect(this.x, this.y, this.w, this.h);
		}
		canvas.font = "10px Arial";
		canvas.fillStyle = "rgb(0, 0, 0)";
		canvas.fillText(this.text, this.x + this.w / 2 - this.text.length * 10, this.y + this.h / 2);
	},
	
	check_if_click:function(x, y){
		if (x >= this.x && x <= this.x + this.w && y >= this.y && y <= this.y + this.h){
			for (var f of this.functions){
				f();
			}
		}
	}
}