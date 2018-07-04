function chip8(romBin , screenNode , speed){

  /*
    * romBinaryFile : game rom's file
    * screenNode : html canvas node element
    * speed : cycle per monute , default to 10

    * emulationInterval : store the "setInterval" function
    * isMemoryLoad : determine if the game rom is loaded to the memory
  */

  this.romBinaryFile = romBin;
  this.screenNode = screenNode;
  this.speed = speed || 10;

  this.emulationInterval = false;
  this.isMemoryLoad = false;

  /*
    * cpuObj : cpu object instance , store the cpu object to the chip8 class
  */
  var cpuObj;
  this.setCpu = function(inputObj){
    cpuObj = inputObj;
  }
  this.getCpu = function(){
    return cpuObj;
  }
}

chip8.prototype.init = function(){

  // check if there is a cpu cycle loop , stop it
  if(this.emulationInterval){
    this.stopEmulation();
  }

  //load the game
  this.isMemoryLoad = true;

  //initilize the cpu object
  this.setCpu({});

  // get hardware instance(memory , register , keyboard , screen)
  var memoryInstance = new memory(this.romBinaryFile);
  var registerInstance = new register();
  var keyboardInstance = new keyboard();
  var screenInstance = new screen(this.screenNode);
  var audioInstance = new createSound();
  // get cpu instance
  var cpuInstance = new cpu(memoryInstance , registerInstance , keyboardInstance , screenInstance , audioInstance ,  this.speed);

  //save cpu object
  this.setCpu(cpuInstance);
}

//start cpu cycle loop
chip8.prototype.startEmulation = function(frequency){

  //emulator frequency , default 60Hz
  frequency = frequency || 60;

  if(this.emulationInterval){
    // check if there is a cpu cycle loop , stop it
    this.stopEmulation();
  }

  if(!this.isMemoryLoad){
    console.log("chip8 hasn't initilized");
    return;
  }
  else{
    console.log("Emulator now starting...");
    var _this = this;
    this.emulationInterval = window.setInterval(function(){
      _this.getCpu().cycle();
    } , (1000 / frequency))
  }
}

//stop cpu cycle loop
chip8.prototype.stopEmulation = function(){
  if(!this.isMemoryLoad){
    console.log("chip8 hasn't initilized");
    return;
  }
  else{
    if(!this.emulationInterval){
      console.log("Emulation hasn't ready");
      return;
    }
    else {
      console.log("Emulator now stoping...");
      window.clearInterval(this.emulationInterval);
      this.emulationInterval = false;
      return;
    }
  }
}
