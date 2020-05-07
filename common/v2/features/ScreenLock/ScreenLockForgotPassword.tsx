import React, { Component } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import styled from 'styled-components';
import { Button } from '@mycrypto/ui';

import translate, { translateRaw } from 'v2/translations';
import { ExtendedContentPanel } from 'v2/components';
import { AnalyticsService, ANALYTICS_CATEGORIES } from 'v2/services';

import mainImage from 'common/assets/images/icn-forgot-password.svg';

const ActionButton = styled(Button)`
  width: 320px;
  margin-top: 10px;
  font-size: 18px;
  padding-left: 5px;
  padding-right: 5px;

  @media (min-width: 700px) {
    width: 420px;
  }
`;

const FormWrapper = styled.div`
  margin: 14px 0;
`;

const AditionalDescription = styled.p`
  font-size: 18px;
  font-weight: normal;
  margin-top: 28px;
  line-height: 1.5;
  padding: 0 30px;
  color: ${(props) => props.theme.text};

  @media (max-width: 700px) {
    padding: 0 8px;
  }
`;

type Props = RouteComponentProps<{}>;

class ScreenLockForgotPassword extends Component<Props> {
  public handleImportWalletSettingsClick = () => {
    AnalyticsService.instance.track(
      ANALYTICS_CATEGORIES.SCREEN_LOCK,
      'Import Wallet Settings button clicked'
    );
  };

  public handleStartOverClick = () => {
    AnalyticsService.instance.track(ANALYTICS_CATEGORIES.SCREEN_LOCK, 'Start Over button clicked');
  };

  public render() {
    return (
      <ExtendedContentPanel
        onBack={this.props.history.goBack}
        heading={translateRaw('SCREEN_LOCK_FORGOT_PASSWORD_HEADING')}
        description={translateRaw('SCREEN_LOCK_FORGOT_PASSWORD_DESCRIPTION')}
        image={mainImage}
        showImageOnTop={true}
        centered={true}
        className=""
      >
        <AditionalDescription>
          {translate('SCREEN_LOCK_FORGOT_PASSWORD_ADDITIONAL_DESCRIPTION')}
        </AditionalDescription>
        <FormWrapper>
          <ActionButton onClick={this.handleImportWalletSettingsClick}>
            {translate('SCREEN_LOCK_FORGOT_PASSWORD_ADDITIONAL_IMPORT')}
          </ActionButton>
          <ActionButton onClick={this.handleStartOverClick}>
            {translate('SCREEN_LOCK_FORGOT_PASSWORD_ADDITIONAL_START_OVER')}
          </ActionButton>
        </FormWrapper>
      </ExtendedContentPanel>
    );
  }
}

export default withRouter(ScreenLockForgotPassword);
