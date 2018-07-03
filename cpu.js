function cpu(Mem , Reg , keyBoard , Scr , ipc){

  /*
    * Memory instance : chip8's Memory
    * Register instance : chip8's Register
    * keyboard instance : chip8's keyboard
    * screen instance : chip8's graphic system
    * instructionsPerCycle : Instructions Per cycle
    * pause : pause the cpu cycle
  */

  this.memory = Mem;
  this.register = Reg;
  this.keyboard = keyBoard;
  this.screen = Scr;
  this.instructionsPerCycle = ipc;

  this.pause = false;
}

//cpu cyclee
cpu.prototype.cycle = function(){

  // if IPC set to 10 , it has to fetch decode and execute 10 instruction per cpu cycle
  for(let i = 0 ; i < this.instructionsPerCycle ; i++){
    if(!this.pause){
      this.execute(this.decode(this.fetch()));
    }
  }


  //Timers count down to zero if they have been set to a value larger than zero.
  if(!this.pause){
    if(this.register.delayTimer > 0x00)
    	this.register.delayTimer = this.register.delayTimer - 0x1;
    if(this.register.soundTimer > 0x00)
    	this.register.soundTimer = this.register.soundTimer - 0x1;
  }

  //draw in canvas
  this.screen.draw();
}

/*
  * fetch a cpu opcode
  * if first byte is 0xC1(11000001) , and next byte is 0x05(00000101)
  * we have to left shift the first byte 8 bits like : 1100000100000000
  * and do and operation to the next instruction to merge them (1100000100000000 & 00000101)
  * we can have a 16 bit instruction which is the real opcode like 1100000100000101
  * finally return it
*/
cpu.prototype.fetch = function(){
  return (this.memory.memory[this.register.pc] << 8) | (this.memory.memory[this.register.pc + 0x1]);
}

// get which instruction that we have to execute
cpu.prototype.decode = function(opcode){

    /*
      * NNN: address
      * NN: 8-bit constant
      * N: 4-bit constant
      * X and Y: 4-bit register identifier
      * PC : Program Counter
      * I : 16bit register (For memory address) (Similar to void pointer)

      * if a opcode is 1100 0001 0000 0101
      * 1. NNN is the last 12 bit 0001 0000 0101 do and operation with 0x0FFF to get last 12 bit digit
      * 2. NN is the last 8 bit 0000 0101 do and operation with 0x00FF to get last 8 bit digit
      * 3. N is the last 4 bit 0101 do and operation with 0x000F to get last 4 bit digit
      * 4. X is the second 4-bit group of opcode , in this case , it's 0001 ; Y is the third 4-bit group of opcode
      * After a decode operation , increase the program counter with 2 bits
    */

    var Vx = (opcode & 0x0F00) >> 8;
    var Vy = (opcode & 0x00F0) >> 4;
    var NNN = opcode & 0x0FFF;
    var NN = opcode & 0x00FF;
    var N = opcode & 0x000F;
    this.register.pc += 0x0002;


    /*
      * function in optionSet object return the current instruction of the opcode and memory/register
      * ex : case "0x7000" , it indicates instruction "7XNN" contains address "NN" and register identifier "X" , so the function returns instruction "7XNN" 、 address "NN" and identifier "X"
    */

    var optionsSet = {
      /*
        * if both start with 0x0.
        * In this case we add an additional switch and compare the last four bits , the same blow
      */
      0x0000 : function(){
        if(opcode === 0x00E0)
          return {instruction : "00E0"};
        else if(opcode === 0x00EE)
          return {instruction : "00EE"};
        else{

          // if no opcode match , print message and return "Error" instruction
          console.log(`opcode : ${opcode.toString(16)} is wrong`);
          return {instruction : "Error"};
        }
      },

      0x1000 : function(){
        return {instruction : "1NNN" , NNN : NNN};
      },

      0x2000 : function(){
        return {instruction : "2NNN" , NNN : NNN};
      },

      0x3000 : function(){
        return {instruction : "3XNN" , Vx : Vx , NN : NN};
      },

      0x4000 : function(){
        return {instruction : "4XNN" , Vx : Vx , NN : NN};
      },

      0x5000 : function(){
        return {instruction : "5XY0" , Vx : Vx , Vy : Vy};
      },

      0x6000 : function(){
        return {instruction : "6XNN" , Vx : Vx , NN : NN};
      },

      0x7000 : function(){
        return {instruction : "7XNN" , Vx : Vx , NN : NN};
      },

      0x8000 : function(){
        if(N === 0x0000)
          return {instruction : "8XY0" , Vx : Vx , Vy : Vy};
        else if(N === 0x0001)
          return {instruction : "8XY1" , Vx : Vx , Vy : Vy};
        else if(N === 0x0002)
          return {instruction : "8XY2" , Vx : Vx , Vy : Vy};
        else if(N === 0x0003)
          return {instruction : "8XY3" , Vx : Vx , Vy : Vy};
        else if(N === 0x0004)
          return {instruction : "8XY4" , Vx : Vx , Vy : Vy};
        else if(N === 0x0005)
          return {instruction : "8XY5" , Vx : Vx , Vy : Vy};
        else if(N === 0x0006)
          return {instruction : "8XY6" , Vx : Vx , Vy : Vy};
        else if(N === 0x0007)
          return {instruction : "8XY7" , Vx : Vx , Vy : Vy};
        else if(N === 0x000E)
          return {instruction : "8XYE" , Vx : Vx , Vy : Vy};
        else{
          console.log(`opcode : ${opcode.toString(16)} is wrong`);
          return {instruction : "Error"};
        }
      },

      0x9000 : function(){
        return {instruction : "9XY0" , Vx : Vx , Vy : Vy};
      },

      0xA000 : function(){
        return {instruction : "ANNN" , NNN : NNN};
      },

      0xB000 : function(){
        return {instruction : "BNNN" , NNN : NNN};
      },

      0xC000 : function(){
        return {instruction : "CXNN" , Vx : Vx , NN : NN};
      },

      0xD000 : function(){
        return {instruction : "DXYN" , Vx : Vx , Vy : Vy , N : N};
      },

      0xE000 : function(){
        if(NN === 0x009E)
          return {instruction : "EX9E" , Vx : Vx};
        else if(NN === 0x00A1)
          return {instruction : "EXA1" , Vx : Vx};
        else{
          console.log(`opcode : ${opcode.toString(16)} is wrong`);
          return {instruction : "Error"};
        }
      },

      0xF000 : function(){
        if(NN === 0x0007)
          return {instruction : "FX07" , Vx : Vx};
        else if(NN === 0x000A)
          return {instruction : "FX0A" , Vx : Vx};
        else if(NN === 0x0015)
          return {instruction : "FX15" , Vx : Vx};
        else if(NN === 0x0018)
          return {instruction : "FX18" , Vx : Vx};
        else if(NN === 0x001E)
          return {instruction : "FX1E" , Vx : Vx};
        else if(NN === 0x0029)
          return {instruction : "FX29" , Vx : Vx};
        else if(NN === 0x0033)
          return {instruction : "FX33" , Vx : Vx};
        else if(NN === 0x0055)
          return {instruction : "FX55" , Vx : Vx};
        else if(NN === 0x0065)
          return {instruction : "FX65" , Vx : Vx};
        else{
          console.log(`opcode : ${opcode.toString(16)} is wrong`);
          return {instruction : "Error"};
        }

      }
    }


    // first look the first 4 bits of opcode to determine the instruction
    if(!((opcode & 0xF000) in optionsSet)){
      console.log(`opcode : ${opcode.toString(16)} is wrong`);
      return {instruction : "Error"};
    }
    else
      return optionsSet[(opcode & 0xF000)]();
}

//execute the instruction
cpu.prototype.execute = function(opts){
  var _this = this;

  /*
    * opcodeExecute implement the instruction operation
    * each function in opcodeExecute represent the different instructions
    * More infomation: https://en.wikipedia.org/wiki/CHIP-8#Opcode_table
  */
  var opcodeExecute = {

    /*
      * code : 00E0 (Display)
      * disp_clear()
      * Clears the screen.
    */
    "00E0" : function(){
      _this.screen.clearScreen();
      return;
    },

    /*
      * 00EE (Flow)
      * return;
      * Returns from a subroutine.
      * get program counter from stack and set to the current program counter
    */
    "00EE" : function(){
      _this.register.pc = _this.memory.stack.pop();
      return;
    },

    /*
      * 1NNN (Flow)
      * goto NNN;
      * Jumps to address NNN.
      * Set current pc to address NNN (program goto NNN)
    */
    "1NNN" : function(){
      _this.register.pc = opts.NNN;
      return;
    },

    /*
      * 2NNN (Flow)
      * *(0xNNN)()
      * Calls subroutine at NNN.
      * store the current program counter and set the program counter to NNN
    */
    "2NNN" : function(){
      _this.memory.stack.push(_this.register.pc);
      _this.register.pc = opts.NNN;
      return;
    },

    /*
      * 3XNN	(Condition)
      * if(Vx==NN)
      * Skips the next instruction if VX equals NN. (Usually the next instruction is a jump to skip a code block)
      * if V[X(X = 0~F)] equal to NN , pc+=2 to skip the instruction
    */
    "3XNN" : function(){
      if(_this.register.V[opts.Vx] == opts.NN)
        _this.register.pc += 0x0002;
      return;
    },

    /*
      * 4XNN	(Condition)
      * if(Vx!=NN)
      * Skips the next instruction if VX doesn't equal NN. (Usually the next instruction is a jump to skip a code block)
      * if V[X(X = 0~F)] ain't equal to NN , pc+=2 to skip the instruction
    */
    "4XNN" : function(){
      if(_this.register.V[opts.Vx] != opts.NN)
         _this.register.pc += 0x0002;
      return;
    },

    /*
      * 5XY0	(Condition)
      * if(Vx==Vy)
      * Skips the next instruction if VX equals VY. (Usually the next instruction is a jump to skip a code block)
      * if V[X(X = 0~F)] equal to  V[Y(Y = 0~F)] , pc+=2 to skip the instruction
    */
    "5XY0" : function(){
      if(_this.register.V[opts.Vx] == _this.register.V[opts.Vy])
        _this.register.pc += 0x0002;
      return;
    },

    /*
      * 6XNN	(Const)
      * Vx = NN
      * Sets VX to NN.
    */
    "6XNN" : function(){
      _this.register.V[opts.Vx] = opts.NN;
      return;
    },

    /*
      * 7XNN	(Const)
      * Vx += NN
      * Adds NN to VX. (Carry flag is not changed)
    */
    "7XNN" : function(){
      _this.register.V[opts.Vx] += opts.NN;
      return;
    },

    /*
      * 8XY0	(Assign)
      * Vx=Vy
      * Sets VX to the value of VY.
    */
    "8XY0" : function(){
      _this.register.V[opts.Vx] = _this.register.V[opts.Vy];
      return;
    },

    /*
      * 8XY1	(Bit operation)
      * Vx=Vx|Vy
      * Sets VX to VX or VY. (Bitwise OR operation)
    */
    "8XY1" : function(){
      _this.register.V[opts.Vx] = (_this.register.V[opts.Vx] | _this.register.V[opts.Vy]);
      return;
    },

    /*
      * 8XY2	(Bit operation)
      * Vx=Vx&Vy
      *	Sets VX to VX and VY. (Bitwise AND operation)
    */
    "8XY2" : function(){
      _this.register.V[opts.Vx] = (_this.register.V[opts.Vx] & _this.register.V[opts.Vy]);
      return;
    },

    /*
      * 8XY3	(Bit operation)
      * Vx=Vx^Vy
      * Sets VX to VX xor VY.
    */
    "8XY3" : function(){
      _this.register.V[opts.Vx] = (_this.register.V[opts.Vx] ^ _this.register.V[opts.Vy]); //V[x] = V[x] XOR V[y]
      return;
    },

    /*
      * 8XY4	(Math)
      * Vx += Vy
      * Adds VY to VX. VF is set to 1 when there's a carry, and to 0 when there isn't.
      * if(V[x] + V[y] > FF) then carry V[16] = 1
      * if no carry V[15] = 0
    */
    "8XY4" : function(){
      if(_this.register.V[opts.Vx] + _this.register.V[opts.Vy] > 0x00FF)
        _this.register.V[0xF] = 0x01;
      else
        _this.register.V[0xF] = 0x00;
      _this.register.V[opts.Vx] += _this.register.V[opts.Vy];
      return;
    },

    /*
      * 8XY5	(Math)
      * Vx -= Vy
      * VY is subtracted from VX. VF is set to 0 when there's a borrow, and 1 when there isn't.
      * if(V[x] < V[y]) then borrow  V[16] = 0
      * if no carry V[15] = 1
    */
    "8XY5" : function(){
      if(_this.register.V[opts.Vx] < _this.register.V[opts.Vy])
        _this.register.V[0xF] = 0x00;
      else
        _this.register.V[0xF] = 0x01;
      _this.register.V[opts.Vx] -= _this.register.V[opts.Vy];
      return;
    },

    /*
      * 8XY6	(Bit operation)
      * Vx=Vy>>1
      * Shifts VY right by one and stores the result to VX (VY remains unchanged). VF is set to the value of the least significant bit of VY before the shift
      * if V[x] = 0x05 , V[16] = 5 then V[x] = V[x] >> 1
    */
    "8XY6" : function(){
      _this.register.V[0xF] = (_this.register.V[opts.Vx] & 0x01);
      _this.register.V[opts.Vx] = (_this.register.V[opts.Vx] >> 0x01);
      return;
    },

    /*
      * 8XY7 (Math)
      * Vx=Vy-Vx
      * Sets VX to VY minus VX. VF is set to 0 when there's a borrow, and 1 when there isn't.
      * if V[y] < V[x] then borrow , if borrow,V[15] = 0
    */
    "8XY7" : function(){
      if(_this.register.V[opts.Vx] > _this.register.V[opts.Vy])
        _this.register.V[0xF] = 0x00;
      else
        _this.register.V[0xF] = 0x01;
      _this.register.V[opts.Vy] -= _this.register.V[opts.Vx];
      return;
    },

    /*
      * 8XYE   (Bit operation)
      * Vx=Vy=Vy<<1
      * Shifts VX left by one. VF is set to the value of the most significant bit of VX before the shift
      * if V[x] = 0x05(Hex) = 0000 0101(binary) then MSB is V[x] >> 7 = "0" , then V[x] = V[x] << 1
    */
    "8XYE" : function(){
      _this.register.V[0xF] = (_this.register.V[opts.Vx] >> 7);
      _this.register.V[opts.Vx] = (_this.register.V[opts.Vx] << 0x01);
      return;
    },

    /*
      * 9XY0 (Condition)
      * if(Vx!=Vy)
      * Skips the next instruction if VX doesn't equal VY. (Usually the next instruction is a jump to skip a code block)
      * if V[x] not equal to V[y] , skip next instruction by adding pc with 2 bit
    */
    "9XY0" : function(){
      if(_this.register.V[opts.Vx] != _this.register.V[opts.Vy])
      _this.register.pc += 0x0002;
      return;
    },

    /*
      * ANNN (Memory),
      * I = NNN
      * Sets I to the address NNN.
    */
    "ANNN" : function(){
      _this.register.I = opts.NNN;
      return;
    },

    /*
      * BNNN  (Flow)
      * PC=V0+NNN
      * Jumps to the address NNN plus V0.
      * program counter = V[0] + NNN
    */
    "BNNN" : function(){
      _this.register.pc = _this.register.V[0x0] + opts.NNN;
      return;
    },

    /*
      * CXNN  (Random)
      * Vx=rand()&NN
      * Sets VX to the result of a bitwise and operation on a random number (Typically: 0 to 255) and NN.
    */
    "CXNN" : function(){
      _this.register.V[opts.Vx] = (Math.floor(Math.random() * 0xFF) & opts.NN);
      return;
    },

    /*
      * DXYN  (Display)
      * draw(Vx,Vy,N)
      * Draws a sprite at coordinate (VX, VY)
			* that has a width of 8 pixels and a height of N pixels.
			* Each row of 8 pixels is read as bit-coded starting from memory location I;
			* I value doesn't change after the execution of this instruction.
			* As described above,
			* VF is set to 1 if any screen pixels are flipped from set to unset when the sprite is drawn, and to 0 if that doesn't happen
    */
    "DXYN" : function(){
      var x = _this.register.V[opts.Vx];
      var y = _this.register.V[opts.Vy];

      //get height : N
      var height = (opts.N);

      //pixel indecate the memory where sprite draws
      var pixel;
      _this.register.V[0xF] = 0x00;

      //height index from 0 to N height start loop
      for(let height_index = 0 ; height_index < height ; height_index++){

        //pixel = memory[I+height index]
				pixel = _this.memory.memory[_this.register.I + height_index];

        //memory is 8 bit , scan each bit
				for(let bit_index = 0 ; bit_index<8 ; bit_index++){

          //check if each bit ain't equal to 0
					if((pixel & (0x80 >> bit_index)) != 0x00){

            //set and get to graphic map
						if(_this.screen.setPixel(x + bit_index , y + height_index))

            //if it's equal to 1 and gfx is equal to 1 too , then set V[15] to 1 , a pixel is erased
							_this.register.V[0xF] = 1;
          }
        }
			}
      return;
    },

    /*
    * EX9E (Key Operation)
    * if(key()==Vx)
    * Skips the next instruction if the key stored in VX is pressed. (Usually the next instruction is a jump to skip a code block)

    * if key(V[x]) is pressed
    * skip to next instruction
    */
    "EX9E" : function(){
      if(_this.keyboard.getKeyStore()[_this.register.V[opts.Vx]])
        _this.register.pc += 0x0002;
      return;
    },

    /*
      * EXA1  (Key Operation)
      * if(key()!=Vx)
      * Skips the next instruction if the key stored in VX isn't pressed. (Usually the next instruction is a jump to skip a code block)

      * if key(V[x]) ain't pressed , then sjip to next instruction
    */
    "EXA1" : function(){
      if(!_this.keyboard.getKeyStore()[_this.register.V[opts.Vx]])
        _this.register.pc += 0x0002;
      return;
    },

    /*
      * FX07 (Timer)
      * Vx = get_delay()
      * Sets VX to the value of the delay timer.
    */
    "FX07" : function(){
      _this.register.V[opts.Vx] = _this.register.delayTimer;
      return;
    },

    /*
      * FX0A (KeyOp)
      * Vx = get_key()
      * A key press is awaited, and then stored in VX. (Blocking Operation. All instruction halted until next key event)
    */
    "FX0A" : function(){
      _this.pause = true;

      //infinite loop (stop cpu cycle)
      while(true){

        //when a key is pressed
        if(window.aKeyPressed){
          _this.pause = false;

          //get what key is store in the array and set to V[x]
          for(let i = 0 ; i < 16 ; i++)
            if(_this.keyboard.getKeyStore()[i])
              _this.register.V[opts.Vx] = i;
          return;
        }
      }
      return;
    },

    /*
      * FX15 (Timer)
      * delay_timer(Vx)
      * Sets the delay timer to VX.
    */
    "FX15" : function(){
      _this.register.delayTimer = _this.register.V[opts.Vx];
      return;
    },

    /*
      * FX18  (Sound)
      * sound_timer(Vx)
      * Sets the sound timer to VX.
    */
    "FX18" : function(){
      _this.register.soundTimer = _this.register.V[opts.Vx];
      return;
    },

    /*
      * FX1E (Memory)
      * I +=Vx
      * Adds VX to I.
    */
    "FX1E" : function(){
      _this.register.I = (_this.register.I + _this.register.V[opts.Vx]);
      return;
    },

    /*
      * FX29 (Memory)
      * I=sprite_addr[Vx]
      * Sets I to the location of the sprite for the character in VX. Characters 0-F (in hexadecimal) are represented by a 4x5 font.
    */
    "FX29" : function(){

      //set  I = 0x000(memory where the character starts) + V[x] * 5(each character is 5 bit
      _this.register.I = (0x000 + _this.register.V[opts.Vx] * 0x05);
      return;
    },

    /*
      * FX33	(BCD)
      * set_BCD(Vx);
      * 1. *(I+0)=BCD(3);
        2. *(I+1)=BCD(2);
        3. *(I+2)=BCD(1);

      * Stores the binary-coded decimal representation of VX,
        with the most significant of three digits at the address in I,
        the middle digit at I plus 1, and the least significant digit at I plus 2.
      * (In other words, take the decimal representation of VX,
        place the hundreds digit in memory at location in I,
        the tens digit at location I+1, and the ones digit at location I+2.)
    */
    "FX33" : function(){
      _this.memory.memory[_this.register.I] = (_this.register.V[opts.Vx] /100);
      _this.memory.memory[_this.register.I + 0x01] = ((_this.register.V[opts.Vx] /10) %10);
      _this.memory.memory[_this.register.I + 0x02] = ((_this.register.V[opts.Vx] /100) %10);
      return;
    },

    /*
      * FX55  (Memory)
      * reg_dump(Vx,&I)
      * Stores V0 to VX (including VX) in memory starting at address I.
    */
    "FX55" : function(){
      for(let i = 0 ; i<= opts.Vx ;i++)

        //set memory[I + currentV[x]] to V[x]
        _this.memory.memory[(_this.register.I + i)] = _this.register.V[i];

        //after loop , set I = the memory next to X
      _this.register.I = (_this.register.I + opts.Vx + 0x0001);
      return;
    },

    /*
      * FX65  (Memory)
      * reg_load(Vx,&I)
      * Fills V0 to VX (including VX) with values from memory starting at address I
    */
    "FX65" : function(){
      //from v0 to vx
      for(let i = 0 ; i<= opts.Vx ;i++)

        //set V[i ( i from 0 to x)] to memory[I + currentV[x]]
        _this.register.V[i] = _this.memory.memory[(_this.register.I + i)];

        //after loop , set I = the memory next to X
      _this.register.I = (_this.register.I + opts.Vx + 0x0001);
      return;
    }
  }

  // if instructions equal to "Error" , ain't execute the instruction
  if(opts.instruction != "Error"){
    opcodeExecute[opts.instruction]();
  }

}
