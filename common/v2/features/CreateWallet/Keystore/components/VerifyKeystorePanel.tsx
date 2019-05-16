import React, { Component } from 'react';
import { Button, Textarea, Input } from '@mycrypto/ui';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import styled from 'styled-components';

import { ExtendedContentPanel } from 'v2/components';
import { PanelProps } from '../../CreateWallet';
import translate, { translateRaw } from 'translations';

const ButtonsWrapper = styled.div`
  margin-top: 48px;
  display: flex;
  flex-direction: column;
`;
const StyledButton = styled(Button)`
  font-size: 18px;
  margin-bottom: 16px;
  width: 100%;

  :disabled {
    opacity: 0.45;
  }
`;

const FormItemWrapper = styled.div`
  font-size: 20px;
  margin-top: 28px;
`;

const StyledTextArea = styled(Textarea)`
  font-size: 18px;
  resize: none;
  width: 100%;
  height: 75px;
  margin-top: 8px;
  padding: 8px 18px;
`;

const Divider = styled.div`
  margin-top: 28px;
  margin-bottom: 22px;
  width: 100%;
  text-align: center;
  font-size: 20px;
  color: ${props => props.theme.headline};
`;

const FileName = styled.div`
  color: #999;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  font-size: 18px;
`;

const UploadZone = styled.label`
  width: 100%;
  font-size: 13px;
  text-transform: uppercase;
  border: solid 1px #e5ecf3;
  background-color: rgba(247, 247, 247, 0.4);
  word-wrap: break-word;
  padding: 16px 4px;
  margin-top: 8px;
  text-align: center;
  cursor: pointer;
`;

interface ExtendedProps extends PanelProps {
  privateKey: string;
  verifyKeystore(keystore: string, password: string): Promise<boolean>;
  verifyPrivateKey(key: string, password: string): boolean;
}

type Props = ExtendedProps & RouteComponentProps<{}>;

class VerifyKeystorePanel extends Component<Props> {
  public state = {
    validating: false,
    isValid: false,
    keystore: null,
    password: '',
    privateKey: '',
    fileName: ''
  };

  public validating = false;

  public validate = async () => {
    const { verifyKeystore, verifyPrivateKey, privateKey: generatedPrivateKey } = this.props;
    const { keystore, password, privateKey } = this.state;
    this.validating = true;

    if (keystore) {
      const isValid = await verifyKeystore(keystore, password);
      this.setState({ isValid });
    } else if (privateKey) {
      const isValid = verifyPrivateKey(privateKey, password) && generatedPrivateKey === privateKey;
      this.setState({ isValid });
    }

    this.validating = false;
  };

  public handleFileDrop = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target || !e.target.files) {
      return;
    }

    const fileReader = new FileReader();
    fileReader.readAsText(e.target.files[0], 'UTF-8');
    this.setState({ fileName: e.target.files[0].name });

    fileReader.onload = () => {
      this.setState({ keystore: fileReader.result }, () => this.validate());
    };
  };

  public handlePasswordInputChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ password: e.target.value }, () => this.validate());
  };

  public handlePrivateKeyInputChanged = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    this.setState({ privateKey: e.target.value }, () => this.validate());
  };

  public render() {
    const { history, onBack, totalSteps, currentStep } = this.props;

    return (
      <ExtendedContentPanel
        onBack={onBack}
        stepper={{
          current: currentStep,
          total: totalSteps
        }}
        heading={translateRaw('VERIFY_KEYSTORE_TITLE')}
        description={translateRaw('VERIFY_KEYSTORE_DESCRIPTION')}
        className="SaveKeystoreFilePanel"
      >
        <FormItemWrapper>
          {translate('YOUR_PRIVATE_KEY_LABEL')}
          <StyledTextArea onChange={this.handlePrivateKeyInputChanged} />
        </FormItemWrapper>
        <Divider>- {translateRaw('OR')} -</Divider>
        <FormItemWrapper>
          {translate('YOUR_KEYSTORE_LABEL')}

          <UploadZone htmlFor="dropzone">{translateRaw('UPLOAD_KEYSTORE_LABEL')}</UploadZone>
          {this.state.fileName && <FileName>{this.state.fileName}</FileName>}
          <input type="file" id="dropzone" onChange={this.handleFileDrop} style={{ opacity: 0 }} />
        </FormItemWrapper>
        <FormItemWrapper>
          {translate('INPUT_PASSWORD_LABEL')}
          <Input icon="showNetworks" iconSide="right" onChange={this.handlePasswordInputChanged} />
        </FormItemWrapper>
        <ButtonsWrapper>
          <StyledButton
            disabled={!this.state.isValid}
            onClick={() => history.replace('/dashboard')}
          >
            {translate('DONE_AND_RETURN_LABEL')}
          </StyledButton>
        </ButtonsWrapper>
      </ExtendedContentPanel>
    );
  }
}

export default withRouter(VerifyKeystorePanel);
