import { ProtectTxUtils, NansenReportType } from '..';

describe('Nansen Report Types', () => {
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
