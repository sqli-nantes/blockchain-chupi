var express = require('express');
var web3 = require('./utils/web3IPCExtension').web3;
var Q = require('q');
var http = require('http');
var Promise = require('promise');



// params
var compiled, contract;


// Solidity Contract
web3.setProvider(new web3.providers.HttpProvider('http://0.0.0.0:8547'));
var account = web3.eth.accounts[0];

var optionsHttp = {
    host: "10.33.44.182",
    port: 8080,
};
var data;
http.get(optionsHttp, function(resp) {
    resp.on('data', function(chunk) {
        data = JSON.parse(chunk);
    })
})

// http server on 8080 port
console.log('server OK');
// Server sur port 8080
var app = express();
app.use(function(request, response, next) {
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/scan', function(req, res) {
    res.writeHead(200, {
        "Content-Type": "application/json"
    });
    res.end(JSON.stringify(data));
});

app.get('/louer', function(req, res) {
    var cont = req.query.contract;
    //  contract = joinContract(cont.abi, cont.address);
    contract = web3.eth.contract(JSON.parse(cont).abi).at(JSON.parse(cont).address);
    web3.personal.unlockAccount(account, 'noeud2', 360);
    Promise.denodeify(contract.RentMe.sendTransaction)({
        from: account
    }).then(function() {
        console.log("Contract lié.");

    });
    res.writeHead(200, {
        "Content-Type": "application/json"
    });
    res.end();
});


app.get('/goto', function(req, res) {
    var x = req.query.x;
    var y = req.query.y;
    goTo = contract.GoTo.sendTransaction(x, y, {
        from: account
    });
    var price = contract.GetPrice.call();
    res.writeHead(200, {
        "Content-Type": "application/json"
    });
    res.end(JSON.stringify(price));
});

app.get('/goo', function(req, res) {
    var price = req.query.price;
    web3.personal.unlockAccount(account, 'noeud2', 60);
    contract.StartRent.sendTransaction({
        from: account,
        value: price
    });
    res.writeHead(200, {
        "Content-Type": "application/json"
    });
    res.end();
});

app.get('/annuler', function(req, res) {
    web3.personal.unlockAccount(account, 'noeud2', 60);
    contract.StopRent.sendTransaction({
        from: account
    });
    res.writeHead(200, {
        "Content-Type": "application/json"
    });
    res.end();
});

app.get('/valide', function(req, res) {
    web3.personal.unlockAccount(account, 'noeud2', 60);
    contract.ValidateTravel.sendTransaction({
        from: account
    });
    res.writeHead(200, {
        "Content-Type": "application/json"
    });
    res.end();
});

app.get('/carvalide', function(req, res) {
    res.writeHead(200, {
        'Connection': 'keep-alive',
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache'
    });

    // Watch events
    contract.OnStateChanged().watch(function(error, result) {
        switch (result.args.state.c[0]) {
            case 0:
                //console.log('vert');
                break;
            case 1:
                //console.log('orange');
                break;
            case 2:
                //console.log('rouge');
                break;
            case 3:
                //console.log('bleu');
                res.write('data: ' + JSON.stringify({
                    msg: "validateByCar"
                }) + '\n\n');
                break;
        }
    })
});

app.listen(8088);



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
    console.log(abi);
    console.log(address);
    cont = web3.eth.contract(abi).at(address);
    console.log("Added contract");
    return cont;
}
