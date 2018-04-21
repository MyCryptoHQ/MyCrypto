import { getLabels, getAddressLabelPairs } from 'selectors/addressBook';
import { getInitialState } from './helpers';

describe('addressBook selectors', () => {
  const state = getInitialState();

  state.addressBook = {
    labels: {
      '0x0': 'Foo',
      '0x1': 'Bar'
    }
  };

  describe('getLabels', () => {
    it('should retrieve the labels <Label: Address>', () => {
      const labels = getLabels(state);

      expect(labels['0x0']).toEqual('Foo');
      expect(labels['0x1']).toEqual('Bar');
    });

    it('should retrieve the labels, but with the key/values reversed <Address: Label> when the "reversed" option is passed', () => {
      const reversedLabels = getLabels(state, { reversed: true });

      expect(reversedLabels.Foo).toEqual('0x0');
      expect(reversedLabels.Bar).toEqual('0x1');
    });
  });

  describe('getAddressLabelPairs', () => {
    it('should return an array of pairs of labels and addresses', () => {
      const addressLabelPairs = getAddressLabelPairs(state);

      expect(addressLabelPairs.length).toEqual(2);
      expect(addressLabelPairs[0].address).toEqual('0x0');
      expect(addressLabelPairs[0].label).toEqual('Foo');
      expect(addressLabelPairs[1].address).toEqual('0x1');
      expect(addressLabelPairs[1].label).toEqual('Bar');
    });
  });
});
