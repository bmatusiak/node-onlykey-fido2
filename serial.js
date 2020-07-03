const nodeHID = require('node-hid');

bytes2string = function bytes2string(bytes) {
    var ret = Array.from(bytes).map(function chr(c) {
      return String.fromCharCode(c);
    }).join('');
    return ret;
  };


wait = ms => new Promise(resolve => setTimeout(resolve, ms));

//console.log(hids)

var $hids = {};


/*
0: black
1: red
2: green
3: yellow
4: blue
5: magenta
6: cyan
7: white
*/

var colorRGB = function(c){return '\x1b[38;2;'+c+'m';}

var colorSwatch = {
    "red": "255;0;0",
    "orange": "255;165;0",
    "yellow": "255;255;0",
    "green": "50;205;50",
    "teal": "0;128;128",
    "blue": "0;0;255",
    "purple": "128;0;128",
    "white": "255;255;255",
};
var color = {};
for (var i in colorSwatch){
	color[i] = colorRGB(colorSwatch[i])
}


//process.stdout.write('Hello from '+color.red+'term.js'+color.white+' $ ');

function findInterface(){
	var hids = nodeHID.devices();
	var isDev = 2;//not dev interface
	
	for(var i in hids){
		if(hids[i].product =="ONLYKEY"){
			if(hids[i].interface == 3){
				isDev = 3;
			}
		}
	}
	return isDev;	
}

function findHID(hid_interface){
	var hids = nodeHID.devices();

	if(!$hids[hid_interface])
		$hids[hid_interface] = {}
	
	$hids[hid_interface].finding = true;
	
	if($hids[hid_interface].com){
		$hids[hid_interface].com = false;
		process.stdout.write(color.yellow+"Disconnected onlykey interface "+hid_interface+"\r\n"+color.white)
	}

	for(var i in hids){
		if(hids[i].product =="ONLYKEY"){
			if(hids[i].interface == hid_interface){
				$hids[hid_interface].com = false;
				$hids[hid_interface].device = hids[i];
			}
		}
	}	

	if(!$hids[hid_interface].com && $hids[hid_interface].device){
		try{
			$hids[hid_interface].com = new nodeHID.HID($hids[hid_interface].device.path);
			process.stdout.write(color.yellow+"Connected onlykey interface "+hid_interface+"\r\n"+color.white)
		}catch(e){}
	}
	
	$hids[hid_interface].finding = false;
}


function readHID(hid_interface, $color, addNewLines){
		if(!$hids[hid_interface]) 
			return findHID(hid_interface);
		
		if($hids[hid_interface] && $hids[hid_interface].finding) 
			return;
		
		if($hids[hid_interface] && $hids[hid_interface].com){
			try{
				var bfrstr = bytes2string($hids[hid_interface].com.readSync());
				if(addNewLines){
					process.stdout.write("\r\n")
				}
				process.stdout.write($color);
				process.stdout.write(bfrstr);
				process.stdout.write(color.white);
				if(addNewLines){
					process.stdout.write("\r\n")
				}
			}catch(e){
				//console.log(e)
				findHID(hid_interface);
			}
			return;
		}
		findHID(hid_interface);
}


var looping = false;

setInterval(function(){

	try{
		var $interface = findInterface();
		readHID($interface, $interface == 2 ? color.red : color.white, $interface == 2 ? true : false )
	}catch(e){}
	

/*
	try{
		readHID(2, color.red,true)
	}catch(e){}
*/	
	
//		console.log(e)
//		findHID(3);
	
	/*
	try{
		readHID(2, color.red, true)
	}catch(e){
		findHID(2);
	}
	*/
},1)		
