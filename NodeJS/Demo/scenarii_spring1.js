var http = require('http');
var web3 = require('../utils/web3IPCExtension').web3;
var Q = require('q');
var Promise = require('promise');

web3.setProvider(new web3.providers.HttpProvider('http://0.0.0.0:8547'));

console.log("\"Bonjour, je suis JIM !\"");
console.log("\"Cette voiture se signale comme disponible\"");

var contract;
var account = web3.eth.accounts[0];
var optionsHttp = {
    host: "10.33.44.182",
    port: 8080
};

http.get(optionsHttp, function(resp) {
    resp.on('data', function(chunk) {
        data = JSON.parse(chunk);
        contract = joinContract(data.contract.abi, data.contract.address);
        unlockAccount().then(function() {
            Promise.denodeify(contract.RentMe.sendTransaction)({
                from: account
            }).then(function() {
                console.log("\"Je veux la louer. \"");
                goTo = contract.GoTo.call(9999999999999, 99999999999);
                if (goTo[0] === true) {
                    setTimeout(function() {
                      price = goTo[1].c[0];
                        console.log("ok ! Prix : ", price);
                        contract.StartRent.sendTransaction({
                            from: account,
                            value: price
                        });
                        console.log("Bon voyage !");
                        setTimeout(function() {
                            contract.StopRent.sendTransaction({
                                from: account
                            });
                            console.log("Au revoir");

                        }, 8000);
                    }, 8000);
                } else {
                  setTimeout(function () {
                    console.log("Solde insuffisant !");
                    contract.StopRent.sendTransaction({
                        from: account
                    });
                    console.log("Au revoir");
                  }, 8000);
                }
            });
            console.log();
        })
    })
})

function unlockAccount() {
    var deferred = Q.defer();
    var bool = web3.personal.unlockAccount(account, 'noeud2', 360);
    if (bool) {
        deferred.resolve();
        console.log("unlock account");
    }
    return deferred.promise;
}

function joinContract(abi, address) {
    cont = web3.eth.contract(abi).at(address);
    console.log("Added contract");
    return cont;
}
