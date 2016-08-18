contract RentCar {
    uint state;
    address public user;
    uint rate;
    uint price;
    struct Position {
        uint x;
        uint y;
    }
    Position pos;
    event OnStateChanged(uint state);

    function RentCar() {
        rate = 200000;
        state = 0;
        OnStateChanged(state);
    }

    function RentMe() {
        user = msg.sender;
        state = 1;
        OnStateChanged(state);
    }

    function getBalance(address user) returns(uint) {
        return user.balance;
    }

    function GoTo(uint X, uint Y) returns(bool, uint) {
        pos.x = X;
        pos.y = Y;
        price = (pos.x + pos.y) * rate;
        if (user.balance > price) {
            return (true, price);
        } else {
            throw;
        }
    }

    function StopRent() {
        state = 0;
        OnStateChanged(state);
    }

    /*function SetState(uint s) returns(uint) {
        state = s;
        StateChanged(state);
        return state;
    }*/

    function StartRent() {
        uint timeNow = now;
        state = 2;
        OnStateChanged(state);
    }
}
