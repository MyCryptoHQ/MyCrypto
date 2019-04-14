import Contract from 'libs/contracts';
import { ABIFunc } from '../../erc20';

type address = any;
type uint256 = any;

interface IRequestFactory {
  validateRequestParams: ABIFunc<
    { _addressArgs: address[]; _uintArgs: uint256[]; _endowment: uint256 },
    { paramsValidity: boolean[] }
  >;
}

const requestFactoryAbi = [
  {
    constant: true,
    inputs: [
      {
        name: '_addressArgs',
        type: 'address[3]'
      },
      {
        name: '_uintArgs',
        type: 'uint256[12]'
      },
      {
        name: '_endowment',
        type: 'uint256'
      }
    ],
    name: 'validateRequestParams',
    outputs: [
      {
        name: '',
        type: 'bool[6]'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  }
];

const outputMappings = {
  validateRequestParams: ['paramsValidity']
};

export default (new Contract(requestFactoryAbi, outputMappings) as any) as IRequestFactory;
