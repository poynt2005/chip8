function createSound(waveType){

  /*
    * MDN api
    * OscillatorNode : https://developer.mozilla.org/zh-TW/docs/Web/API/OscillatorNode
    * AudioContext : https://developer.mozilla.org/en-US/docs/Web/API/AudioContext
    * AudioNode : https://developer.mozilla.org/zh-CN/docs/Web/API/AudioNode
  */

  // create web audio api context
  var audioCtx = new (window.AudioContext || window.webkitAudioContext)();

  // set oscillator node to node to avoid collision
  this.oscillator = null;

  //default type : square oscillator
  this.type = waveType || "square";


  //determine if the sound is start to play
  this.audioStartFlag = false;


  /*
    * We cannot call .start() on the same OscillatorNode or AudioBufferSourceNode more than once.
    * If there is a oscillatorNode created before , we have to delete it , and get a new instance of oscillatorNode
  */
  this.connectCtx = function(){
    this.oscillator = audioCtx.createOscillator();

    /*
      * The destination property of the BaseAudioContext interface
        returns an AudioDestinationNode representing the final destination of all audio in the context.
      * It often represents an actual audio-rendering device such as your device's speakers

      * The connect() method of the AudioNode interface lets you connect one of the node's outputs to a target,
        which may be either another AudioNode (thereby directing the sound data to the specified node) or an AudioParam,
        so that the node's output data is automatically used to change the value of that parameter over time.

      * Source (MDN) : https://developer.mozilla.org/en-US/docs/Web/API/BaseAudioContext/destination
    */
    this.oscillator.connect(audioCtx.destination);
  }


  /*
    * If we want to play sound twice , we have to disable oscillatorNode first
    * disconnect from the AudioNode first , and set oscillatorNode to null
  */
  this.disConnectCtx = function(){
    /*
      * The disconnect() method of the AudioNode interface lets you disconnect one or more nodes from the node on which the method is called.

      * Source (MDN) : https://developer.mozilla.org/en-US/docs/Web/API/AudioNode/connect
    */
    this.oscillator.disconnect();
    this.oscillator = null;
  }
}


createSound.prototype.play = function(){

  // Play Sound only when the oscillatorNode ain't starting
  if(!this.audioStartFlag){

    // get oscillatorNode and connect to AudioNode
    this.connectCtx();
    this.oscillator.start();
    this.audioStartFlag = true;
  }
}

// Stop Sound only when the oscillatorNode  starting
createSound.prototype.stop = function(){
  if(this.audioStartFlag){
    this.oscillator.stop();

    // disconnect audioNode and release the oscillatorNode
    this.disConnectCtx();
    this.audioStartFlag = false;
  }
}
