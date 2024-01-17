import { BigNumber } from '@ethersproject/bignumber';

import { ProviderHandler } from '@services/EthService';
import { bigify } from '@utils';

import { estimateFees, FALLBACK_ESTIMATE } from './eip1559';

const block = {
  hash: '0x38b34c2313e148a0916406a204536c03e5bf77312c558d25d3b63d8a4e30af47',
  parentHash: '0xc33eb2f6795e58cb9ad800bfeed0463a14c8a94a9e621de14fd05a782f1ffbd4',
  number: 5219914,
  timestamp: 1627469703,
  nonce: '0x0000000000000000',
  difficulty: 1,
  _difficulty: BigNumber.from(1),
  gasLimit: BigNumber.from('0x01c9c380'),
  gasUsed: BigNumber.from('0x26aee4'),
  miner: '0x0000000000000000000000000000000000000000',
  extraData:
    '0xd883010a05846765746888676f312e31362e35856c696e757800000000000000a866c8e4b72c133037132849cf9419f32126bf93dfb5a42b092828fd4bfa5e8e2ce59121cb2516740c03af11225e5b6a2d9dad29cf4fe77a70af26c4ce30236601',
  transactions: [],
  baseFeePerGas: BigNumber.from('10000000000')
};

const feeHistory = {
  oldestBlock: '0x4fa645',
  reward: [['0x0'], ['0x3b9aca00'], ['0x12a05f1f9'], ['0x3b9aca00'], ['0x12a05f1f9']],
  baseFeePerGas: ['0x7', '0x7', '0x7', '0x7', '0x7', '0x7'],
  gasUsedRatio: [0, 0.10772606666666666, 0.0084, 0.12964573239101315, 0.06693689580776942]
};

describe('estimateFees', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });
  const mockProvider = ({
    getLatestBlock: jest.fn(),
    getFeeHistory: jest.fn()
  } as unknown) as ProviderHandler;
  it('estimates without using priority fees', () => {
    (mockProvider.getLatestBlock as jest.MockedFunction<
      typeof mockProvider.getLatestBlock
    >).mockResolvedValueOnce(block);
    return expect(estimateFees(mockProvider)).resolves.toStrictEqual({
      baseFee: bigify('10000000000'),
      maxFeePerGas: bigify('20000000000'),
      maxPriorityFeePerGas: bigify('3000000000')
    });
  });

  it('estimates priority fees', async () => {
    (mockProvider.getLatestBlock as jest.MockedFunction<
      typeof mockProvider.getLatestBlock
    >).mockResolvedValueOnce({ ...block, baseFeePerGas: BigNumber.from('100000000000') });
    (mockProvider.getFeeHistory as jest.MockedFunction<
      typeof mockProvider.getFeeHistory
    >).mockResolvedValueOnce(feeHistory);
    return expect(estimateFees(mockProvider)).resolves.toStrictEqual({
      baseFee: bigify('100000000000'),
      maxFeePerGas: bigify('160000000000'),
      maxPriorityFeePerGas: bigify('5000000000')
    });
  });

  it('estimates priority fees removing low outliers', async () => {
    (mockProvider.getLatestBlock as jest.MockedFunction<
      typeof mockProvider.getLatestBlock
    >).mockResolvedValueOnce({ ...block, baseFeePerGas: BigNumber.from('100000000000') });
    (mockProvider.getFeeHistory as jest.MockedFunction<
      typeof mockProvider.getFeeHistory
    >).mockResolvedValueOnce({
      ...feeHistory,
      reward: [
        ['0x1'],
        ['0x1'],
        ['0x1'],
        ['0x1'],
        ['0x1'],
        ['0x1a13b8600'],
        ['0x12a05f1f9'],
        ['0x3b9aca00'],
        ['0x1a13b8600']
      ]
    });
    return expect(estimateFees(mockProvider)).resolves.toStrictEqual({
      baseFee: bigify('100000000000'),
      maxFeePerGas: bigify('160000000000'),
      maxPriorityFeePerGas: bigify('5000000000')
    });
  });

  it('uses 1.6 multiplier for base if above 40 gwei', async () => {
    (mockProvider.getLatestBlock as jest.MockedFunction<
      typeof mockProvider.getLatestBlock
    >).mockResolvedValueOnce({ ...block, baseFeePerGas: BigNumber.from('0x11766ffa76') });
    (mockProvider.getFeeHistory as jest.MockedFunction<
      typeof mockProvider.getFeeHistory
    >).mockResolvedValueOnce(feeHistory);
    return expect(estimateFees(mockProvider)).resolves.toStrictEqual({
      baseFee: bigify('75001494134'),
      maxFeePerGas: bigify('120000000000'),
      maxPriorityFeePerGas: bigify('3000000000')
    });
  });

  it('uses 1.4 multiplier for base if above 100 gwei', async () => {
    (mockProvider.getLatestBlock as jest.MockedFunction<
      typeof mockProvider.getLatestBlock
    >).mockResolvedValueOnce({ ...block, baseFeePerGas: BigNumber.from('200000000000') });
    (mockProvider.getFeeHistory as jest.MockedFunction<
      typeof mockProvider.getFeeHistory
    >).mockResolvedValueOnce(feeHistory);
    return expect(estimateFees(mockProvider)).resolves.toStrictEqual({
      baseFee: bigify('200000000000'),
      maxFeePerGas: bigify('280000000000'),
      maxPriorityFeePerGas: bigify('5000000000')
    });
  });

  it('uses 1.2 multiplier for base if above 200 gwei', async () => {
    (mockProvider.getLatestBlock as jest.MockedFunction<
      typeof mockProvider.getLatestBlock
    >).mockResolvedValueOnce({ ...block, baseFeePerGas: BigNumber.from('300000000000') });
    (mockProvider.getFeeHistory as jest.MockedFunction<
      typeof mockProvider.getFeeHistory
    >).mockResolvedValueOnce(feeHistory);
    return expect(estimateFees(mockProvider)).resolves.toStrictEqual({
      baseFee: bigify('300000000000'),
      maxFeePerGas: bigify('360000000000'),
      maxPriorityFeePerGas: bigify('5000000000')
    });
  });

  it('handles baseFee being smaller than priorityFee', async () => {
    (mockProvider.getLatestBlock as jest.MockedFunction<
      typeof mockProvider.getLatestBlock
    >).mockResolvedValueOnce({ ...block, baseFeePerGas: BigNumber.from('7') });
    (mockProvider.getFeeHistory as jest.MockedFunction<
      typeof mockProvider.getFeeHistory
    >).mockResolvedValueOnce(feeHistory);
    return expect(estimateFees(mockProvider)).resolves.toStrictEqual({
      baseFee: bigify('7'),
      maxFeePerGas: bigify('3000000000'),
      maxPriorityFeePerGas: bigify('3000000000')
    });
  });

  it('falls back if no baseFeePerGas on block', async () => {
    (mockProvider.getLatestBlock as jest.MockedFunction<
      typeof mockProvider.getLatestBlock
    >).mockResolvedValueOnce({ ...block, baseFeePerGas: undefined });
    return expect(estimateFees(mockProvider)).resolves.toStrictEqual(FALLBACK_ESTIMATE);
  });

  it('falls back if priority fetching fails', async () => {
    (mockProvider.getLatestBlock as jest.MockedFunction<
      typeof mockProvider.getLatestBlock
    >).mockResolvedValueOnce({ ...block, baseFeePerGas: BigNumber.from('300000000000') });
    (mockProvider.getFeeHistory as jest.MockedFunction<
      typeof mockProvider.getFeeHistory
    >).mockResolvedValueOnce({ ...feeHistory, reward: undefined });
    return expect(estimateFees(mockProvider)).resolves.toStrictEqual(FALLBACK_ESTIMATE);
  });

  it('falls back if gas is VERY high', async () => {
    (mockProvider.getLatestBlock as jest.MockedFunction<
      typeof mockProvider.getLatestBlock
    >).mockResolvedValueOnce({ ...block, baseFeePerGas: BigNumber.from('9999000000000') });
    (mockProvider.getFeeHistory as jest.MockedFunction<
      typeof mockProvider.getFeeHistory
    >).mockResolvedValueOnce(feeHistory);
    return expect(estimateFees(mockProvider)).resolves.toStrictEqual(FALLBACK_ESTIMATE);
  });
});
