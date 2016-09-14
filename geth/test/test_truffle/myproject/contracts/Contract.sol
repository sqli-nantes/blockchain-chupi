contract Contract {
    /* car's availability state */
     uint state;
     struct User {
         address addr;
         bool valid;
     }
     /* car and renter */
     User public user;
     User public car;
     /* rate (price/distance) to calculate price */
    uint rate;
    uint public price;
    uint overpayment;
    /* good payment flag */
    bool validatedPaymt;

    struct Position{
        uint x;
        uint y;
    }
    /* bytes abi; */
    Position pos;

    /* events on the change of state, and contract creation */
    event OnStateChanged(uint state);
    event OnCreated(bytes32 indexed identifier);

    /* contructor */
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
            _
    }

    /* first step : the user is identified to the car */
    function RentMe() returns (bool sufficient){
        /*if (state != 0)
            throw;*/
        user.addr = msg.sender;
        /* abi = msg.data; */
        SetState(1);
        return true;
    }

    function GetBalance(address addr) returns (uint){
        return addr.balance;
    }

    /* the user is sending the destination coordinates
       calculate price */
    function GoTo(uint X, uint Y) returns (bool){
        pos.x = X;
        pos.y = Y;
        price = (pos.x + pos.y) * rate;
        if (user.addr.balance < price) {
            throw;
        }
        return true;
    }

    /* return price */
    function GetPrice() returns (uint){
        return price;
    }

    /* stop the rent process, return to "1" state */
    function StopRent() onlyUsers() {
        SetState(0);
    }

    function SetState(uint s) private {
        state = s;
        OnStateChanged(state);
    }

    /* the user paies the rent and state becomes "2" */
    function StartRent() onlyUsers() {
        if(msg.value >= price){
            if(msg.value!=price){
             	overpayment = msg.value-price;
                //user.addr.send(overpayment);
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

    /* user and car must validate the travel in order to do other actions
    "3" state = waiting the user validation */
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
