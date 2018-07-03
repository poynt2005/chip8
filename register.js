function register(){

  /*
    * program counter start at memory index 0x200
    * V : 16 8-bit data registers named from V0 to VF. The VF register doubles as a flag for some instructions, thus it should be avoided. In addition operation VF is for carry flag
    * I : 16bit register (For memory address) (Similar to void pointer)
    * Delay timer: This timer is intended to be used for timing the events of games. Its value can be set and read.
    * Sound timer: This timer is used for sound effects. When its value is nonzero, a beeping sound is made.
  */

  this.pc = 0x0200;
  this.V = new Uint16Array(16);
  this.I = 0x0000;

  this.delayTimer = 0x00;
  this.soundTimer = 0x00;
}

register.prototype.printHex = function(){
  console.log(`pc is : 0x${this.pc}`);

  res = [];
  for(let i of this.V)
    res.push("0x" + i.toString(16));

  console.log(res);
}
