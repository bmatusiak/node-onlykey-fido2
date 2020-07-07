module.exports = {
    consumes: ["app", "console", "window"],
    provides: ["onlykeyApi", "kbpgp", "forge", "nacl" , "pgpDecoder"],
    setup: function(options, imports, register) {

        imports.kbpgp = require('./onlykey/kbpgp-2.1.0.ok.js');
        imports.nacl = require('./onlykey/nacl.min.js');
        imports.forge = require('./onlykey/forge.min.js');
        imports.pgpDecoder = require('./onlykey/pgp-decoder/pgp.decoder.js');
        
        const onlykeyApi = require('./onlykey/onlykey-api.js')(imports);
        const onlykeyPGP = require('./onlykey/onlykey-pgp.js')(imports);
        const onlykey3rd = require('./onlykey/onlykey-3rd-party.js')(imports, onlykeyApi);

        register(null, {
            onlykeyApi: {
                api: onlykeyApi,
                pgp: function(use_virtue) {
                    return onlykeyPGP(onlykeyApi, use_virtue);
                },
                onlykey3rd : onlykey3rd,
            },
            kbpgp:  imports.kbpgp(false,imports.console),
            forge: imports.nacl,
            nacl: imports.forge,
            pgpDecoder:imports.pgpDecoder
        });


    }
};