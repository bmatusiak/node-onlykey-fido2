const nodeHID = require('node-hid');

bytes2string = function bytes2string(bytes) {
    var ret = Array.from(bytes).map(function chr(c) {
      return String.fromCharCode(c);
    }).join('');
    return ret;
  };


wait = ms => new Promise(resolve => setTimeout(resolve, ms));

var hids = nodeHID.devices();

//console.log(hids)

var hid = false;

for(var i in hids){
  if(hids[i].product =="ONLYKEY" && hids[i].interface == 3){
    hid = hids[i];
  }
}



if(hid){
	//console.log(hids)
	var hidDev = new nodeHID.HID(hid.path);

	//console.log("SELECTED",hidDev.getDeviceInfo(),hid);
	// hidDev.setNonBlocking(1)
	// hidDev.read(console.log);
	// var out
	// while(true){
	//     hidDev.read
	// }



	setInterval(function(){

		var bfrstr = bytes2string(hidDev.readSync());
		process.stdout.write(bfrstr)
		
	},1)		
}else{
	console.log(hids)
}

//console.log(bytes2string(hidDev.readSync()));
