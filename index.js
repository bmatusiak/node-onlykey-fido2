//debugger;
delete require.cache[__dirname+"/index.js"]; //require("./index.js")

function setTime(){

  var { FIDO2Client } = require("@vincss-public-projects/fido2-client");
  var fido2 = new FIDO2Client();
  var nacl = require("tweetnacl");

  const crypto = require('node-webcrypto-shim')

  const OKCONNECT = 228;

  var message = [255, 255, 255, 255, OKCONNECT]; //Add header and message type
  var currentEpochTime = Math.round(new Date().getTime() / 1000.0).toString(16);
  var timePart = currentEpochTime.match(/.{2}/g).map(hexStrToDec);
  Array.prototype.push.apply(message, timePart);

  var appKey = nacl.box.keyPair();

  Array.prototype.push.apply(message, appKey.publicKey);
  var env = ["N".charCodeAt(0), "L".charCodeAt(0)];
  Array.prototype.push.apply(message, env);

  encryptedkeyHandle = Uint8Array.from(message); // Not encrypted as this is the initial key exchange

  var keyhandle = encode_ctaphid_request_as_keyhandle(OKCONNECT,  2, null, null, encryptedkeyHandle)

  var challenge = Uint8Array.from(crypto.getRandomValues(new Uint8Array(32)));

  var timeout = 6000

  var id = "apps.crp.to"

fido2.getAssertion({
    publicKey:{
      challenge: challenge,
      allowCredentials: [{
        id: keyhandle,
        type: 'public-key',
      }],
      timeout: timeout,
      rpId: id,
      userVerification: 'discouraged',
      extensions: {
        appid: 'https://' + id
      }
    }
  }, "https://apps.crp.to").then((assertion) => {

    //console.log(assertion)
    var response = assertion.response;

    var signature_count = (
    new DataView(toArrayBuffer(Buffer.from(response.authenticatorData.slice(33, 37))))
    ).getUint32(0, false); // get count as 32 bit BE integer


    var signature = new Uint8Array(response.signature);
    var status_code = signature[0];

    var data;

    if (signature.length > 1)
    data = signature.slice(1, signature.length);

    response = data;

    var results = {};

    console.log(ctap_error_codes[status_code])
    results.unlocked = false;    
    if (bytes2string(data.slice(0, 9)) == 'UNLOCKEDv') {
    // Reset shared secret and start over
    // _$status(element_by_id('onlykey_start').value);
    results.unlocked = true;
    }

    results.okPub = response.slice(21, 53);
    // console.info("OnlyKey Public Key: ", okPub);
    results.sharedsec = nacl.box.before(Uint8Array.from(results.okPub), appKey.secretKey);
    // console.info("NACL shared secret: ", onlykey_api.sharedsec);
    results.OKversion = response[19] == 99 ? 'Color' : 'Original';
    results.FWversion = bytes2string(response.slice(8, 20));

    console.log("results",results);

  });
}


function hexStrToDec(hexStr) {
  return ~~(new Number('0x' + hexStr).toString(10));
};

function bytes2string(bytes) {
  var ret = Array.from(bytes).map(function chr(c) {
    return String.fromCharCode(c);
  }).join('');
  return ret;
};

function toArrayBuffer(buf) {
  var ab = new ArrayBuffer(buf.length);
  var view = new Uint8Array(ab);
  for (var i = 0; i < buf.length; ++i) {
    view[i] = buf[i];
  }
  return ab;
}

function encode_ctaphid_request_as_keyhandle(cmd, opt1, opt2, opt3, data) {
  // console.log('REQUEST CMD', cmd);
  // console.log('REQUEST OPT1', opt1);
  // console.log('REQUEST OPT2', opt2);
  // console.log('REQUEST OPT3', opt3);
  // console.log('REQUEST DATA', data);
  //var addr = 0;

  // should we check that `data` is either null or an Uint8Array?
  data = data || new Uint8Array();

  const offset = 10;

  if (offset + data.length > 255) {
    throw new Error("Max size exceeded");
  }

  // `is_extension_request` expects at least 16 bytes of data
  const data_pad = data.length < 16 ? 16 - data.length : 0;
  var array = new Uint8Array(offset + data.length + data_pad);

  array[0] = cmd & 0xff;

  array[1] = opt1 & 0xff;
  array[2] = opt2 & 0xff;
  array[3] = opt3 & 0xff;
  array[4] = 0x8C; // 140
  array[5] = 0x27; //  39
  array[6] = 0x90; // 144
  array[7] = 0xf6; // 246

  array[8] = 0;
  array[9] = data.length & 0xff;

  array.set(data, offset);

  // console.log('FORMATTED REQUEST:', array);
  return array;
}

var ctap_error_codes = {
  0x00: 'CTAP1_SUCCESS',//0
  0x01: 'CTAP1_ERR_INVALID_COMMAND',//1
  0x02: 'CTAP1_ERR_INVALID_PARAMETER',//2
  0x03: 'CTAP1_ERR_INVALID_LENGTH',//3
  0x04: 'CTAP1_ERR_INVALID_SEQ',//4
  0x05: 'CTAP1_ERR_TIMEOUT',//5
  0x06: 'CTAP1_ERR_CHANNEL_BUSY',//6
  0x0A: 'CTAP1_ERR_LOCK_REQUIRED',//10
  0x0B: 'CTAP1_ERR_INVALID_CHANNEL',//11

  0x10: 'CTAP2_ERR_CBOR_PARSING',//16
  0x11: 'CTAP2_ERR_CBOR_UNEXPECTED_TYPE',//17
  0x12: 'CTAP2_ERR_INVALID_CBOR',//18
  0x13: 'CTAP2_ERR_INVALID_CBOR_TYPE',//19
  0x14: 'CTAP2_ERR_MISSING_PARAMETER',//20
  0x15: 'CTAP2_ERR_LIMIT_EXCEEDED',//21
  0x16: 'CTAP2_ERR_UNSUPPORTED_EXTENSION',//22
  0x17: 'CTAP2_ERR_TOO_MANY_ELEMENTS',//23
  0x18: 'CTAP2_ERR_EXTENSION_NOT_SUPPORTED',//24
  0x19: 'CTAP2_ERR_CREDENTIAL_EXCLUDED',//25
  0x20: 'CTAP2_ERR_CREDENTIAL_NOT_VALID',//32
  0x21: 'CTAP2_ERR_PROCESSING',//33
  0x22: 'CTAP2_ERR_INVALID_CREDENTIAL',//34
  0x23: 'CTAP2_ERR_USER_ACTION_PENDING',//35
  0x24: 'CTAP2_ERR_OPERATION_PENDING',//36
  0x25: 'CTAP2_ERR_NO_OPERATIONS',//37
  0x26: 'CTAP2_ERR_UNSUPPORTED_ALGORITHM',//38
  0x27: 'CTAP2_ERR_OPERATION_DENIED',//39
  0x28: 'CTAP2_ERR_KEY_STORE_FULL',//40
  0x29: 'CTAP2_ERR_NOT_BUSY',//41
  0x2A: 'CTAP2_ERR_NO_OPERATION_PENDING',//42
  0x2B: 'CTAP2_ERR_UNSUPPORTED_OPTION',//43
  0x2C: 'CTAP2_ERR_INVALID_OPTION',//44
  0x2D: 'CTAP2_ERR_KEEPALIVE_CANCEL',//45
  0x2E: 'CTAP2_ERR_NO_CREDENTIALS',//46
  0x2F: 'CTAP2_ERR_USER_ACTION_TIMEOUT',//47
  0x30: 'CTAP2_ERR_NOT_ALLOWED',//48
  0x31: 'CTAP2_ERR_PIN_INVALID',//49
  0x32: 'CTAP2_ERR_PIN_BLOCKED',//50
  0x33: 'CTAP2_ERR_PIN_AUTH_INVALID',//51
  0x34: 'CTAP2_ERR_PIN_AUTH_BLOCKED',//52
  0x35: 'CTAP2_ERR_PIN_NOT_SET',//53
  0x36: 'CTAP2_ERR_PIN_REQUIRED',//54
  0x37: 'CTAP2_ERR_PIN_POLICY_VIOLATION',//55
  0x38: 'CTAP2_ERR_PIN_TOKEN_EXPIRED',//56
0x39: 'CTAP2_ERR_REQUEST_TOO_LARGE',//57
};


  
