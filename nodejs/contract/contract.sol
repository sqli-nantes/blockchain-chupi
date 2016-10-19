contract RentCar {
    uint state;
    struct User {
        address addr;
        bool valid;
    }
    User public user;
    User public car;
    uint rate;
    uint price;
    uint overpayment;
    bool validatedPaymt;

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
        rate = 200000;
        car.addr = msg.sender;
        user.valid = false;
        car.valid = false;
        SetState(0);
        OnCreated(identifier);
    }

    modifier onlyUsers {
        if (msg.sender != user.addr && msg.sender != car.addr)
            throw;
            _;
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

    function StartRent() onlyUsers() {
        if(msg.value >= price){
            if(msg.value!=price){
             	overpayment = msg.value-price;
                user.addr.send(overpayment);
            }
            validatedPaymt = true;
            SetState(2);
        }else{
        	validatedPaymt = false;
            throw;
        }
    }


    function check() returns(bytes32){
    	if (validatedPaymt){
    		if(overpayment==0){
     			return 'C est ok';
    		}else{
    			return uintToBytes(overpayment);
    		}
    	}else{
   			return 'Y a pas assez d argent';
    	}
    }

    function uintToBytes(uint v) constant returns (bytes32 ret) {
	    if (v == 0) {
	        ret = '0';
	    }
	    else {
	        while (v > 0) {
	            ret = bytes32(uint(ret) / (2 ** 8));
	            ret |= bytes32(((v % 10) + 48) * 2 ** (8 * 31));
	            v /= 10;
	        }
	    }
	    return ret;
	  }

    function ValidateTravel() onlyUsers() {
      if  (msg.sender == user.addr && user.valid == false)
          user.valid = true;
      if  (msg.sender == car.addr && car.valid == false) {
          car.valid = true;
          SetState(3);
      }
      if  (user.valid == true && car.valid == true) {
          user.valid = false;
          car.valid = false;
          StopRent();
      }
    }

}
