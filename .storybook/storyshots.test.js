import initStoryshots from '@storybook/addon-storyshots';
import { formatDate, toUTC } from '@utils';

describe('', () => {
  beforeAll(() => {
    window.URL.createObjectURL = jest.fn();
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
    jest
      .spyOn(global.Date, 'now')
      .mockImplementation(() =>
        toUTC(
          new Date('Wed Mar 31 2021 13:26:46 GMT+0200 (Central European Summer Time)')
        ).getTime()
      );
  });

  initStoryshots();

  afterAll(() => {
    Date.toLocaleString.mockRestore();
    Date.toLocaleDateString.mockRestore();
    Date.now.mockRestore();
    window.URL.createObjectURL.mockReset();
  });
});
