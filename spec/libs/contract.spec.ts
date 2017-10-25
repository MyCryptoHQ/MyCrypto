import Contract from 'libs/contract';

describe('Contract', () => {
  // From the ABI docs
  // https://github.com/ethereum/wiki/wiki/Ethereum-Contract-ABI#json
  const testAbi = [
    {
      type: 'event',
      name: 'Event',
      inputs: [
        { name: 'a', type: 'uint256', indexed: true },
        { name: 'b', type: 'bytes32', indexed: false }
      ]
    },
    {
      type: 'function',
      name: 'foo',
      inputs: [{ name: 'a', type: 'uint256' }],
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

  // ----------------------------------------------------------------------

  describe('$call / decodeArgs', () => {
    it('should decode some data', () => {
      const decoded = testContract.$call(
        '0x2fbebd380000000000000000000000000000000000000000000000000000000000000539'
      );
      expect(decoded.method.name).toBe('foo');
      expect(decoded.args[0].toString(10)).toBe('1337');
    });

    it('should return identical data from a call return', () => {
      const callMethod = 'foo';
      const callArgs = ['42891048912084012480129'];
      const callData = testContract.call(callMethod, callArgs);
      const decoded = testContract.$call(callData);

      expect(decoded.method.name).toBe(callMethod);
      expect(decoded.args[0].toString(10)).toBe(callArgs[0]);
    });

    it('should throw, if given invalid data', () => {
      expect(() => {
        // ETH address
        testContract.$call('0x7cB57B5A97eAbe94205C07890BE4c1aD31E486A8');
      }).toThrow();
    });

    it('should throw, if given an unknown method’s data', () => {
      expect(() => {
        // GNT token send data
        testContract.$call(
          '0xa9059cbb0000000000000000000000007cb57b5a97eabe94205c07890be4c1ad31e486a8000000000000000000000000000000000000000000000000130d2a539ba80000'
        );
      }).toThrow();
    });
  });
});
