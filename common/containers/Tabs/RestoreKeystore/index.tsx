import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AppState } from 'reducers';
import TabSection from 'containers/TabSection';
import KeystoreDetails from './components/KeystoreDetails';
import DownloadKeystore from './components/DownloadKeystore';
import { UtcKeystore } from 'libs/keystore';
import {
  TRestoreKeystoreFromWallet,
  restoreKeystoreFromWallet
} from 'actions/restoreKeystore';

interface Props {
  // Redux state
  activeStep: string;
  keystoreFile: Promise<UtcKeystore> | null | undefined;
  //Actions
  generateKeystore: TRestoreKeystoreFromWallet;
}

class RestoreKeystore extends Component<Props, {}> {
  public render() {
    const { activeStep } = this.props;
    let content;
    switch (activeStep) {
      case 'password':
        content = (
          <KeystoreDetails generateKeystore={this.props.generateKeystore} />
        );
        break;
      case 'download':
        content = <DownloadKeystore keystoreFile={this.props.keystoreFile} />;
    }
    return <TabSection>{content}</TabSection>;
  }
}

const mapStateToProps = (state: AppState) => ({
  activeStep: state.restoreKeystore.activeStep,
  keystoreFile: state.restoreKeystore.keystoreFile
});

export default connect(mapStateToProps, {
  generateKeystore: restoreKeystoreFromWallet
})(RestoreKeystore);
