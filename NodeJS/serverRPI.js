var express = require('express');
var fs = require('fs');
var beacon = require('eddystone-beacon');
var localIp = require('my-local-ip')();
var solc = require('solc');
var web3 = require('./utils/web3IPCExtension').web3;
var Q = require('q');
var gpio = require('rpi-gpio');



// params
var compiled, contract, prom;
var source = "";


// Solidity Contract
web3.setProvider(new web3.providers.HttpProvider('http://0.0.0.0:8547'));
addPeer().then(function() {
    console.log('addPeer OK');
    readSource().then(function() {
        console.log('Source OK');
        unlockAccount().then(function() {
            console.log('Unlocked');
            compiled = solc.compile(source, 1);
            compiled.then(initContract());
        })
    })
})

function addPeer() {
    var deferred = Q.defer();
    var bool = web3.admin.addPeer("enode://d9b86a2036cb10c0ae7bd299d8218eae27e7006df67208aa375f4341fe1a5610e1616b516c83d849c302a42200e6b3bde688fc39d456668613a5d8345c239d39@10.33.44.57:30301","enode://4fd325fd92a22ed7ef4cfa40d9645761ff4bac064d31c8a5f22dd3e4684d3e6ba006dc03907de01b4780bb8380b1e148c45a1d196be583f3607d41ede95daddd@10.33.44.57:30302");
    if (bool) {
        deferred.resolve();
    }
    return deferred.promise;
}

function readSource() {
    var deferred = Q.defer();
    var lineReader = require('readline').createInterface({
        input: fs.createReadStream('./contract/contract.sol')
    });
    lineReader.on('line', function(line) {
        source += line;
    });
    lineReader.on('close', function() {
        deferred.resolve();
    });
    return deferred.promise;
}

function unlockAccount() {
    var deferred = Q.defer();
    var bool = web3.personal.unlockAccount(web3.eth.accounts[0], 'raspberry', 360);
    if (bool) {
        deferred.resolve();
    }
    return deferred.promise;
}

function initContract() {
    console.log('Compiled');
    var deferred = Q.defer();
    for (var contractName in compiled.contracts) {
        contract = web3.eth.contract(JSON.parse(compiled.contracts[contractName].interface)).new({
            from: web3.eth.accounts[0],
            data: '0x' + compiled.contracts[contractName].bytecode,
            gas: 250000
        });
    }
    console.log('Contract OK');
    server();
    deferred.resolve();
    return deferred.promise;
}

function server() {
    console.log('server OK');
    // Server sur port 8080
    var app = express();
    app.get('/', function(req, res) {
        res.writeHead(200, {
            "Content-Type": "application/json"
        });
        contractRPI = {
            abi: contract.abi,
            address: contract.address
        };
        json = JSON.stringify({
            name: "choupette",
            manufacturer: "Volkswagen",
            model: "Coccinelle",
            contract: contractRPI
        })
        res.end(json);
    });

    app.get('/img', function(req, res) {
        var img = fs.readFileSync('./image/coccinelle-disney.jpg')
        res.writeHead(200, {
            "Content-Type": "image/jpeg"
        });
        res.end(img);
    });

    app.use(function(req, res, next) {
        res.setHeader('Content-Type', 'text/plain');
        res.status(404).send('Page introuvable')
    });

    app.listen(8080);

    app.on('connection', function() {
        console.log('Availabled server');
    });

    // Watch events & gpio
    // pin 11, 13, 15 : blue, green, red
    gpio.setup(11, gpio.DIR_OUT);
    gpio.setup(13, gpio.DIR_OUT);
    gpio.setup(15, gpio.DIR_OUT);

    var cont = web3.eth.contract(contract.abi).at(contract.address);
    cont.StateChanged().watch(function(error, result) {
        switch (result.args.state.c[0]) {
            case 0:
                console.log('vert');
                gpio.output(11, false);
                gpio.output(13, true);
                gpio.output(15, false);
                break;
            case 1:
                console.log('orange');
                gpio.output(11, false);
                gpio.output(13, true);
                gpio.output(15, true);
                break;
            case 2:
                console.log('rouge');
                gpio.output(11, false);
                gpio.output(13, false);
                gpio.output(15, true);
                break;
        }
    })
};

// Eddystone-Url beacon
beacon.advertiseUrl('http://' + localIp, {
    name: 'choupette',
    txPowerLevel: -9
});
console.log('Beacon enabled');
