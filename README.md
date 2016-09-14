# blockchain-xXx-RPI
Décentralisation de la location de véhicule par la blockchain - Démo (partie raspberry pi)

La partie RPI nécessite le lancement d'un noeud Geth et d'un JS, déployant le contrat sur la bkc ainsi qu'un serveur permettant à l'appli de récupérer les infos de choupette.

## Organisation et contenu
### geth/
* geth-1.5.0-unstable-cc6170d-linux-arm-7 : *executable geth pour archi ARM*
* genesis.json
* init-bkc.sh
* run-bkc.sh

#### Initialisation de la blockchain
    console : sh init-bkc.sh
    (Penser à créer un compte)

#### Démarrer la blockchain
    console : sh run-bkc.sh

### geth/test/
* test_dapple : http://dapple.readthedocs.io/en/master/

    Nécessite l'installation de dapple :
    **npm install -g dapple**

  * initialiser projet
     * mkdir my-dapp
     * cd my-dapp
     * dapple init

  * lancer les tests
     * dapple test

* test_truffle : http://truffle.readthedocs.io/en/latest/

    Nécessite l'installation de truffle :
    **npm install -g truffle**

  * initialiser projet
     * mkdir myproject
     * cd myproject
     * truffle init

  * lancer les tests
     * truffle test

### nodejs/
JS déployant le contrat sur la bkc et un serveur permettant à l'appli de récupérer les infos de choupette.

    npm start

### demo/
    API node + web pour demo.
    A lancer sur un ordi pour interagir avec le RPI.
    Nécessite noeud geth (port : 8547)
