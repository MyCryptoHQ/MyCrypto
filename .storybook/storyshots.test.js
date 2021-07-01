import initStoryshots from '@storybook/addon-storyshots';
import { formatDate, toUTC } from '@utils';
import { render } from '@testing-library/react';

describe('', () => {
  beforeAll(() => {
    // Mocks createObjectURL to address an issue with makeBlob (utilized by Downloader) in testing.
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

  const reactTestingLibrarySerializer = {
    print: (val, serialize, indent) => serialize(val.container.firstChild),
    test: (val) => val && val.hasOwnProperty('container')
  };

  initStoryshots({
    renderer: render,
    snapshotSerializers: [reactTestingLibrarySerializer]
  });

  afterAll(() => {
    Date.toLocaleString.mockRestore();
    Date.toLocaleDateString.mockRestore();
    Date.now.mockRestore();
    window.URL.createObjectURL.mockReset();
  });
});
