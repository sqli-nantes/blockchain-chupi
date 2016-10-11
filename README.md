# blockchain-xXx-RPI

Ce répertoire contient une démonstration complète de la décentralisation d'une location d'un véhicule par la blockchain.
Pour simuler un véhicule (CHOUPETTE), un Raspberry PI 3 est utilisé ainsi qu'une LED de couleur qui indique l'état du véhicule..
Pour simuler l'application du client (JIM), une application web est utilisée.

Voici le scénario :

1. CHOUPETTE se prépare au transport de clients. Elle se met pour cela en mode *disponible* (LED de couleur **VERTE**) et diffuse son identité.
2. JIM s'approche de CHOUPETTE, "scan" le lieu, et découvre l'identité de CHOUPETTE ainsi que son état. Il décide ensuite de louer CHOUPETTE.
3. CHOUPETTE met donc a jour son état en mode *"discussion avec un client"* (LED de couleur **ORANGE**). Elle lui demande son itinéraire.
4. JIM saisit les coordonnées de sa destination, et les transmets à CHOUPETTE.
5. CHOUPETTE calcul le prix de la course et l'envoi à JIM.
6. JIM décide de payer et vire automatiquement l'argent.
7. À la réception du paiement, CHOUPETTE met à jour son état en mode *indisponible* (LED de couleur **ROUGE**).
8. À l'arrivée à destination, JIM confirme qu'il est bien arrivé puis attend la confirmation de CHOUPETTE.
9. CHOUPETTE confirme également qu'elle est arrivée à la destination contractualisée puis passe en *disponible* (LED de couleur **VERTE**).

## Architecture
### CHOUPETTE

CHOUPETTE est composée de 2 parties :

* Un client Ethereum (Geth) qui permet de communiquer avec le réseau, et d'intéragir avec les contrats et de synchroniser la blockchain,
* Un serveur HTTP, qui permet d'exposer les informations relatives au service :
    * l'interface du *smart-contract*
    * l'adresse du *smart-contract*
    * des informations complémentaires pour l'évolution (constructeur, maintenance, énergie,...)

#### Ports et adresses (temp)
* IP: **10.33.44.182**
* port réseau geth : **30301**
* port rpc geth : **8547**
* port serveur HTTP : **8080**

#### Connection à Choupette (SSH)
* id **ssh pi@10.33.44.182**
* mdp **raspberry**

### JIM

JIM comporte 3 parties :

* Un client Ethereum (GETH) identique à celui de CHOUPETTE, mais qui en plus sert de mineur dans le réseau *(Le mineur pourrait être n'importe quel autre noeud)*.
* Un serveur HTTP qui expose du API REST pour communiquer entre l'application javascript et le client Ethereum.
* L'application Javascript qui s'exécute dans le navigateur.

#### Ports et adresses (temp)
* IP: **10.33.44.XXX**
* port réseau geth : **30301**
* port rpc geth : **8547**
* port serveur HTTP : **8088**


## Organisation du contenu

* ***geth/*** comporte les fichiers utiles à la mise en route du client Ethereum (genesis, commandes d'init,...).
* ***nodejs/*** comporte les fichiers du serveur HTTP de CHOUPETTE
* ***demo/*** comporte les fichiers du serveur HTTP de JIM et son application Javascript.

## Lancement du scénario

### 1 - Lancer le client Ethereum de JIM (PC)

```
cd geth

geth --datadir data/ --networkid "0x64" init genesis.json

geth --datadir data/ --networkid "0x64" --port "30301" --rpc --rpcaddr "0.0.0.0" --rpcport "8547" --rpcapi "admin,eth,net,web3,personal" --rpccorsdomain "*" console

[...]
> admin.nodeInfo.enode #Conserver cette valeur pour la suite

> personal.newAccount("toto");
> miner.start();admin.sleepBlocks(10);miner.stop()
> personal.unlockAccount(eth.coinbase,"toto")
> eth.sendTransaction({from:eth.coinbase,to:"LeCompteEnodeDeChoupette",value:web3.toWei(10,"ether")})

> while(true){miner.start();admin.sleepBlocks(3);miner.stop();admin.sleep(10);}

```

### 2 - Lancer le client Ethereum de Choupette (Raspberry PI)

```
cd ~/geth

./geth-1.5.0-unstable-599e3c7-linux-arm-7 --datadir ./node/ --networkid "0x64" init genesis.json

./geth-1.5.0-unstable-599e3c7-linux-arm-7 --datadir ./node --networkid "0x64" --port "30301" --rpc --rpcaddr "0.0.0.0" --rpcport "8547" --rpcapi "admin,eth,miner,net,web3,personal" --rpccorsdomain "*" console

[...]
> personal.newAccount("toto");
> eth.accounts

> admin.addPeer(" saisir ici la valeur conservée précédemment et remplacer [::] par l'IP de JIM ")
```

### 3 - Lancer le script de déploiement du contrat et d'exposition d'informations (Raspberry PI)

```
cd ~/nodejs

npm install

npm start

[...WAIT...]
serverOK
```
### 4 - Lancer l'application de JIM (PC)

```
cd demo/API

npm install

npm start

[...WAIT...]
serverOK

```
Enfin, ouvrir le fichier demo/demo.html dans un navigateur


## TODO LIST

* Résoudre le problème de synchronisation du client Geth du RPI
* Externaliser la configuration du serverRPI.js dans un fichier


