import initStoryshots from '@storybook/addon-storyshots';

describe('', () => {
  beforeAll(() => {
    // Our localhosts have a different locale than CI. Since the snapshots
    // contain localized dates (eg. TxReceipt), we stub the call and neutralize
    // localization.
    jest.spyOn(global.Date.prototype, 'toLocaleString').mockImplementation(function () {
      return new Date(this.valueOf()).toISOString();
    });
    // Membership expiration uses Date.now(). Return a set Date in order to assert
    // against snapshots
    jest.spyOn(global.Date, 'now').mockImplementation(() => new Date('03/22/2021').getTime());
  });

  initStoryshots();

  afterAll(() => {
    Date.toLocaleString.mockRestore();
    Date.now.mockRestore();
  });
});
