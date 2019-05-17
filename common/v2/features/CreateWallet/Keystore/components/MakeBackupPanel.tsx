import React, { Component } from 'react';
import { Button, Typography } from '@mycrypto/ui';
import styled from 'styled-components';
import { IV3Wallet } from 'ethereumjs-wallet';

import { ExtendedContentPanel } from 'v2/components';
import { PanelProps } from '../../CreateWallet';
import { PaperWallet } from 'components';
import translate, { translateRaw } from 'translations';
import lockSafetyIcon from 'common/assets/images/icn-lock-safety.svg';

import printerIcon from 'common/assets/images/icn-printer.svg';

const PrinterImage = styled.embed`
  width: 24px;
  height: 24px;
  margin-right: 10px;
  pointer-events: none;
  display: inline;
`;

const DescriptionItem = styled(Typography)`
  margin-top: 18px;
  font-weight: normal;
  font-size: 18px !important;

  strong {
    font-weight: 900;
  }
`;

const ButtonsWrapper = styled.div`
  margin-top: 48px;
  display: flex;
  flex-direction: column;
`;
const StyledButton = styled(Button)`
  font-size: 18px;
  margin-bottom: 16px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  &:focus,
  &:hover {
    embed {
      filter: brightness(0) invert(1);
    }
  }
`;

const ImageWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 33px;
  margin-bottom: 25px;
`;

const PrivateKeyWrapper = styled.div`
  font-size: 20px;
  margin-top: 18px;
`;

const PrivateKeyField = styled.div`
  width: 100%;
  font-size: 18px;
  border: solid 1px #e5ecf3;
  background-color: rgba(247, 247, 247, 0.4);
  word-wrap: break-word;
  padding: 8px 18px;
  margin-top: 8px;
`;

const HiddenPaperWallet = styled.div`
  position: absolute;
  top: -1000px;
`;

interface Props extends PanelProps {
  privateKey: string;
  keystore: IV3Wallet;
}

interface State {
  paperWalletImage: string;
}

export default class MakeBackupPanel extends Component<Props, State> {
  public state: State = {
    paperWalletImage: ''
  };

  private paperWallet: PaperWallet | null;

  public componentDidMount() {
    setTimeout(() => {
      if (!this.paperWallet) {
        return this.componentDidMount();
      }
      this.paperWallet.toPNG().then(png => this.setState({ paperWalletImage: png }));
    }, 500);
  }

  public render() {
    const { paperWalletImage } = this.state;
    const { onBack, onNext, totalSteps, currentStep, privateKey, keystore } = this.props;

    return (
      <ExtendedContentPanel
        onBack={onBack}
        stepper={{
          current: currentStep,
          total: totalSteps
        }}
        heading={translateRaw('MAKE_BACKUP_TITLE')}
        className="SaveKeystoreFilePanel"
      >
        <ImageWrapper>
          <img src={lockSafetyIcon} />
        </ImageWrapper>

        <DescriptionItem>{translate('MAKE_BACKUP_DESCRIPTION_1')}</DescriptionItem>
        <DescriptionItem>{translate('MAKE_BACKUP_DESCRIPTION_2')}</DescriptionItem>
        <DescriptionItem>{translate('MAKE_BACKUP_DESCRIPTION_3')}</DescriptionItem>

        <PrivateKeyWrapper>
          {translate('YOUR_PRIVATE_KEY_LABEL')}
          <PrivateKeyField>{privateKey}</PrivateKeyField>
        </PrivateKeyWrapper>
        <ButtonsWrapper>
          <a href={paperWalletImage} download={`paper-wallet-0x${keystore.address.substr(0, 6)}`}>
            <StyledButton secondary={true} disabled={!paperWalletImage}>
              <PrinterImage src={printerIcon} />
              {translate('MAKE_BACKUP_PRINT_BUTTON')}
            </StyledButton>
          </a>
          <StyledButton onClick={onNext}>{translate('ACTION_6')}</StyledButton>
        </ButtonsWrapper>
        <HiddenPaperWallet>
          <PaperWallet
            address={keystore.address}
            privateKey={privateKey}
            ref={c => (this.paperWallet = c)}
          />
        </HiddenPaperWallet>
      </ExtendedContentPanel>
    );
  }
}
