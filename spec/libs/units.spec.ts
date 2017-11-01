import {
  fromWei,
  Wei,
  toWei,
  toTokenBase,
  fromTokenBase,
  getDecimal,
  TokenValue
} from 'libs/units';

const Units = {
  wei: '1',
  kwei: '1000',
  ada: '1000',
  femtoether: '1000',
  mwei: '1000000',
  babbage: '1000000',
  picoether: '1000000',
  gwei: '1000000000',
  shannon: '1000000000',
  nanoether: '1000000000',
  nano: '1000000000',
  szabo: '1000000000000',
  microether: '1000000000000',
  micro: '1000000000000',
  finney: '1000000000000000',
  milliether: '1000000000000000',
  milli: '1000000000000000',
  ether: '1000000000000000000',
  kether: '1000000000000000000000',
  grand: '1000000000000000000000',
  einstein: '1000000000000000000000',
  mether: '1000000000000000000000000',
  gether: '1000000000000000000000000000',
  tether: '1000000000000000000000000000000'
};

describe('Units', () => {
  describe('ethereum units', () => {
    describe('ether', () => {
      const wei = Wei(Units.ether);
      const ether = fromWei(wei, 'ether');
      it('should equal one ether', () => {
        expect(ether).toEqual('1');
      });

      it('should equal 1 * 10^18 wei', () => {
        const converted = toWei(ether, getDecimal('ether'));
        expect(converted.toString()).toEqual(Units.ether);
      });
    });
    describe('gwei', () => {
      const wei = Wei(`2${Units.gwei}`);
      const gwei = fromWei(wei, 'gwei');
      it('should equal 21 gwei', () => {
        expect(gwei).toEqual('21');
      });
      it('should equal 21 * 10^9 wei', () => {
        const converted = toWei(gwei, getDecimal('gwei'));
        expect(converted.toString()).toEqual(wei.toString());
      });
    });
    describe('kwei', () => {
      const wei = Wei('1623');
      const kwei = fromWei(wei, 'kwei');
      it('should equal 1.623 kwei', () => {
        expect(kwei).toEqual('1.623');
      });
      it('should equal 1.623  * 10^3 wei', () => {
        const converted = toWei(kwei, getDecimal('kwei'));
        expect(converted.toString()).toEqual('1623');
      });
    });
  });
  describe('token units', () => {
    describe('token 1', () => {
      const tokens = '732156.34592016';
      const decimal = 18;
      const tokenBase = toTokenBase(tokens, decimal);
      it('should equal 732156345920160000000000', () => {
        expect(tokenBase.toString()).toEqual('732156345920160000000000');
      });
      it('should equal 732156.34592016', () => {
        expect(fromTokenBase(tokenBase, decimal)).toEqual(tokens);
      });
    });
    describe('token 2', () => {
      const tokens = '8000';
      const decimal = 8;
      const converted = fromTokenBase(TokenValue(tokens), decimal);
      it('should equal 0.00008', () => {
        expect(converted).toEqual('0.00008');
      });
      it('should equal 8000', () => {
        expect(toTokenBase(converted, decimal));
      });
    });
  });
});
