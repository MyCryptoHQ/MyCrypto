import React, { Component } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Button } from '@mycrypto/ui';
import styled from 'styled-components';

import { ExtendedContentPanel } from 'v2/components';
import { Layout } from 'v2/features';

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
  color: ${props => props.theme.text};

  @media (max-width: 700px) {
    padding: 0 8px;
  }
`;

type Props = RouteComponentProps<{}>;

export class ScreenLockForgotPassword extends Component<Props> {
  public render() {
    return (
      <Layout centered={true}>
        <ExtendedContentPanel
          onBack={this.props.history.goBack}
          heading="Forgot Screen Lock Password?"
          description="Unlike the traditional, centralized web, we cannot recover your password."
          image={mainImage}
          showImageOnTop={true}
          centered={true}
          className=""
        >
          <AditionalDescription>
            You can import your MyCrypto Settings to regain access to your wallet. If you don't have
            your MyCrypto Settings, you can start from scratch and re-import your accounts.
          </AditionalDescription>
          <FormWrapper>
            <ActionButton>Import Wallet Settings</ActionButton>
            <ActionButton>Start Over & Import an Account</ActionButton>
          </FormWrapper>
        </ExtendedContentPanel>
      </Layout>
    );
  }
}

export default withRouter<Props>(ScreenLockForgotPassword);
