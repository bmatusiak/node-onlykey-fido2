const hid = require('node-hid');

bytes2string = function bytes2string(bytes) {
    var ret = Array.from(bytes).map(function chr(c) {
      return String.fromCharCode(c);
    }).join('');
    return ret;
  };


wait = ms => new Promise(resolve => setTimeout(resolve, ms));

var hids = hid.devices();

// console.log(hids)

var hidDev = new hid.HID(hids[3].path)

hidDev.getDeviceInfo()
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