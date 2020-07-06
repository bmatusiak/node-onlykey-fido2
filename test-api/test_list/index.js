module.exports = {
    provides: ["test_list"],
    consumes: ["app"],
    setup: function(options, imports, register) {

        var EventEmitter = require("events").EventEmitter;
        var TESTLIST = new EventEmitter();

        var test_list = [];
        TESTLIST.add = function(item) {
            test_list.push(item);
        };
        TESTLIST.init = function() {

            imports.app.on("start", async function() {
                for(var i in test_list){
                    await test_list[i]();
                }
            });
            
        };

        register(null, {test_list: TESTLIST});
    }
};