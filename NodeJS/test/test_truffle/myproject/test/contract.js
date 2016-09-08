contract('Contract testing', function(accounts) {
    it("test RendMe", function(done) {
        var contract = Contract.deployed();
        var watch;
        contract.RentMe({
            from: accounts[0]
        });
        watch = contract.OnStateChanged().watch(function(error, result) {
            if (!error) {
                contract.user().then(function(user) {
                    assert.equal(user[0], accounts[0], 'L adresse de User du contrat ne correspond pas au compte principe du noeud');
                    assert.equal(result.args.state.c[0], 1, 'Le status envoyé par l evenement ne correspond pas');
                    watch.stopWatching();
                    done();
                });
            }
        })
    });
    it("test GoTo", function(done) {
        var contract = Contract.deployed();
        var x = 1;
        var y = 5;
        var rate = 200000;
        var price = (x + y) * rate;
        var filter;

        contract.GoTo(x, y, {
            from: accounts[0]
        }).then(function(txhash) {
            assert(txhash > 2, "probleme transaction")
            done();

            /*  filter = web3.eth.filter('latest');
              console.log("test2");
              filter.watch(function(error, result) {
                  console.log('3');
                  var receipt = web3.eth.getTransactionReceipt(txhash);
                  console.log(receipt);
                  if (receipt && receipt.transactionHash == txhash) {
                      console.log('4');
                      filter.stopWatching();
                      contract.GetPrice.call().then(function(p) {
                          console.log('retour price GoTo', p.c[0]);
                          assert.equal(p.c[0], price, 'probleme retour prix');
                      }).then(done).catch(done);
                  }
              }) */

        }).catch(done);
    });

    it("test GetPrice", function(done) {
        var contract = Contract.deployed();
        contract.GetPrice.call().then(function(p) {
            assert.equal(p.c[0], 0, 'probleme retour prix');
        }).then(done).catch(done);

    });

    it("test StopRent", function(done) {
        var contract = Contract.deployed();
        var price = (1 + 5) * 200000;
        var watch;
        contract.StopRent({
            from: accounts[0]
        });
        watch = contract.OnStateChanged().watch(function(error, result) {
            if (!error) {
                assert.equal(result.args.state.c[0], 0, 'Le status envoyé par l evenement ne correspond pas');
                watch.stopWatching();
                done();
            }
        });
    })

})
