var express = require('express');
var fs = require('fs');
var beacon = require('eddystone-beacon');
var localIp = require('my-local-ip')();
var solc = require('solc');

// Eddystone-Url beacon
//beacon.advertiseUrl('http://' + localIp, {name:'choupette', txPowerLevel: -9});

// Solidity Contract
var web3 = require('./utils/web3IPCExtension').web3;
web3.setProvider(new web3.providers.HttpProvider('http://' + localIp + ':8547'));

var lineReader = require('readline').createInterface({
    input: fs.createReadStream('./contract/contract.sol')
});
var source = "";
lineReader.on('line', function(line) {
    source += line;
});

setTimeout(function() {
    var compiled = solc.compile(source, 1);
    web3.personal.unlockAccount(web3.eth.accounts[0], 'raspberry', 60);
    console.log('unlocked account');
    for (var contractName in compiled.contracts) {
        var contract = web3.eth.contract(JSON.parse(compiled.contracts[contractName].interface)).new({
            from: web3.eth.accounts[0],
            data: '0x' + compiled.contracts[contractName].bytecode,
            gas: 250000
        });
        console.log('created contract');
    }

    // Server sur port 8080
    var app = express();

    setTimeout(function() {

        app.get('/', function(req, res) {
            res.writeHead(200, {
                "Content-Type": "application/json"
            });
            // var enodeRPI = "enode://1b833c634d3fafd40743c62433eeae20b4ee1cd42b0be2ce636bc2e7d111739baa3834$
            var contractRPI = {
                abi: contract.abi,
                address: contract.address
            };
            var enode =
                console.log(contractRPI);
            var json = JSON.stringify({
                //    enode: enodeRPI,
                name: "choupette",
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
        })

        app.listen(8080);
    }, 2000);
}, 1000);
