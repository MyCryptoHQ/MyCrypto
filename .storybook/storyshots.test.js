import initStoryshots from '@storybook/addon-storyshots';
import { formatDate } from '@utils';

describe('', () => {
  beforeAll(() => {
    // Our localhosts have a different locale than CI. Since the snapshots
    // contain localized dates (eg. TxReceipt), we stub the call and neutralize
    // localization.
    jest.spyOn(global.Date.prototype, 'toLocaleString').mockImplementation(function () {
      return formatDate(this, true);
    });
    jest.spyOn(global.Date.prototype, 'toLocaleDateString').mockImplementation(function () {
      return formatDate(this, true);
    });
    // Membership expiration uses Date.now(). Return a set Date in order to assert
    // against snapshots
    jest.spyOn(global.Date, 'now').mockImplementation(() => new Date('03/31/2021').getTime());
  });

  initStoryshots();

  afterAll(() => {
    Date.toLocaleString.mockRestore();
    Date.toLocaleDateString.mockRestore();
    Date.now.mockRestore();
  });
});
