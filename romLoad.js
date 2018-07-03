function readROM(inputFile){
	this.input = inputFile;
}

readROM.prototype.read = function(){
	var _this = this;
	return new Promise(function(resolve, reject){
		if(!_this.input)
			reject("No file element");
		else if(!_this.input.files)
			reject("Browsers doesn't support files prop");
		else if(!_this.input.files[0])
			reject("You must input a file");
		else{
			var file = _this.input.files[0];
			var fr = new FileReader();
			fr.onload = function(){
				var data = fr.result;
				var buffer = new Uint8Array(data);
				
				resolve(buffer);
			}
			fr.readAsArrayBuffer(_this.input.files[0]);
		}
	});
}