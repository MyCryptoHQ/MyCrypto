import Contract from 'libs/contract';
import Big from 'bignumber.js';

describe('Contract', () => {
  // From the ABI docs
  // https://github.com/ethereum/wiki/wiki/Ethereum-Contract-ABI#json
  const testAbi = [
    {
      type: 'event',
      inputs: [
        { name: 'a', type: 'uint256', indexed: true },
        { name: 'b', type: 'bytes32', indexed: false }
      ],
      name: 'Event'
    },
    {
      type: 'function',
      inputs: [{ name: 'a', type: 'uint256' }],
      name: 'foo',
      outputs: []
    }
  ];
  const testContract = new Contract(testAbi);

  // ----------------------------------------------------------------------

  describe('constructor', () => {
    it('should create an instance given a valid ABI', () => {
      expect(testContract).toBeTruthy();
    });
  });

  // ----------------------------------------------------------------------

  describe('getMethodAbi', () => {
    it('should return the a method, given the right name', () => {
      const method = testContract.getMethodAbi('foo');
      expect(method.name).toBe('foo');
      expect(method.type).toBe('function');
      expect(method.inputs.constructor).toBe(Array);
    });

    it('should throw if given an unknown method name', () => {
      expect(() => {
        testContract.getMethodAbi('gnjwakgnawk');
      }).toThrow();
    });

    it('should throw if given a method isn’t a function', () => {
      expect(() => {
        testContract.getMethodAbi('Event');
      }).toThrow();
    });
  });

  // ----------------------------------------------------------------------

  describe('call / encodeArgs', () => {
    it('should return hex data for the method', () => {
      const result = testContract.call('foo', ['1337']);
      expect(result).toBe(
        '0x2fbebd380000000000000000000000000000000000000000000000000000000000000539'
      );
    });

    it('should throw, if given too few method args', () => {
      expect(() => {
        testContract.call('foo', []);
      }).toThrow();
    });

    it('should throw, if given too many method args', () => {
      expect(() => {
        testContract.call('foo', ['1', '2']);
      }).toThrow();
    });

    it('should throw, if given invalid args', () => {
      expect(() => {
        testContract.call('foo', [{ some: 'object?' }]);
      }).toThrow();
    });
  });
});
