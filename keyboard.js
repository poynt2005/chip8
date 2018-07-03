function keyboard(){

  /*
    memory                    key
  |1|2|3|C|                |1|2|3|4|
  |4|5|6|D|                |Q|W|E|R|
  |7|8|9|E|                |A|S|D|F|
  |A|0|B|F|                |Z|X|C|V|
               mapping
  */

  /*
    * store pressed key to Array
    * initilize array
  */
  var keystore = new Array(16).fill(false);

  // map key input to memory
  var mapping = {
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

  // when press a key , set the array element which represent the key to true
  function pressKey(e){
    var key = String.fromCharCode(e.which);

    if(key in mapping)
      keystore[mapping[key]] = true;

    window.aKeyPressed = true;
  }

  //when release key set it to false
  function unPressKey(e){
    var key = String.fromCharCode(e.which);

    if(key in mapping)
      keystore[mapping[key]] = false;

    window.aKeyPressed = false;
  }

  window.addEventListener("keydown" , pressKey , false);
  window.addEventListener("keyup" , unPressKey , false);

  this.getKeyStore = function(){
    return keystore;
  }
}
