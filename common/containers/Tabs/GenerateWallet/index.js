import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as generateWalletActions from 'actions/generateWallet';
import PropTypes from 'prop-types';
import EnterPassword from './components/EnterPassword';
import SaveWallet from './components/SaveWallet';
import PaperWallet from './components/PaperWallet';

class GenerateWallet extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    // state
    activeStep: PropTypes.string,
    generateWalletPassword: PropTypes.object,
    hasDownloadedWalletFile: PropTypes.bool,
    generateWalletFile: PropTypes.bool,
    canProceedToPaper: PropTypes.bool,
    keyStore: PropTypes.object,
    // actions
    showPasswordGenerateWallet: PropTypes.func,
    generateFileGenerateWallet: PropTypes.func,
    downloadFileGenerateWallet: PropTypes.func,
    confirmContinueToPaperGenerateWallet: PropTypes.func
  };

  render() {
    const { activeStep } = this.props;
    let content;

    switch (activeStep) {
      case 'password':
        content = <EnterPassword {...this.props} />;
        break;

      case 'download':
        content = <SaveWallet {...this.props} />;
        break;

      case 'paper':
        content = <PaperWallet {...this.props} privateKey="Implement me" />;
        break;

      default:
        content = <h1>Uh oh. Not sure how you got here.</h1>;
    }

    return (
      <section className="container" style={{ minHeight: '50%' }}>
        <div className="tab-content">
          <main className="tab-pane active text-center" role="main">
            <section role="main" className="row">
              <br />
              {content}
            </section>
          </main>
        </div>
      </section>
    );
  }
}

function mapStateToProps(state) {
  return {
    generateWalletPassword: state.form.generateWalletPassword,
    activeStep: state.generateWallet.activeStep,
    generateWalletFile: state.generateWallet.generateWalletFile,
    hasDownloadedWalletFile: state.generateWallet.hasDownloadedWalletFile,
    canProceedToPaper: state.generateWallet.canProceedToPaper,
    keyStore: state.generateWallet.keyStore
  };
}

export default connect(mapStateToProps, generateWalletActions)(GenerateWallet);
