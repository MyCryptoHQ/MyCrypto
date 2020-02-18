import { calculateShownIndex } from './helpers';

describe('WalletBreakdownView-helpers (calculateShownIndex)', () => {
  test('it returns the correct value when called with params indicating no onHover triggered', () => {
    const numOfPieChartSlices = 4;
    const indexToHoverOver = -1;
    expect(calculateShownIndex(numOfPieChartSlices, indexToHoverOver)).toEqual(0);
  });
  test('it returns the correct value when called with params indicating an onHover is triggered with an index of a present slice', () => {
    const numOfPieChartSlices = 4;
    const indexToHoverOver = 2;
    expect(calculateShownIndex(numOfPieChartSlices, indexToHoverOver)).toEqual(2);
  });
  test('it returns the correct value when called with params indicating an onHover is triggered with an index of a non-present slice', () => {
    const numOfPieChartSlices = 2;
    const indexToHoverOver = 4;
    expect(calculateShownIndex(numOfPieChartSlices, indexToHoverOver)).toEqual(1);
  });
});
