contract SatisfactionClient {
/* Hash de "service après ventes " */
bytes32 constant SUJET = 0x428dddc2ccc007e2a6251a8e2d9ff928061f5fc5f475a9a4e3a6d9ba8ddf4807;
uint constant SEUILFAIBLE = 40;
uint constant SEUILFORT = 80;
string constant FAIBLE = "FAIBLE";
string constant MOYEN = "MOYEN";
string constant FORT = "FORT";
uint nbClients = 0;
uint satisfaction = 0;
mapping(address => bool) aSoumis;
function soumettreSatisfaction(uint s){
if( aSoumis[msg.sender] || s<0 || s>100 ) throw;
aSoumis[msg.sender] = true;
satisfaction += s;
nbClients += 1;
}
function satisfactionProduit() returns (uint256,string){
uint256 taux = satisfaction/nbClients;
if( taux < SEUILFAIBLE ) return (taux,FAIBLE);
if( taux >= SEUILFORT )
return (taux,FORT);
else return (taux,MOYEN);
}
}
