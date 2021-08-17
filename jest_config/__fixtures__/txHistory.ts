import { ITxHistoryApiResponse } from '@services/ApiService/History';
import { ITxHistoryState, ITxMetaTypes } from '@store/txHistory.slice';
import {
  ITxData,
  ITxGasLimit,
  ITxGasPrice,
  ITxHash,
  ITxNonce,
  ITxStatus,
  ITxType,
  ITxValue,
  TAddress
} from '@types';

export const fTxHistoryAPI: ITxHistoryApiResponse = {
  to: '0x7a250d5630b4cf539739df2c5dacb4c659f2488d' as TAddress,
  from: '0xfE5443FaC29fA621cFc33D41D1927fd0f5E0bB7c' as TAddress,
  value: '0x1f399b1438a10000' as ITxValue,
  blockNumber: '0xa2db5e',
  timestamp: 1597606012,
  gasLimit: '0x0286ca' as ITxGasLimit,
  gasUsed: '0x01e815',
  gasPrice: '0x1836e21000' as ITxGasPrice,
  status: ITxStatus.SUCCESS,
  nonce: '0xf4' as ITxNonce,
  erc20Transfers: [
    {
      from: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D' as TAddress,
      to: '0x8878Df9E1A7c87dcBf6d3999D997f262C05D8C70' as TAddress,
      contractAddress: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2' as TAddress,
      amount: '0x1f399b1438a10000'
    },
    {
      from: '0x8878Df9E1A7c87dcBf6d3999D997f262C05D8C70' as TAddress,
      to: '0x5197B5b062288Bbf29008C92B08010a92Dd677CD' as TAddress,
      contractAddress: '0xbbbbca6a901c926f240b89eacb641d8aec7aeafd' as TAddress,
      amount: '0x0110a6c6c43733b70d4b'
    }
  ],
  recipientAddress: '0x7a250d5630b4cf539739df2c5dacb4c659f2488d' as TAddress,
  hash: '0xbc9a016464ac9d52d29bbe9feec9e5cb7eb3263567a1733650fe8588d426bf40' as ITxHash,
  txType: 'UNISWAP_V2_EXCHANGE' as ITxType,
  data: '0x7ff36ab500000000000000000000000000000000000000000000010f4b84d285e47e19f600000000000000000000000000000000000000000000000000000000000000800000000000000000000000005197b5b062288bbf29008c92b08010a92dd677cd000000000000000000000000000000000000000000000000000000005f398d270000000000000000000000000000000000000000000000000000000000000002000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2000000000000000000000000bbbbca6a901c926f240b89eacb641d8aec7aeafd' as ITxData
};

export const fTxTypeMetas: ITxMetaTypes = {
  '1INCH_EXCHANGE': {
    protocol: '1INCH',
    type: 'EXCHANGE'
  },
  ERC_20_APPROVE: {
    protocol: 'ERC_20',
    type: 'APPROVE'
  },
  ERC_20_MINT: {
    protocol: 'ERC_20',
    type: 'MINT'
  },
  ERC_20_TRANSFER: {
    protocol: 'ERC_20',
    type: 'TRANSFER'
  },
  UNISWAP_V2_EXCHANGE: {
    protocol: 'UNISWAP_V2',
    type: 'EXCHANGE'
  }
};

export const fTxHistory: ITxHistoryState = {
  history: [],
  txTypeMeta: fTxTypeMetas,
  error: ''
};
