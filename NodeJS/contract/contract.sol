contract RentCar {
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
    uint price;
    struct Position {
        uint x;
        uint y;
    }
    Position pos;

    /* events on the change of state, and contract creation */
    event OnStateChanged(uint state);
    event OnCreated(bytes32 indexed identifier);

    /* contructor */
    function RentCar(bytes32 identifier) {
        rate = 200000;
        state = 0;
        car.addr = msg.sender;
        user.valid = false;
        car.valid = false;
        OnStateChanged(state);
        OnCreated(identifier);
    }

    /* first step : the user is identified to the car */
    function RentMe() {
        /*if (state != 0)
            throw;*/
        user.addr = msg.sender;
        state = 1;
        OnStateChanged(state);
    }

    function getBalance(address user) returns(uint) {
        return user.balance;
    }

    /* the user is sending the destination coordinates */
    function GoTo(uint X, uint Y) returns(bool, uint) {
        pos.x = X;
        pos.y = Y;
        price = (pos.x + pos.y) * rate;
        if (user.addr.balance > price) {
            return (true, price);
        } else {
            throw;
        }
    }

    /* stop the rent process, return to "1" state */
    function StopRent() {
        if (msg.sender != user.addr && msg.sender != car.addr)
            throw;
        state = 0;
        OnStateChanged(state);
    }

    /* the user paies the rent and state becomes "2" */
    function StartRent() {
        if (msg.sender != user.addr && msg.sender != car.addr)
            throw;
        uint timeNow = now;
        state = 2;
        OnStateChanged(state);
    }

    /* user and car must validate the travel in order to do other actions
    "3" state = waiting the user validation */
    function ValidateTravel() {
        if  (msg.sender == user.addr && user.valid == false)
            user.valid = true;
        if  (msg.sender == car.addr && car.valid == false) {
            car.valid = true;
            state = 3;
            OnStateChanged(3);
        }
        if  (msg.sender != car.addr && msg.sender != user.addr)
            throw;
        if  (user.valid == true && car.valid == true) {
          user.valid = false;
          car.valid = false;
          StopRent();
        }
    }
}
