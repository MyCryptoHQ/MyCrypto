import ABIFunction from './ABIFunction';
import Big from 'bignumber.js';

class Contract {
  abi;
  constructor(abi) {
    this.abi = abi;
    this._assignABIFuncs();
  }
  _assignABIFuncs = () => {
    const { abi } = this;
    abi.forEach(currentABIMethod => {
      if (currentABIMethod.type === 'function') {
        //only grab the functions we need
        const { encodeInput, decodeInput, decodeOutput } = new ABIFunction(
          currentABIMethod
        );
        const funcToAssign = {
          [currentABIMethod.name]: { encodeInput, decodeInput, decodeOutput }
        };
        console.log(funcToAssign);
        Object.assign(this, funcToAssign);
      }
    });
  };
}

const erc20Abi: ABI = [
  {
    constant: true,
    inputs: [
      {
        name: '_owner',
        type: 'address'
      }
    ],
    name: 'balanceOf',
    outputs: [
      {
        name: 'balance',
        type: 'uint256'
      }
    ],
    payable: false,
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: '_to',
        type: 'address'
      },
      {
        name: '_value',
        type: 'uint256'
      }
    ],
    name: 'transfer',
    outputs: [
      {
        name: 'success',
        type: 'bool'
      }
    ],
    payable: false,
    type: 'function'
  }
];
const MEW_ADDRESS = '0x7cB57B5A97eAbe94205C07890BE4c1aD31E486A8';

const ERC20 = new Contract(erc20Abi);
console.log(ERC20);
/*
Contract {
  abi: {...},
  balanceOf   { encodeInput: [Function],
     decodeInput: [Function],
     decodeOutput: [Function] },, transfer}
  transfer:
   { encodeInput: [Function],
     decodeInput: [Function],
     decodeOutput: [Function] }
  }
 */
const encodedInput = ERC20.balanceOf.encodeInput({ _owner: MEW_ADDRESS });
console.log(encodedInput); //0x70a082310000000000000000000000007cb57b5a97eabe94205c07890be4c1ad31e486a8
const decodedInput = ERC20.balanceOf.decodeInput(encodedInput);
console.log(decodedInput); //{"_owner":"7cb57b5a97eabe94205c07890be4c1ad31e486a8"}
const value = new Big('1').times(new Big(10).pow(18));
const data = ERC20.transfer.encodeInput({
  _to: MEW_ADDRESS,
  _value: value
});
console.log(data);

const tx = ERC20.transfer.decodeInput(
  '0xa9059cbb0000000000000000000000007cb57b5a97eabe94205c07890be4c1ad31e486a800000000000000000000000000000000000000000000000000038d7ea4c68000'
);
console.log(tx._value);
console.log(new Big('0.001').times(new Big(10).pow(18)).toString());
