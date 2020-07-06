module.exports = function(imports) {
    return new Promise(async function(resolve) {

        var p2g = imports.onlykeyApi.pgp();


        var testMessage = "The quick brown fox jumps over the lazy dog";


        var rsaKeySet = require("../test_pgp/keys/rsakey.js");
        var ecdhKeySet = require("../test_pgp/keys/ecdhkey.js");

        p2g._$mode("Encrypt and Sign")

        p2g.startEncryption(rsaKeySet.PubKey, rsaKeySet.PubKey, testMessage, false /*file*/ , async function(pgp_armored_message) {
            console.log("ONLYKEYPGP  startEncryption : PASS", pgp_armored_message)
            setTimeout(function() {

                p2g._$mode("Decrypt and Verify")
                p2g.startDecryption(rsaKeySet.PubKey, pgp_armored_message, false, function(pgp_decrypted_message) {
                    if(pgp_decrypted_message == testMessage)
                        console.log("ONLYKEY PGP startDecryption : PASS")
                    else throw new Error("ONLYKEY PGP startDecryption : PASS");
                    resolve()
                });

            }, 1000 )
        });



    });
};