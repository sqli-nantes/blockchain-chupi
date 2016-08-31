'use strict';

// For geth
if (typeof dapple === 'undefined') {
  var dapple = {};
}

if (typeof web3 === 'undefined' && typeof Web3 === 'undefined') {
  var Web3 = require('web3');
}

dapple['test'] = (function builder () {
  var environments = {};

  function ContractWrapper (headers, _web3) {
    if (!_web3) {
      throw new Error('Must supply a Web3 connection!');
    }

    this.headers = headers;
    this._class = _web3.eth.contract(headers.interface);
  }

  ContractWrapper.prototype.deploy = function () {
    var args = new Array(arguments);
    args[args.length - 1].data = this.headers.bytecode;
    return this._class.new.apply(this._class, args);
  };

  var passthroughs = ['at', 'new'];
  for (var i = 0; i < passthroughs.length; i += 1) {
    ContractWrapper.prototype[passthroughs[i]] = (function (passthrough) {
      return function () {
        return this._class[passthrough].apply(this._class, arguments);
      };
    })(passthroughs[i]);
  }

  function constructor (_web3, env) {
    if (!env) {
      env = {};
    }
    while (typeof env !== 'object') {
      if (!(env in environments)) {
        throw new Error('Cannot resolve environment name: ' + env);
      }
      env = environments[env];
    }

    if (typeof _web3 === 'undefined') {
      if (!env.rpcURL) {
        throw new Error('Need either a Web3 instance or an RPC URL!');
      }
      _web3 = new Web3(new Web3.providers.HttpProvider(env.rpcURL));
    }

    this.headers = {
      'RentCar': {
        'interface': [
          {
            'constant': false,
            'inputs': [],
            'name': 'ValidateTravel',
            'outputs': [],
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'addr',
                'type': 'address'
              }
            ],
            'name': 'GetBalance',
            'outputs': [
              {
                'name': '',
                'type': 'uint256'
              }
            ],
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [],
            'name': 'StartRent',
            'outputs': [],
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [],
            'name': 'RentMe',
            'outputs': [],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [],
            'name': 'user',
            'outputs': [
              {
                'name': 'addr',
                'type': 'address'
              },
              {
                'name': 'valid',
                'type': 'bool'
              }
            ],
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'X',
                'type': 'uint256'
              },
              {
                'name': 'Y',
                'type': 'uint256'
              }
            ],
            'name': 'GoTo',
            'outputs': [],
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [],
            'name': 'GetPrice',
            'outputs': [
              {
                'name': '',
                'type': 'uint256'
              }
            ],
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [],
            'name': 'check',
            'outputs': [
              {
                'name': '',
                'type': 'bytes32'
              }
            ],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': 'v',
                'type': 'uint256'
              }
            ],
            'name': 'uintToBytes',
            'outputs': [
              {
                'name': 'ret',
                'type': 'bytes32'
              }
            ],
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [],
            'name': 'StopRent',
            'outputs': [],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [],
            'name': 'car',
            'outputs': [
              {
                'name': 'addr',
                'type': 'address'
              },
              {
                'name': 'valid',
                'type': 'bool'
              }
            ],
            'type': 'function'
          },
          {
            'inputs': [
              {
                'name': 'identifier',
                'type': 'bytes32'
              }
            ],
            'type': 'constructor'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': false,
                'name': 'state',
                'type': 'uint256'
              }
            ],
            'name': 'OnStateChanged',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': true,
                'name': 'identifier',
                'type': 'bytes32'
              }
            ],
            'name': 'OnCreated',
            'type': 'event'
          }
        ],
        'bytecode': '6060604052604051602080610baa833981016040528080519060200190919050505b60006005600050819055506000600660006101000a81548160ff0219169083021790555062030d4060036000508190555033600260005060000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055506000600160005060000160146101000a81548160ff021916908302179055506000600260005060000160146101000a81548160ff021916908302179055506100cb600061010f565b80600019167f2693c233eedd377b05c84aa5d546ed3ecf9d58e5d3ecfcf8c9b5d98aaa0243d860405180905060405180910390a25b50610a51806101596000396000f35b806000600050819055507f912ea462c8f766ba4c4d483188d54606373cd0a6b6cbe1069fbbd0d388103da36000600050546040518082815260200191505060405180910390a15b5056606060405236156100ab576000357c0100000000000000000000000000000000000000000000000000000000900480630175c290146100ad57806343e2e504146100bc5780634711c55c146100e85780634c0004e5146100f75780634f8632ba1461010657806355289e61146101485780636d90164e14610169578063919840ad1461018c57806394e8767d146101b3578063c45b2aa1146101e3578063ee26fac3146101f2576100ab565b005b6100ba6004805050610234565b005b6100d260048080359060200190919050506104d3565b6040518082815260200191505060405180910390f35b6100f560048050506104f9565b005b6101046004805050610692565b005b61011360048050506106d0565b604051808373ffffffffffffffffffffffffffffffffffffffff16815260200182151581526020019250505060405180910390f35b6101676004808035906020019091908035906020019091905050610712565b005b61017660048050506107b1565b6040518082815260200191505060405180910390f35b61019960048050506107c3565b604051808260001916815260200191505060405180910390f35b6101c9600480803590602001909190505061085a565b604051808260001916815260200191505060405180910390f35b6101f060048050506108f6565b005b6101ff60048050506109c5565b604051808373ffffffffffffffffffffffffffffffffffffffff16815260200182151581526020019250505060405180910390f35b600160005060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141580156102ec5750600260005060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614155b156102f657610002565b600160005060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16148015610372575060001515600160005060000160149054906101000a900460ff161515145b15610397576001600160005060000160146101000a81548160ff021916908302179055505b600260005060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16148015610413575060001515600260005060000160149054906101000a900460ff161515145b15610442576001600260005060000160146101000a81548160ff021916908302179055506104416003610a07565b5b60011515600160005060000160149054906101000a900460ff161515148015610484575060011515600260005060000160149054906101000a900460ff161515145b156104d0576000600160005060000160146101000a81548160ff021916908302179055506000600260005060000160146101000a81548160ff021916908302179055506104cf6108f6565b5b5b565b60008173ffffffffffffffffffffffffffffffffffffffff163190506104f4565b919050565b600160005060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141580156105b15750600260005060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614155b156105bb57610002565b600460005054341015156106715760046000505434141515610649576004600050543403600560005081905550600160005060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166000600560005054604051809050600060405180830381858888f19350505050505b6001600660006101000a81548160ff0219169083021790555061066c6002610a07565b61068f565b6000600660006101000a81548160ff02191690830217905550610002565b5b565b33600160005060000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055506106cd6001610a07565b5b565b60016000508060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16908060000160149054906101000a900460ff16905082565b81600760005060000160005081905550806007600050600101600050819055506003600050546007600050600101600050546007600050600001600050540102600460005081905550600460005054600160005060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163110156107ac57610002565b5b5050565b600060046000505490506107c0565b90565b6000600660009054906101000a900460ff161561082e5760006005600050541415610814577f4320657374206f6b000000000000000000000000000000000000000000000000905061085756610829565b61082260056000505461085a565b9050610857565b610856565b7f5920612070617320617373657a206420617267656e74000000000000000000009050610857565b5b90565b6000600082141561088f577f3000000000000000000000000000000000000000000000000000000000000000905080506108e9565b5b60008211156108e857610100816001900404600102905080507f01000000000000000000000000000000000000000000000000000000000000006030600a84060102600102811790508050600a820491508150610890565b5b8090506108f1565b919050565b600160005060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141580156109ae5750600260005060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614155b156109b857610002565b6109c26000610a07565b5b565b60026000508060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16908060000160149054906101000a900460ff16905082565b806000600050819055507f912ea462c8f766ba4c4d483188d54606373cd0a6b6cbe1069fbbd0d388103da36000600050546040518082815260200191505060405180910390a15b5056'
      }
    };

    this.classes = {};
    for (var key in this.headers) {
      this.classes[key] = new ContractWrapper(this.headers[key], _web3);
    }

    this.objects = {};
    for (var i in env.objects) {
      var obj = env.objects[i];
      this.objects[i] = this.classes[obj['class']].at(obj.address);
    }
  }

  return {
    class: constructor,
    environments: environments
  };
})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = dapple['test'];
}
