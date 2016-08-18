var Web3 = require('web3');
var web3 = new Web3;

var contract, data, price;
var optionsHttp = {
    host: "10.33.44.182",
    port: 8080
};


$('#scan').on('click', function() {
    $.get(
        "http://localhost:8088/scan",
        function(data) {
            console.log(typeof data.contract.abi);
            console.log(typeof data.contract.address);
            document.getElementById('nomVoiture').innerHTML = data.name;
            document.getElementById('2').style.display = "inline";
            $('#scan').prop('disabled', true);
            contract = data.contract;
        }
    );
})

$('#louer').on('click', function() {
    $.get(
        "http://localhost:8088/louer", {
            contract: JSON.stringify(contract)
        }).done(
        function() {
            document.getElementById('3').style.display = "inline";
            $('#louer').prop('disabled', true);
        }
    );
});

function goto(pos) {
  var xpos = document.pos.Xpos.value;
  var ypos = document.pos.Ypos.value;
      $.get(
          "http://localhost:8088/goto", {
              x: xpos,
              y:ypos
          }).done(
          function(data) {
            document.getElementById('prix').innerHTML = data;
            price = data;
            document.getElementById('4').style.display = "inline";
            console.log(data);
              $('#go').prop('disabled', true);
          }
      );
}

$('#terminer').on('click', function() {
    $.get(
        "http://localhost:8088/goo", {
            price: price
        }).done(
        function() {
          $('.btn').prop('disabled', true);
            document.getElementById('bonvoyage').style.display = "inline";
            $('#fin').prop('disabled', false);

        }
    );
});

$('.annuler').on('click', function() {
    $.get(
        "http://localhost:8088/annuler").done(
        function() {
          $('.btn').prop('disabled', true);
            document.getElementById('aurevoir').style.display = "inline";
        }
    );
});

/*http.get(optionsHttp, function(resp) {
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

                        }, 10000);
                    }, 10000);
                } else {
                    setTimeout(function() {
                        console.log("Solde insuffisant !");
                        contract.StopRent.sendTransaction({
                            from: account
                        });
                        console.log("Au revoir");
                    }, 10000);
                }
            });
            console.log();
        })
    })
})
*/

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

function replace(chaine) {
    while (chaine.indexOf('"') != -1) {
        chaine = chaine.replace('"', '\\8');
    }
    while (chaine.indexOf('8') != -1) {
        chaine = chaine.replace('8', '"');
    }
    while (chaine.indexOf('<br />') != -1) {
        chaine = chaine.replace('<br />', ' ');
    }
    chaine = chaine.replace(/<br\s*[\/]?>/gi, " ");
    return (chaine);
}
