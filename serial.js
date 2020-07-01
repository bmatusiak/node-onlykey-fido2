const hid = require('node-hid');

bytes2string = function bytes2string(bytes) {
    var ret = Array.from(bytes).map(function chr(c) {
      return String.fromCharCode(c);
    }).join('');
    return ret;
  };


wait = ms => new Promise(resolve => setTimeout(resolve, ms));

var hids = hid.devices();

//console.log(hids)

var hidpath = false;

for(var i in hids){
  if(hids[i].product =="ONLYKEY" && hids[i].interface == 3){
    hidpath = hids[i].path;
  }
}


var hidDev = new hid.HID(hidpath);

console.log(hidDev.getDeviceInfo());
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

    


//console.log(bytes2string(hidDev.readSync()));
