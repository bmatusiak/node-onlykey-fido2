module.exports = {
    provides: ["test_onlykey"],
    consumes: ["app", "test_list", "onlykeyApi", "window"],
    setup: function(options, imports, register) {

        var EventEmitter = require("events").EventEmitter;

        register(null, {
            test_onlykey: {
                init:function(){
                    var c = require("./connect.js");
                    imports.test_list.add(c.bind({},imports));
                    // imports.test_list.add(/*new Promise()*/);
                }
            }
        });
    }
}