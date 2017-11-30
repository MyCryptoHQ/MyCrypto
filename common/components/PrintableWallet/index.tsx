import { PaperWallet } from 'components';
import { IFullWallet } from 'ethereumjs-wallet';
import React from 'react';
import translate from 'translations';
import printElement from 'utils/printElement';
import { stripHexPrefix } from 'libs/values';

const print = (address: string, privateKey: string) => () =>
  address &&
  privateKey &&
  printElement(<PaperWallet address={address} privateKey={privateKey} />, {
    popupFeatures: {
      scrollbars: 'no'
    },
    styles: `
      * {
        box-sizing: border-box;
      }

      body {
        font-family: Lato, sans-serif;
        font-size: 1rem;
        line-height: 1.4;
        margin: 0;
      }
    `
  });

const PrintableWallet: React.SFC<{ wallet: IFullWallet }> = ({ wallet }) => {
  const address = wallet.getAddressString();
  const privateKey = stripHexPrefix(wallet.getPrivateKeyString());

  if (!address || !privateKey) {
    return null;
  }

  return (
    <div>
      <PaperWallet address={address} privateKey={privateKey} />
      <a
        role="button"
        aria-label={translate('x_Print')}
        aria-describedby="x_PrintDesc"
        className={'btn btn-lg btn-primary'}
        onClick={print(address, privateKey)}
        style={{ marginTop: 10 }}
      >
        {translate('x_Print')}
      </a>
    </div>
  );
};

export default PrintableWallet;
