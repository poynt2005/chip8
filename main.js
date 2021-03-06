$(document).ready(function(){

	window.chipEight = null;

	$("#fileinput").change(async function(){
		var rom = new readROM(document.getElementById("fileinput"));

		try{

			const buffer = await rom.read();

			if(window.chipEight)
				window.chipEight = null;

			chipEight = new chip8(buffer , document.getElementById("canvas"));
			chipEight.init();
		}
		catch(e){
			console.log(e);
		}
	});

	$("#startEmu").click(function(){
		if(!chipEight)
			console.log("還未載入ROM");
		else
			chipEight.startEmulation();

	});

	$("#stopEmu").click(function(){
		if(!chipEight)
			console.log("還未載入ROM");
		else
			chipEight.stopEmulation();
	});
});
