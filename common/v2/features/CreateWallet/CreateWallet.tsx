import React from 'react';
import { withRouter, Link, RouteComponentProps } from 'react-router-dom';
import { Button, Typography } from '@mycrypto/ui';
import styled from 'styled-components';

import { translateRaw } from 'translations';
import { ExtendedContentPanel } from 'v2/components';
import { ROUTE_PATHS } from 'v2/config';

// Legacy
import newWalletIcon from 'common/assets/images/icn-new-wallet.svg';

const DescriptionItem = styled(Typography)`
  margin-top: 18px;
  font-weight: normal;
  font-size: 18px !important;

  strong {
    font-weight: 900;
  }
`;

const ImageWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 33px;
  margin-bottom: 25px;
`;

const WalletImage = styled.img`
  width: 152px;
  height: 163px;
`;

const StyledButton = styled(Button)`
  font-size: 18px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 28px;
  &:focus,
  &:hover {
    embed {
      filter: brightness(0) invert(1);
    }
  }
`;

const BottomActions = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
  margin-top: 30px;
  line-height: 1.5;
`;

export interface PanelProps {
  totalSteps: number;
  currentStep: number;
  onBack(): void;
  onNext(): void;
}

export function CreateWallet({ history }: RouteComponentProps<{}>) {
  return (
    <ExtendedContentPanel
      onBack={() => history.push(ROUTE_PATHS.ROOT.path)}
      heading={translateRaw('CREATE_ACCOUNT_TITLE')}
    >
      <DescriptionItem>{translateRaw('CREATE_ACCOUNT_DESCRIPTION_1')}</DescriptionItem>
      <DescriptionItem>{translateRaw('CREATE_ACCOUNT_DESCRIPTION_2')}</DescriptionItem>
      <ImageWrapper>
        <WalletImage src={newWalletIcon} alt="New wallet" />
      </ImageWrapper>

      <DescriptionItem>{translateRaw('CREATE_ACCOUNT_DESCRIPTION_3')}</DescriptionItem>
      <Link to="/create-wallet/mnemonic">
        <StyledButton>{translateRaw('CREATE_ACCOUNT_BUTTON')}</StyledButton>
      </Link>
      <BottomActions>
        <div>
          {translateRaw('CREATE_WALLET_WITH_KEYSTORE_BOTTOM_ACTION_1')}{' '}
          <Link to="/create-wallet/keystore">
            {translateRaw('CREATE_WALLET_WITH_KEYSTORE_BOTTOM_ACTION_2')}
          </Link>
        </div>
        <div>
          {translateRaw('CREATE_WALLET_UNLOCK_WALLET_BOTTOM_ACTION_1')}{' '}
          <Link to="#">{translateRaw('CREATE_WALLET_UNLOCK_WALLET_BOTTOM_ACTION_2')}</Link>
        </div>
      </BottomActions>
    </ExtendedContentPanel>
  );
}

export default withRouter(CreateWallet);
