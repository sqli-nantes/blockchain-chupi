var express = require('express');
var fs = require('fs');
var beacon = require('eddystone-beacon');
var localIp = require('my-local-ip')();
var solc = require('solc');
var web3 = require('./utils/web3IPCExtension').web3;
var Q = require('q');
var gpio = require('rpi-gpio');



// params
var compiled, contract;
var source = "";


// Solidity Contract
web3.setProvider(new web3.providers.HttpProvider('http://0.0.0.0:8547'));
var account = web3.eth.accounts[0];

var createdAtBlock = web3.eth.blockNumber;

// listen for created log/event
var Created = web3.eth.filter({
    topics: [null, '0x16bd7d60bc08217d2e78d09658610a9eb6de22df8b587fdca9e980fafc4ecfcc'],
    fromBlock: createdAtBlock,
    toBlock: 'latest'
});

Created.watch(function(error, log) {
    if (!error) {
        console.log('Contract created on ' + log.address);

        contract.address = log.address;

        // remove filter
        Created.stopWatching();

        // watch for the last next 12 blocks if the code is still at the address
        var filter = web3.eth.filter('latest');
        filter.watch(function(e, blockHash) {
            if (!e) {
                var block = web3.eth.getBlock(blockHash);

                // check if contract stille exists, if show error to the user
                if ((block.number - createdAtBlock) < 12 &&
                    web3.eth.getCode(contract.address).length <= 2) {
                    console.log('The contract is gone!');
                } else if (block.number - createdAtBlock > 12) {
                    filter.stopWatching();
                }
            }
        });
    }
});


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


// add two demo nodes (with promise)
function addPeer() {
    var deferred = Q.defer();
    var bool = web3.admin.addPeer("enode://d9b86a2036cb10c0ae7bd299d8218eae27e7006df67208aa375f4341fe1a5610e1616b516c83d849c302a42200e6b3bde688fc39d456668613a5d8345c239d39@10.33.44.155:30301", "enode://4fd325fd92a22ed7ef4cfa40d9645761ff4bac064d31c8a5f22dd3e4684d3e6ba006dc03907de01b4780bb8380b1e148c45a1d196be583f3607d41ede95daddd@10.33.44.155:30302");
    if (bool) {
        deferred.resolve();
    }
    return deferred.promise;
}

// read the contract file et write it inline (with promise)
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

// unlock account for set transaction/new contract instance (with promise)
function unlockAccount() {
    var deferred = Q.defer();
    var bool = web3.personal.unlockAccount(account, 'raspberry', 360);
    if (bool) {
        deferred.resolve();
    }
    return deferred.promise;
}

// create a new contract instance (with promise)
function initContract() {
    console.log('Compiled');
    var deferred = Q.defer();
    for (var contractName in compiled.contracts) {
        console.log('account : ', account);
        contract = web3.eth.contract(JSON.parse(compiled.contracts[contractName].interface)).new('0x16bd7d60bc08217d2e78d09658610a9eb6de22df8b587fdca9e980fafc4ecfcc', {
            from: web3.eth.accounts[0],
            data: '0x' + compiled.contracts[contractName].bytecode,
            gas: 250000
        });
        console.log(contract);
    }
  console.log('Contract OK');
    server();
    deferred.resolve();
    return deferred.promise;
}

// http server on 8080 port
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
        });
        res.end(json);
    });

    app.get('/img', function(req, res) {
        var img = fs.readFileSync('./image/*.jpg')
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
};
