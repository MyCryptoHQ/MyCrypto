import initStoryshots from '@storybook/addon-storyshots';

describe('', () => {
  // Our localhosts have a different locale than CI. Since the snapshots
  // contain localized dates (eg. TxReceipt), we stub the call and neutralize
  // localization.
  beforeAll(() => {
    jest.spyOn(global.Date.prototype, 'toLocaleString').mockImplementation(function (args) {
      return new Date(this.valueOf()).toISOString();
    });
  });

  initStoryshots();

  afterAll(() => {
    Date.toLocaleString.mockRestore();
  });
});
