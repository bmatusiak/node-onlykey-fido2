module.exports = function(imports) {
    return new Promise(async function(resolve) {
        console.log("connecting to onlykey")

        imports.onlykeyApi.api.connect(function(connected){
            if(connected)
                console.log("connecting to onlykey")
                
            resolve();
        })
        
    });
};