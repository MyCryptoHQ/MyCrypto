import {
  getAddressLabels,
  getLabelAddresses,
  getAddressErrors,
  getLabelErrors,
  getAddressLabelPairs
} from 'selectors/addressBook';
import { getInitialState } from './helpers';

describe('addressBook: Selectors', () => {
  const state = {
    ...getInitialState(),
    addressBook: {
      addresses: {
        '0x0': 'Foo'
      },
      labels: {
        Foo: '0x0'
      },
      addressErrors: {
        1337: 'Foo bar baz.'
      },
      labelErrors: {
        1337: 'Baz bar foo.'
      }
    }
  };

  describe('getAddressLabels', () => {
    it('should return a hash of addresses to labels', () => {
      expect(getAddressLabels(state)['0x0']).toEqual('Foo');
    });
  });

  describe('getLabelAddresses', () => {
    it('should return a hash of labels to addresses', () => {
      expect(getLabelAddresses(state).Foo).toEqual('0x0');
    });
  });

  describe('getAddressErrors', () => {
    it('should return an error if the index exists', () => {
      expect(getAddressErrors(state)[1337]).toEqual('Foo bar baz.');
    });
    it('should return undefined if the index does not exist', () => {
      expect(getAddressErrors(state)[1000]).toEqual(undefined);
    });
  });

  describe('getLabelErrors', () => {
    it('should return an error if the index exists', () => {
      expect(getLabelErrors(state)[1337]).toEqual('Baz bar foo.');
    });
    it('should return undefined if the index does not exist', () => {
      expect(getLabelErrors(state)[1000]).toEqual(undefined);
    });
  });

  describe('getAddressLabelPairs', () => {
    it('should return an array of objects that contain an address and a label', () => {
      expect(getAddressLabelPairs(state)[0]).toEqual({
        address: '0x0',
        label: 'Foo'
      });
    });
  });
});
