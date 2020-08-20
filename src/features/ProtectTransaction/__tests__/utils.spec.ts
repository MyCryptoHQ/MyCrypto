import { ProtectTxUtils, NansenReportType } from '..';
import { GetTxResponse, GetTokenTxResponse, GetBalanceResponse } from '@services';

describe('getNansenReportType', () => {
  it('should be malicious if has scam label', () => {
    expect(ProtectTxUtils.getNansenReportType(['Scam', 'test', 'whatever'])).toBe(
      NansenReportType.MALICIOUS
    );
  });
  it('should be whitelisted if has MyCrypto label', () => {
    expect(ProtectTxUtils.getNansenReportType(['MyCrypto: Donate', 'test', 'whatever'])).toBe(
      NansenReportType.WHITELISTED
    );
  });
  it('should be unknown if has no known labels', () => {
    expect(ProtectTxUtils.getNansenReportType(['test', 'whatever'])).toBe(NansenReportType.UNKNOWN);
  });
});

describe('getLastTx', () => {
  const receiverAddress = '0x4bbeEB066eD09B7AEd07bF39EEe0460DFa261520';
  it('should null if either report has failed', () => {
    expect(ProtectTxUtils.getLastTx(null, null, receiverAddress)).toBe(null);
    expect(
      ProtectTxUtils.getLastTx(null, generateMockTokenReport('15000000'), receiverAddress)
    ).toBe(null);
    expect(ProtectTxUtils.getLastTx(generateMockTxReport('15000000'), null, receiverAddress)).toBe(
      null
    );
  });

  it('should return single possibility if only one available', () => {
    const mockEmptyReport: GetTokenTxResponse = { result: [], status: '1', message: 'OK' };
    const mockTokenReport = generateMockTokenReport('15000001');
    expect(
      ProtectTxUtils.getLastTx(mockEmptyReport, mockTokenReport, receiverAddress)?.ticker
    ).toBe(mockTokenReport.result[0].tokenSymbol);
    expect(
      ProtectTxUtils.getLastTx(generateMockTxReport('15000002'), mockEmptyReport, receiverAddress)
        ?.ticker
    ).toBe('ETH');
  });

  it('should return latest tx of two possibilities', () => {
    const mockTokenReport = generateMockTokenReport('15000001');
    expect(
      ProtectTxUtils.getLastTx(generateMockTxReport('15000000'), mockTokenReport, receiverAddress)
        ?.ticker
    ).toBe(mockTokenReport.result[0].tokenSymbol);
    expect(
      ProtectTxUtils.getLastTx(generateMockTxReport('15000002'), mockTokenReport, receiverAddress)
        ?.ticker
    ).toBe('ETH');
  });

  it('should return properly formatted output', () => {
    const mockTxReport = generateMockTxReport('15000000');
    const mockTokenReport = generateMockTokenReport('15000001');
    expect(
      ProtectTxUtils.getLastTx(mockTxReport, mockTokenReport, receiverAddress)?.timestamp
    ).toBe('06/23/1970');
    expect(ProtectTxUtils.getLastTx(mockTxReport, mockTokenReport, receiverAddress)?.value).toBe(
      '0.076421'
    );
  });
});

describe('getBalance', () => {
  const mockBalanceReport: GetBalanceResponse = {
    result: '963281664619436766053',
    status: '1',
    message: 'OK'
  };
  it('should null if report has failed', () => {
    expect(ProtectTxUtils.getBalance(null)).toBe(null);
  });
  it('should return properly formatted value if if report is valid', () => {
    expect(ProtectTxUtils.getBalance(mockBalanceReport)).toBe('963.281665');
  });
});

const generateMockTxReport = (timeStamp: string): GetTxResponse => {
  return {
    result: [
      {
        blockHash: '0x64d1c307a05e73d2e6343f9a3b8906ec6c05f955a5ec6675fad48aa63010f24b',
        blockNumber: '10355396',
        confirmations: '17220',
        contractAddress: '',
        cumulativeGasUsed: '1503411',
        from: '0x4bbeeb066ed09b7aed07bf39eee0460dfa261520',
        gas: '21000',
        gasPrice: '50000000000',
        gasUsed: '21000',
        hash: '0x3db654b13e623340176eb0f968b4048374975b4ef11fd06a1b0ff6215f1e9ff2',
        input: '0x',
        nonce: '2352538',
        timeStamp,
        to: '0xd551234ae421e3bcba99a0da6d736074f22192ff',
        transactionIndex: '39',
        value: '76420500000000000'
      }
    ],
    status: '1',
    message: 'OK'
  };
};

const generateMockTokenReport = (timeStamp: string): GetTokenTxResponse => {
  return {
    result: [
      {
        blockHash: '0x64d1c307a05e73d2e6343f9a3b8906ec6c05f955a5ec6675fad48aa63010f24a',
        blockNumber: '10355396',
        confirmations: '17220',
        contractAddress: '',
        cumulativeGasUsed: '1503411',
        from: '0x4bbeeb066ed09b7aed07bf39eee0460dfa261520',
        gas: '21000',
        gasPrice: '50000000000',
        gasUsed: '21000',
        hash: '0x3db654b13e623340176eb0f968b4048374975b4ef11fd06a1b0ff6215f1e9ff2',
        input: '0x',
        nonce: '2352538',
        timeStamp,
        to: '0xd551234ae421e3bcba99a0da6d736074f22192ff',
        transactionIndex: '40',
        value: '76420500000000000',
        tokenName: 'FLEx token',
        tokenSymbol: 'FLEx',
        tokenDecimal: '4'
      }
    ],
    status: '1',
    message: 'OK'
  };
};
