import { PaperWallet } from 'components';
import React from 'react';
import { translateRaw } from 'translations';
import printElement from 'utils/printElement';
import { stripHexPrefix } from 'libs/values';

export const print = (address: string, privateKey: string) => () =>
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

interface Props {
  address: string;
  privateKey: string;
}

const PrintableWallet: React.SFC<Props> = ({ address, privateKey }) => {
  const pkey = stripHexPrefix(privateKey);

  return (
    <div>
      <PaperWallet address={address} privateKey={pkey} />
      <a
        role="button"
        aria-label={translateRaw('x_Print')}
        aria-describedby="x_PrintDesc"
        className="btn btn-lg btn-primary btn-block"
        onClick={print(address, pkey)}
        style={{ margin: '10px auto 0', maxWidth: '260px' }}
      >
        {translateRaw('x_Print')}
      </a>
    </div>
  );
};

export default PrintableWallet;
