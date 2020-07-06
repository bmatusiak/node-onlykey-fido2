module.exports = {
    provides: ["test_onlykey"],
    consumes: ["app", "test_list", "onlykeyApi", "window"],
    setup: function(options, imports, register) {

        var EventEmitter = require("events").EventEmitter;

        register(null, {
            test_onlykey: {
                init: function(){
                    
                    imports.test_list.add(require("./connect.js").bind({},imports));
                    // imports.test_list.add(require("./ecdh.js").bind({},imports));
                    imports.test_list.add(require("./pgp.js").bind({},imports));
                    // imports.test_list.add(/*new Promise()*/);
                }
            }
        });
    }
}