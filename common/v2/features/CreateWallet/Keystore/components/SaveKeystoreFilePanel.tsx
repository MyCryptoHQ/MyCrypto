import React, { Component } from 'react';
import { Button, Typography } from '@mycrypto/ui';
import styled from 'styled-components';

import { ExtendedContentPanel } from 'v2/components';
import { InlineErrorMsg } from 'v2/components/ErrorMessages/InlineErrors';
import { PanelProps } from '../../CreateWallet';
import translate, { translateRaw } from 'translations';
import keystoreIcon from 'common/assets/images/icn-keystore.svg';

import downloadIcon from 'common/assets/images/icn-download.svg';

const DownloadImage = styled.embed`
  width: 16px;
  height: 16px;
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

const ErrorWrapper = styled.div`
  margin-bottom: 26px;
`;

interface Props extends PanelProps {
  filename: string;
  getKeystoreBlob(): string;
}

interface State {
  downloaded: boolean;
  error: boolean;
}

export default class SaveKeystorePanel extends Component<Props, State> {
  public state: State = {
    downloaded: false,
    error: false
  };

  public handleNextClick = () => {
    const { onNext } = this.props;
    this.setState({ error: false });

    if (!this.state.downloaded) {
      this.setState({ error: true });
    } else {
      onNext();
    }
  };

  public render() {
    const { onBack, totalSteps, currentStep, getKeystoreBlob, filename } = this.props;
    return (
      <ExtendedContentPanel
        onBack={onBack}
        stepper={{
          current: currentStep,
          total: totalSteps
        }}
        heading={translateRaw('SAVE_KEYSTORE_TITLE')}
      >
        <ImageWrapper>
          <img src={keystoreIcon} />
        </ImageWrapper>

        <DescriptionItem>{translate('SAVE_KEYSTORE_DESCRIPTION_1')}</DescriptionItem>
        <DescriptionItem>{translate('SAVE_KEYSTORE_DESCRIPTION_2')}</DescriptionItem>
        <DescriptionItem>{translate('SAVE_KEYSTORE_DESCRIPTION_3')}</DescriptionItem>

        <ButtonsWrapper>
          {this.state.error && (
            <ErrorWrapper>
              <InlineErrorMsg>{'Please download the keystore file.'}</InlineErrorMsg>
            </ErrorWrapper>
          )}

          <a href={getKeystoreBlob()} download={filename}>
            <StyledButton
              onClick={() => this.setState({ downloaded: true, error: false })}
              secondary={true}
            >
              <DownloadImage src={downloadIcon} />
              {translate('SAVE_KEYSTORE_BUTTON')}
            </StyledButton>
          </a>
          <StyledButton onClick={this.handleNextClick}>{translate('ACTION_6')}</StyledButton>
        </ButtonsWrapper>
      </ExtendedContentPanel>
    );
  }
}
