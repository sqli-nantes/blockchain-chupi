contract RentCar {
    uint public state;
    struct User {
        address addr;
        bool valid;
    }
    User public user;
    User public car;
    uint rate;
    uint price;
    uint overpayment;
    bool public validatedPaymt;

    struct Position{
        uint x;
        uint y;
    }
    Position pos;

    event OnStateChanged(uint state);
    event OnCreated(bytes32 indexed identifier);

    function RentCar(bytes32 identifier) {
        overpayment = 0;
        validatedPaymt = false;
        rate = 200000000000000000;
        car.addr = msg.sender;
        user.valid = false;
        car.valid = false;
        SetState(0);
        OnCreated(identifier);
    }

    modifier onlyUsers {
        if (msg.sender == user.addr || msg.sender == car.addr){
            _;
        } else {
            throw;
	}
    }

    function RentMe() {
        user.addr = msg.sender;
        SetState(1);
    }

    function GetBalance(address addr) returns (uint){
        return addr.balance;
    }

    function GoTo(uint X, uint Y) {
        pos.x = X;
        pos.y = Y;
        price = (pos.x + pos.y) * rate;
	if (user.addr.balance < price) {
            throw;
        }
    }

    function GetPrice() returns (uint){
        return price;
    }

    function StopRent() onlyUsers() {
        SetState(0);
    }

    function SetState(uint s) private {
        state = s;
        OnStateChanged(state);
    }

    function StartRent() payable {
	validatedPaymt = true;
	SetState(2);
    }


    function ValidateTravel() payable onlyUsers() {
      if  (msg.sender == user.addr && user.valid == false)
          user.valid = true;
      if  (msg.sender == car.addr && car.valid == false) {
          car.valid = true;
          SetState(3);
      }
      if  (user.valid == true && car.valid == true) {
          user.valid = false;
          car.valid = false;
	  car.addr.send(price);
          StopRent();
      }
    }

}
