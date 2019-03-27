import React, { Component } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Button } from '@mycrypto/ui';
import styled from 'styled-components';

import { ExtendedContentPanel } from 'v2/components';
import { Layout } from 'v2/features';
import { InputField } from '../components/InputField';

// Legacy
import desktopAppIcon from 'common/assets/images/icn-create-pw.svg';

const MainWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 18px 4px 26px 4px;
  text-align: center;
`;

const PrimaryButton = styled(Button)`
  width: 320px;
  margin-top: 10px;
  font-size: 18px;

  @media (min-width: 700px) {
    width: 420px;
  }
`;

const FormWrapper = styled.div`
  margin-top: 35px;
`;
type Props = RouteComponentProps<{}>;

export class ScreenLockNew extends Component<Props> {
  public state = { password1: '', password2: '', password1Error: '', password2Error: '' };

  public validateForm = () => {
    this.setState({ password1Error: '', password2Error: '' });
    const { password1, password2 } = this.state;
    const minLength = 8;

    if (password1.length > 0 && password1.length < minLength) {
      this.setState({ password1Error: 'Password must be at least 8 characters long' });
    }

    if (password1 !== password2) {
      if (password2.length > 0) {
        this.setState({ password2Error: "Passwords don't match" });
      }
    }
  };

  public onPassword1Changed = (event: any) => {
    this.setState({ password1: event.target.value });
  };

  public onPassword2Changed = (event: any) => {
    this.setState({ password2: event.target.value });
  };

  public render() {
    return (
      <Layout centered={true}>
        <ExtendedContentPanel
          onBack={this.props.history.goBack}
          heading="Create Password to Lock Your Wallet"
          description="We want to help you keep your funds safe! Please create a password so you can securly view your wallet when you come back to MyCrypto."
          image={desktopAppIcon}
          showImageOnTop={true}
          centered={true}
          className=""
        >
          <MainWrapper>
            <FormWrapper>
              <InputField
                label={'Password (min 8 characters)'}
                value={this.state.password1}
                onChange={this.onPassword1Changed}
                validate={this.validateForm}
                inputError={this.state.password1Error}
                type={'password'}
              />
              <InputField
                label={'Confirm password'}
                value={this.state.password2}
                onChange={this.onPassword2Changed}
                validate={this.validateForm}
                inputError={this.state.password2Error}
                type={'password'}
              />
              <PrimaryButton>Create Password</PrimaryButton>
            </FormWrapper>
          </MainWrapper>
        </ExtendedContentPanel>
      </Layout>
    );
  }
}

export default withRouter<Props>(ScreenLockNew);
