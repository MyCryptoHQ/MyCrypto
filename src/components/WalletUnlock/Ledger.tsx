import { LEDGER_DERIVATION_PATHS } from '@mycrypto/wallets';

import { LinkApp } from '@components';
import { ETHEREUM_NETWORKS } from '@config';
import { Trans } from '@translations';
import { FormData, WalletId } from '@types';

import { Hardware } from './Hardware';

interface OwnProps {
  formData: FormData;
  onUnlock(param: any): void;
}

export const Ledger = ({ formData, onUnlock }: OwnProps) => {
  const extraDPaths = ETHEREUM_NETWORKS.includes(formData.network) ? LEDGER_DERIVATION_PATHS : [];

  if (window.location.protocol !== 'https:') {
    return (
      <div className="Panel">
        <div className="alert alert-danger">
          <Trans
            id="UNLOCKING_LEDGER_ONLY_POSSIBLE_ON_OVER_HTTPS"
            variables={{
              $link: () => (
                <LinkApp href="https://mycrypto.com" isExternal={true}>
                  MyCrypto.com
                </LinkApp>
              )
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <Hardware
      formData={formData}
      onUnlock={onUnlock}
      wallet={WalletId.LEDGER_NANO_S_NEW}
      extraDPaths={extraDPaths}
    />
  );
};
