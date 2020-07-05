var KB_ONLYKEY = {};
var kbpgp = require('./kbpgp-2.1.0.ok.js')(false, console);
var testMessage = "The quick brown fox jumps over the lazy dog";
var keyStore = pgpkeyStore();

var act = loadAct();

if (false) {
  //rsa --  this takes a few seconds 
  kbpgp.KeyManager.generate_rsa({ userid: "alice <user@example.com>" }, function(err, alice) {
    alice.sign({}, function(err) {
      console.log("alice done!");
      alice.export_pgp_private({
        passphrase: 'test'
      }, function(err, pgp_private) {
        if (err) throw err;
        console.log("private key: ", pgp_private);
      });
      alice.export_pgp_public({}, function(err, pgp_public) {
        if (err) throw err;
        console.log("public key: ", pgp_public);
      });
    });

  });
}

if (false) { //bob
  //ecc  -- this will be a bit faster
  kbpgp.KeyManager.generate_ecc({ userid: "bob <user@example.com>" }, function(err, bob) {
    if (err) throw err;
    bob.sign({}, function(err) {
      if (err) throw err;
      console.log("bob done!");
      bob.export_pgp_private({
        passphrase: 'test'
      }, function(err, pgp_private) {
        if (err) throw err;
        console.log("private key: ", pgp_private);
      });
      bob.export_pgp_public({}, function(err, pgp_public) {
        if (err) throw err;
        console.log("public key: ", pgp_public);
      });
      //act.start(bob);
    });
  });
}
else {
  
  /*
  var bobkeySet = require("./bobkey.js");
  act.loadPrivKey(bobkeySet, function(bob) {
    act.loadPubKey(bobkeySet, function(bob_pub) {
      act.start(bob, bob_pub);
    });
  });
  */
  
  var keyStore = pgpkeyStore();
  
  var bobkeySet = require("./bobkey.js");
  
  keyStore.loadPublicSignerID(`-----BEGIN PGP PUBLIC KEY BLOCK-----
Version: Keybase OpenPGP v2.1.0
Comment: https://keybase.io/crypto

xm8EXwH9AhMFK4EEACIDAwRr4Mmr3lNBbVl873OD1cvWGZRinz8CfmL+ONzIi4gY
twZ3n6SDCuj25KZBDI8h77oGVFKZgbvWdRWcOfle6hUhD1gi132AFsR6SWO682iz
0Glp5DJKLUKj6QzNy6O6sbrNFmJvYiA8dXNlckBleGFtcGxlLmNvbT7ClgQTEwoA
HgUCXwH9AgIbAQMLCQcDFQoIAh4BAheAAxYCAQIZAQAKCRCFk2EFHQojsAuwAX41
HSGtRG4htwzMmw1ZbUA3FcRdagx0+X66cL5KbOKGNCEswanpp8Wb2nTDivuQPqUB
fjK9P6wo2RQRPcxUjorOl9+oL5YDfbFnxFswDWtGKl4n9xdq3oOW2vW4w8HSPZU4
Cs5WBF8B/QISCCqGSM49AwEHAgMEiaZc4t8iVMc6kxrpQWSIenCw585yLz2VZCUB
vLCQk0FJmHcDFXtX0nnSCGc675Ma/u0WKMbb4Uv4axbHuRCK7wMBCgnChwQYEwoA
DwUCXwH9AgUJDwmcAAIbDAAKCRCFk2EFHQojsCwMAX9bwgYE6eZywAeSqHNRMi1D
ZjuJhfh+aolM6l596QY4noZKcZAiK7yH+djOTO30J/EBgKrxjRX95Xwnga1thyth
62JXuztJalWpud67vx/Z69ZfAMZTYzO7zOb8mesyaKg5aM5SBF8B/QITCCqGSM49
AwEHAgME0gK5/brlEpbl6DxghfeHDl/T78EQ14iTyXyUnPLHGY2rHLtVfsUWGJSK
hhTB/kiN82hKgQ+d64G9riwHjELxOcLAJwQYEwoADwUCXwH9AgUJDwmcAAIbIgBq
CRCFk2EFHQojsF8gBBkTCgAGBQJfAf0CAAoJED5S1RCSb/5wnnMA/2VNi3jJk5me
xnuP9DDBhdGcuRooC3dgb2D03+Cfbqd9AP0X9N/SMMy0/wH/4QDnmu23kqjvKQdc
WZtRDWGdlRnDc41jAX0e6rY9Pc+8/BTtdqY3o+yfrGkvv1mmecV4DogdH2/JcaTm
DJQsaHhv/dnKbNM9BTEBfihk4RVKTDiM3e0r0ENvt0mclERnR6jGmhv5BJgXRufm
5gBDYHxK8KIQxOIFRrkrvA==
=TgeK
-----END PGP PUBLIC KEY BLOCK-----`);
  
  /*
  act.loadPrivKey(bobkeySet, function(bob) {
    act.loadPubKey(bobkeySet, function(bob_pub) {
      act.start(bob, bob_pub);
    });
  });
  */
}


function loadAct() {
  var act = {};

  act.start = function(key, key_pub) {
    act.sign_message(key, function(message) {
      console.log(message);
      act.decrypt_message(key_pub, message, function(message) {
        console.log(message);
        console.log("message match", testMessage == message);

      });
    });
  };

  act.encrypt_message = function(key, cb) {

    var params = {
      msg: testMessage,
      encrypt_for: [key],
      sign_with: key
    };

    kbpgp.box(params, function(err, result_string, result_buffer) {
      if (err) throw err;
      else {
        cb(result_string);
        // console.log(err, result_string, result_buffer);
      }
    });

  }

  act.sign_message = function(key, cb) {

    var params = {
      msg: testMessage,
      // encrypt_for: [key],
      sign_with: key
    };

    kbpgp.box(params, function(err, result_string, result_buffer) {
      if (err) throw err;
      else {
        cb(result_string);
        // console.log(err, result_string, result_buffer);
      }
    });

  }


  act.decrypt_message = function(key, message, cb) {
    var ring = new kbpgp.keyring.KeyRing;
    var kms = [key];
    var pgp_msg = message;
    // var asp = '/* as in Encryption ... */' ;
    for (var i in kms) {
      ring.add_key_manager(kms[i]);
    }
    kbpgp.unbox({ keyfetch: ring, armored: pgp_msg /*, asp*/ }, function(err, literals) {
      if (err) throw err;
      else {
        // console.log("decrypted message");
        // console.log(literals[0].toString());
        cb(literals[0].toString());
        var km, ds = km = null;
        ds = literals[0].get_data_signer();
        if (ds) { km = ds.get_key_manager(); }
        if (km) {
          console.log("Signed by PGP fingerprint", km.get_pgp_fingerprint().toString('hex'));
        }
      }
    });
  };

  act.loadPrivKey = function(keySet, cb) {


    kbpgp.KeyManager.import_from_armored_pgp({
      armored: keySet.PrivKey
    }, (err, sender) => {
      if (err) {
        // onlykey_api_pgp.emit("error", err);
        if (err) throw err;
        return;
      }

      if (sender.is_pgp_locked()) {
        let passphrase = keySet.PrivKeyPW;

        sender.unlock_pgp({
          passphrase: passphrase
        }, err => {
          if (!err) {
            // console.log(`Loaded test private key using passphrase '${passphrase}'`);
            keyStore.ring.add_key_manager(sender);
            cb(sender);
          }
          else {
            if (err) throw err;
          }
        });
      }
      else {
        // console.log("Loaded test private key w/o passphrase");
        cb(sender);
      }
    });
  }

  act.loadPubKey = function(keySet, cb) {


    kbpgp.KeyManager.import_from_armored_pgp({
      armored: keySet.PubKey
    }, (err, sender) => {
      if (err) {
        // onlykey_api_pgp.emit("error", err);
        if (err) throw err;
        return;
      }

      if (sender.is_pgp_locked()) {
        let passphrase = keySet.PrivKeyPW;

        sender.unlock_pgp({
          passphrase: passphrase
        }, err => {
          if (!err) {
            // console.log(`Loaded test private key using passphrase '${passphrase}'`);
            keyStore.ring.add_key_manager(sender);
            cb(sender);
          }
          else {
            if (err) throw err;
          }
        });
      }
      else {
        // console.log("Loaded test private key w/o passphrase");
        cb(sender);
      }
    });
  }

  return act;
}

function pgpkeyStore() {
  var keyStore = {};

  keyStore.ring = new kbpgp.keyring.KeyRing();

  keyStore.loadPublic = function loadPublic(key) {
    return new Promise(async function(resolve) {
      // onlykey_api_pgp.emit("status", "Checking recipient's public key...");
      if (key == "") {
        // onlykey_api_pgp.emit("error", "I need recipient's public pgp key :(");
        return;
      }

      kbpgp.KeyManager.import_from_armored_pgp({
        armored: key
      }, (error, recipient) => {
        if (error) {
          // onlykey_api_pgp.emit("error", error);
          return;
        }
        else {
          resolve(recipient);
          keyStore.ring.add_key_manager(recipient);
        }
      });
    });
  };

  keyStore.loadPublicSignerID = function loadPublicSignerID(key) {

    return new Promise(async function(resolve) {
      // onlykey_api_pgp.emit("status", "Checking sender's public key...");
      if (key == "") {
        // onlykey_api_pgp.emit("error", "I need sender's public pgp key :(");
        return;
      }
      kbpgp.KeyManager.import_from_armored_pgp({
        armored: key
      }, (error, sender) => {
        if (error) {
          // onlykey_api_pgp.emit("error", error);
          return;
        }
        else {
          
          var better_way_i_thinks_is = sender.find_verifying_pgp_key();//a better way to get 
          
          var subkey;
          var keyids = sender.get_all_pgp_key_ids();
          
          
          if (typeof keyids[2] !== "undefined") {
            // onlykey_api_pgp.poll_delay = 1; //Assuming RSA 2048
            subkey = 2;
          }
          else {
            // onlykey_api_pgp.poll_delay = 8; //Assuming RSA 4096 or 3072
            subkey = 0;
          }
          KB_ONLYKEY.custom_keyid = keyids[subkey].toString('hex').toUpperCase();
          KB_ONLYKEY.custom_keyid = KB_ONLYKEY.custom_keyid.match(/.{2}/g).map(hexStrToDec);
          console.info("KB_ONLYKEY.custom_keyid" + KB_ONLYKEY.custom_keyid);
          resolve(KB_ONLYKEY.custom_keyid);
          
          //return require("./test/get_signer_keyid.js")(sender,KB_ONLYKEY,subkey);
        }
      });
    });
  };

  keyStore.loadPrivate = function loadPrivate() {
    return new Promise(async function(resolve) {
      kbpgp.KeyManager.import_from_armored_pgp({
        armored: test_pgp_key()
      }, (err, sender) => {
        if (err) {
          // onlykey_api_pgp.emit("error", err);
          return;
        }

        if (sender.is_pgp_locked()) {
          let passphrase = 'test123';

          sender.unlock_pgp({
            passphrase: passphrase
          }, err => {
            if (!err) {
              //console.log(`Loaded test private key using passphrase ${passphrase}`);
              keyStore.ring.add_key_manager(sender);
              resolve(sender);
            }
          });
        }
        else {
          //console.log("Loaded test private key w/o passphrase");
          resolve(sender);
        }
      });
    });
  };

  return keyStore;
};

function test_pgp_key() {
  //this is public public key for the private key block that is returned
  //displayed for diagnostics purposes
  /*
  -----BEGIN PGP PUBLIC KEY BLOCK-----
  Version: Keybase OpenPGP v2.1.0
  Comment: https://keybase.io/crypto

  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
  T93J2CvJFKBr3QFlPST+
  =73ob
  -----END PGP PUBLIC KEY BLOCK-----
  */
  //PRIVATE KEY BLOCK pw `test123`
  return `-----BEGIN PGP PRIVATE KEY BLOCK-----
Version: TEST KEY v1.0.0
Comment: THIS KEY IS JUST A PLACEHOLDER

xcaGBFms0QoBEAC9hQ0tnhwnSYlLQmVTsvVWyYnnS8woQnLLr0gz9gb2ZSxE
gh7SMQewx5xff7zsxhcRoID00tarP4KueEOx2sPwFFgbK5jhN1UDEA0zG3oA
/bkEet6c7Q4Y25wlp0eYRpW2KIEdVH9uzNyUS7S5Phw8QtvxWLI+rudmhrNk
Pvjm4c7kPT1TpfCYDMQmF7RVSaXYDH6vE/gqLKjiD/71LQZmQzDtLkvC2fh4
frBhdZUVHmIuZaDZ/8QtcslODovqAe6stBtCsgZ1lEx8otbTpt88PIYbPNGi
kiHrbjK3CYusoq1Rl4/LN/jFkJnO9J8KpfA5R+lnQ6GfzacQ3BfpkQ7Ib2Tu
NSwHOe5nSGIpbsujWh6GAmRzo+AOHmbUj6gbuaA8qIdD+VDXNh/O4g26be+l
RO12pz6VOCk2W+Gmvwmbk789atmNOIk0eUeJ/jPFyXVqM5DMfHuBssydqQr8
9EoQo+id2ev8glfmx1kT7oiN5d/WCpEq4SSxf7TxNawqIEK5LAgv6dONd8e0
GsTxibRVxqrTDc8q07dIgXU4nybCBHRrcd1gj785uJcSsuSSB5TnRRmcst+q
BsunUZbM8iw9g8OUqZj2k70utgIaP5kIIFhMgne9iLYd/g47pMLdoAWcQXdL
pwcHfB3jF8ukuQCpHg1FaKP8oU1jO6Yrk9FHwwARAQAB/gkDCHD+rb/6JEKx
YOw4tTZ1yyHEQRjSoFuwx2vsi1T96TTF4JlTvncVkaFsbvYrTdybEUjc8e6a
UuKDZoMKzr3VBJXbXXhtZLZlWhd+LWN4bFixn9wifoGHN9ptNzobMo3dibjA
cMkNB6ocxWrlbvq44WNYXPezFIloSzf6vb2puZjVcd1nJSLxHY5HaykTdqwi
2TCQhOTa3EBwlQpNNgUdetA3erf22r+FesfYSVjUt8bO6b7jwaXHUAg0RU9D
SCLPCrAqz4WY9RUxziMiUY531LeKffpALwoA8Qwt9F4i03ecrBw7XKbHvL9O
KRcg+3HUNxT9+3P3v4r3Vyqa80g2iYfiA/yd5f6wKWiYbuhaHiHnFljnPqjr
ufSB1hWJoQVfK7Lau/PIZQqZ3vpo3xQJkG7QyYF5hM5ZKlFd9vqxUQhn2mI4
zC1aOhg/CDLvatspb2J9JxH457YxWsXK4garUl0g6EYTdSZRalLfQ1EHpvzM
jSwwFN8d+UgaqO/X/I3G4oHfnaNRY4YdpIpAZZ1JvKS7v2O/r5ct46bVKQUg
TKffG+4QI/g9sizhmBzOTFWO2i8wdu5gvVxvl7dnPrgxyPBlZK9lryBW2++l
YsjQ41TxPmdzZGfzE3MPvQZ+Sni5QXA3icKDWzEcp8Zd8KukVyvKnVJiMM5F
mpvtcQbhnphpiFFt9aEPO1soid02lNG3qlO97EpS1KExZOW95hF9u2F2q9p/
0BTcahyxjoE1oinakjg/BEqcF8TgaEmpTtDYoljz87vpRyEHKAOl3IXyiubB
WMyZfraF6hZ3mRGKofOX8A7hdqFx1j/6myzywf1JsRSa6u8Dp4m38mDKKhcf
ERqDcVWuJafZBWOXPcdxIVBDmopTn7uM8Ii0wEYWBFqgf6dN2p6BprDcm2Om
qiqhDE3UoqjQXgHqh7Bn8AjpfqSkXFRsrkOhcbyqzYGt+kEbnFPFP1QhyWSj
60p7eMxW7bG6rJcyOWvq5GZaaVime3+sXTV37vYzuNWc0RQ3FklKbiLvVCjL
NHbWOUtQpHE/i39UUK31/Rncqzgoenn6ThqXZZZl+LP8FFIOZ80VnlSxM71U
d7XRqk1wjFE7NBzbtTypaDXbm3Wilq9SJ68kfOxZUC9asAvU5B1teiVshFA2
QmMTCz0hng8/HldlntUOVQjmh/gC5E52cva6QF0Cu8JKfVGoAC5wEIuV3gVx
Zu+IVEtHWpCA8bOudtYx4QZvKVCbjSaK6Rf1UE+cUfLESCnXt9BHzcPq0q90
WVMXNVSS0CQ84FCk3zAZgnrZBmOFuiXvXXqrpS8w2k8LFiP5or4ZCYTc0qUp
pSFk8QBnfdX63IXifBQtuaD1Iz49Lf2Vpfxv+F/qXaPQ6Bl3bfv1QY9nNh48
+OVZBpnMas8W4co/Ke7GiOJKqScpcW/MlaKZVLR2ywthC4vpTjFBiK3epLOF
J63bR/0TV5Koj62CdyVENtecbfWce5yx9s5AAdKDoA3Q18mMm13OJb868Nu0
O2ZlAXb/3PMWp8zS6zd6gP8Aw8q1a+NlZVtyFA7aaBEQyRbHMG/Qeyy6wmlE
nP/rfuWVuPLmSD7GsS6TkofmLsk/fuWbuAFBnYuoWM+XrRwWX0SOmZJzYELV
shnhPaTO+71B4vsCbuQVfNcMYBmpt7iAG23Ky1FNnKy8jszwq4S2XPRukT0+
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
=ayNx
-----END PGP PRIVATE KEY BLOCK-----`;
};

function hexStrToDec(hexStr) {
  return ~~(new Number('0x' + hexStr).toString(10));
};