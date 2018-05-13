import { PaperWallet } from 'components';
import React from 'react';
import printElement from 'utils/printElement';
import { stripHexPrefix } from 'libs/values';
import translate, { translateRaw } from 'translations';
import { NetworkConfig } from 'types/network';

export const print = (address: string, privateKey: string, network: NetworkConfig) => () =>
  address &&
  privateKey &&
  printElement(<PaperWallet address={address} privateKey={privateKey} network={network} />, {
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
  network: NetworkConfig;
}

const PrintableWallet: React.SFC<Props> = ({ address, privateKey, network }) => {
  const pkey = stripHexPrefix(privateKey);

  return (
    <div>
      <PaperWallet address={address} privateKey={pkey} network={network} />
      <a
        role="button"
        aria-label={translateRaw('X_PRINT')}
        aria-describedby="x_PrintDesc"
        className="btn btn-lg btn-primary btn-block"
        onClick={print(address, pkey, network)}
        style={{ margin: '10px auto 0', maxWidth: '260px' }}
      >
        {translate('X_PRINT')}
      </a>
    </div>
  );
};

export default PrintableWallet;
