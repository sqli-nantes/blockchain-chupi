# ChuPi

This directory contains a complete demo of a decentralized car rent with the blockchain.
In order to simulate a vehicle (CHOUPETTE), a Raspberry PI 3 is used and a color LED indicate the vehicle state.

Here is the scenario :

1. CHOUPETTE is waiting for customers. It indicates its "available" mode (**GREEN** LED color) and diffuses its identity.
2. JIM approaches CHOUPETTE, "scan" around him, and discover CHOUPETTE identity and its state. JIM decides to rent CHOUPETTE.
3. CHOUPETTE update its state to *"customer interaction"* (**ORANGE** LED color). CHOUPETTE is asking for the destination.
4. JIM enter the coordinates of his destination, and sends them to CHOUPETTE.
5. CHOUPETTE compute the price of the ride and send it to JIM.
6. JIM decides to pay and sends the money to CHOUPETTE.
7. When the money is received, CHOUPETTE update its state to *unavailable* (**ROUGE** LED color).
8. Reaching the destination, JIM confirms the location is correct then waits for CHOUPETTE to confirm also.
9. CHOUPETTE confirms the location set on the contract then update to *available* (**VERTE** LED color).

## Architecture
### CHOUPETTE

CHOUPETTE is made from 2 parts:

* An Ethereum client for the communication with the network, in order to interact with the contract and synchronize with the blockchain,
* An HTTP server, exposing the service informations :
    * the *smart-contract* interface
    * the *smart-contract* address
    * some side-informations (manufacturer, last maintenance, energy,...)

#### Ports et adresses (temp)
* IP: **10.33.44.164**
* port geth : **30301**
* port rpc geth : **8547**
* port server HTTP : **8080**

#### Connection to Choupette (SSH)
* id **ssh pi@10.33.44.164**
* mdp **raspberry**



### JIM simulation

JIM is made from 3 parts :

* A geth client identical to CHOUPETTE, simulating the mineur too *(The miner could be in on any node)*.
* A HTTP server exposing a REST API communicating between Javascript application and Ethereum client.
* A Javascript app running on the web browser.

#### Ports et adresses (temp)
* IP: **10.33.44.XXX**
* port geth : **30301**
* port rpc geth : **8547**
* port server HTTP : **8088**


## Organisation du contenu

* ***geth/*** contains the files used when launching the Ethereum client (genesis, init commands,...).
* ***nodejs/*** contains the HTTP server files of CHOUPETTE
* ***demo/*** contains the HTTP server files of JIM Simulation and its Javascript app

## Scenario flow

### 1 - Start the Ethereum client of JIM (PC)

```
cd geth

geth --datadir data/ --networkid "0x64" init genesis.json

geth --datadir data/ --networkid "0x64" --port "30301" --rpc --rpcaddr "0.0.0.0" --rpcport "8547" --rpcapi "admin,eth,net,web3,personal" --rpccorsdomain "*" console

[...]
> admin.nodeInfo.enode #save this information

> personal.newAccount("toto");
> miner.start();admin.sleepBlocks(10);miner.stop()
> personal.unlockAccount(eth.coinbase,"toto")
> eth.sendTransaction({from:eth.coinbase,to:"LeCompteEnodeDeChoupette",value:web3.toWei(10,"ether")})

> while(true){miner.start();admin.sleepBlocks(3);miner.stop();admin.sleep(10);}

```

### 2 - Start Ethereum client of Choupette (Raspberry PI)

```
cd ~/geth

./geth-1.4.5-stable-a269a71-linux-arm-7 --datadir ./node/ --networkid "0x64" init genesis.json

./geth-1.4.5-stable-a269a71-linux-arm-7 --datadir ./node --networkid "0x64" --port "30301" --rpc --rpcaddr "0.0.0.0" --rpcport "8547" --rpcapi "admin,eth,miner,net,web3,personal" --rpccorsdomain "*" --fast --lightkdf console

[...]
> personal.newAccount("toto");
> eth.accounts

> admin.addPeer(" enter here the previously saved information and replace [::] with JIM IP ")
```

### 3 - Start Chupi server (Raspberry PI)

```
cd ~/nodejs

npm install

npm start

[...WAIT...]
server OK
```
### 4 - Start JIM Application (PC)

```
cd demo/API

npm install

npm start

[...WAIT...]
serverOK

```

Then open demo/demo.html in an web browser


## TODO LIST

* Resolve synchronisation issues in Geth RPI ( branches/ speed of synchronization )
* Externalize serverRPI.js configuration in a file

