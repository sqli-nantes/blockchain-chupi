import 'dapple/test.sol'; // virtual "dapple" package imported when `dapple test` is run
import 'smartconstract.sol';

// Deriving from `Test` marks the contract as a test and gives you access to various test helpers.
contract RentCarTest is Test {
  RentCar contr;
  Tester proxy_tester;
  bytes32 identifier = 0x16bd7d60bc08217d2e78d09658610a9eb6de22df8b587fdca9e980fafc4ecfcc;

  function setUp() {
    contr = new RentCar(identifier);
    proxy_tester = new Tester();
    proxy_tester._target(contr);
  }

  function testCreatorIsCreator() {
    var (carAddr, carValid) = contr.car();
    var (userAddr, userValid) = contr.user();
    assertEq( address(this), carAddr );
    assertEq( false, carValid );
    assertEq( false, userValid );
  }

  event OnStateChanged(uint state);
  function testRentMe() {
    expectEventsExact(contr);
    OnStateChanged(1);
    contr.RentMe();
    var (userAddr, userValid) = contr.user();
    assertEq( address(this), userAddr );
  }

  function testGetPrice() {
    uint x = 5;
    uint y = 9;
    uint rate = 200000;
    contr.GoTo(x,y);
    uint price = contr.GetPrice();
    assertEq((x+y)*rate, price);
  }

  function testStopRent() {
    expectEventsExact(contr);
    OnStateChanged(0);
    contr.StopRent();
  }

  function testStartRent() {
    expectEventsExact(contr);
    OnStateChanged(2);
    contr.StartRent();
  }

  function testValidateTravel() {
    expectEventsExact(contr);
    OnStateChanged(3);
    contr.ValidateTravel();
  }


}
