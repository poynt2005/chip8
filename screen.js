function screen(canvasNode){

  /*
    * Original CHIP-8 Display resolution is 64×32 pixels and color is monochrome.
    * Graphics are drawn to the screen solely by drawing sprites, which are 8 pixels wide and may be from 1 to 15 pixels in height.
    * Sprite pixels are XOR'd with corresponding screen pixels.
    * In other words, sprite pixels that are set flip the color of the corresponding screen pixel, while unset sprite pixels do nothing.
    * The carry flag (VF) is set to 1 if any screen pixels are flipped from set to unset when a sprite is drawn and set to 0 otherwise. This is used for collision detection.
  */

	this.width = 64;
	this.height = 32;

  //get the canvas node
	this.canvasNode = canvasNode;

  //graphic map
	this.gfx = createTwoDimensionArray(this.width, this.height);
}

screen.prototype.clearScreen = function(){
	this.gfx = createTwoDimensionArray(this.width, this.height);
}

screen.prototype.setPixel = function(x , y){

  // detect pixel overflow and process
	if(x > this.width -1)
		while(x > this.width -1){
			x -= this.width;
		}

	if(x < 0)
		while(x < 0){
		  x += this.width;
		}

	if(y > this.height -1)
		while(y > this.height -1){
			y -= this.height;
		}

	if(y < 0)
		while(y < 0){
		  y += this.height;
		}

  /*
    * The state of each pixel is set by using a bitwise XOR operation.
    * This means that it will compare the current pixel state with the current value in the memory.
    * If the current value is different from the value in the memory, the bit value will be 1. If both values match, the bit value will be 0.
  */

	this.gfx[x][y] = this.gfx[x][y] ^ 0x1;

	return !(this.gfx[x][y]);

}

//draw on canvas
screen.prototype.draw = function(scale){
	scale = scale || 10;

	this.canvasNode.width = this.width * scale;
	this.canvasNode.height = this.height * scale;

	var ctx = this.canvasNode.getContext("2d");

	ctx.clearRect(0, 0, this.canvasNode.width, this.canvasNode.height);

	for(let i = 0 ; i<this.width ; i++)
		for(let j = 0 ; j<this.height ; j++){
			if(this.gfx[i][j]){
				ctx.fillStyle = "#000";
				ctx.fillRect(i * scale , j * scale, scale, scale);
			}
		}
}
