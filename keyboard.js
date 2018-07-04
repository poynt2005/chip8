function keyboard(){

  /*
    * Keyboard
    * handle keypress , store them , and send it to cpu
  */

  /*
    * store pressed key to Array
    * initilize array
  */
  var keystore = new Array(16).fill(false);



  var _this = this;

  // when press a key , call processPressKey method to handle it
  function onPressKey(e){
    var key = String.fromCharCode(e.which);
    if(_this.mapping.hasOwnProperty(key))
      _this.processPressKey(key);
  }

  // when press a key , call processUnPressKey method to handle it
  function onUnPressKey(e){
    var key = String.fromCharCode(e.which);
    if(_this.mapping.hasOwnProperty(key))
      _this.processUnPressKey(key);
  }

  /*
    * virtual method "waitForKeyPress"
    * when cpu is waiting for a key press , override it
  */
  this.waitForKeyPress = function(){};

  window.removeEventListener("keydown" , onPressKey);
  window.removeEventListener("keyup" , onUnPressKey);

  window.addEventListener("keydown" , onPressKey , false);
  window.addEventListener("keyup" , onUnPressKey , false);

  this.getKeyStore = function(){
    return keystore;
  }
  this.setKeyStore = function(inputKeyStore){
    keystore = inputKeyStore;
    return;
  }

}

//return a boolean to check if a key is pressed
keyboard.prototype.isPressed = function(keyMemory){
    return this.getKeyStore()[keyMemory];
}

//reset the keyStore
keyboard.prototype.reset = function(){
  this.setKeyStore(new Array(16).fill(false));
}

/*
  * When cpu is halted,
    press a key , handle it , and send to cpu
  * Finally , store it to keyStore
*/
keyboard.prototype.processPressKey = function(inputKey){

  //call waitForKeyPress method , the method is now overrided by cpu instance
  this.waitForKeyPress(inputKey);

  let tmpKeyStore = this.getKeyStore();

  tmpKeyStore[this.mapping[inputKey]] = true;
  this.setKeyStore(tmpKeyStore);

  //clear the method
  this.waitForKeyPress = function(){};
}

keyboard.prototype.processUnPressKey = function(inputKey){
  let tmpKeyStore = this.getKeyStore();

  tmpKeyStore[this.mapping[inputKey]] = false;
  this.setKeyStore(tmpKeyStore);
}



  /*
    memory                    key
  |1|2|3|C|                |1|2|3|4|
  |4|5|6|D|                |Q|W|E|R|
  |7|8|9|E|                |A|S|D|F|
  |A|0|B|F|                |Z|X|C|V|
               mapping
  */

keyboard.prototype.mapping = {
  1 : 0x1,
  2 : 0x2,
  3 : 0x3,
  4 : 0xC,
  Q : 0x4,
  W : 0x5,
  E : 0x6,
  R : 0xD,
  A : 0x7,
  S : 0x8,
  D : 0x9,
  F : 0xE,
  Z : 0xA,
  X : 0x0,
  C : 0xB,
  V : 0xF
}
