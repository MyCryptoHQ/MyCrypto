import React, { Component } from 'react';
import PropTypes from 'prop-types';
import translate from 'translations';

export default class SaveWallet extends Component {
  static propTypes = {
    // Store state
    walletFile: PropTypes.object.isRequired,
    hasDownloadedWalletFile: PropTypes.bool,
    // Actions
    downloadUTCGenerateWallet: PropTypes.func,
    confirmContinueToPaperGenerateWallet: PropTypes.func
  };

  render() {
    const {
      walletFile,
      hasDownloadedWalletFile,
      downloadUTCGenerateWallet,
      confirmContinueToPaperGenerateWallet
    } = this.props;

    return (
      <div>
        <h1>
          {translate('GEN_Label_2')}
        </h1>
        <br />
        <div className="col-sm-8 col-sm-offset-2">
          <div aria-hidden="true" className="account-help-icon">
            <img
              src="https://myetherwallet.com/images/icon-help.svg"
              className="help-icon"
            />
            <p className="account-help-text">
              {translate('x_KeystoreDesc')}
            </p>
            <h4>
              {translate('x_Keystore2')}
            </h4>
          </div>
          <a
            role="button"
            className="btn btn-primary btn-block"
            aria-label="Download Keystore File (UTC / JSON · Recommended · Encrypted)"
            aria-describedby="x_KeystoreDesc"
            download={walletFile.fileName}
            href={walletFile.blobURI}
            onClick={downloadUTCGenerateWallet}
          >
            {translate('x_Download')}
          </a>
          <p className="sr-only" id="x_KeystoreDesc">
            {translate('x_KeystoreDesc')}
          </p>
          <br />
          <br />
          <br />
          <br />
        </div>
        <div className="col-xs-12 alert alert-danger">
          <span>
            MyEtherWallet.com is not a web wallet &amp; does not store or
            transmit this secret information at any time. <br />
            <strong>
              If you do not save your wallet file and password, we cannot
              recover them.
            </strong>
            <br />
            Save your wallet file now &amp; back it up in a second location (not
            on your computer).
            <br />
            <br />
            <a
              role="button"
              className={`btn btn-info ${hasDownloadedWalletFile
                ? ''
                : 'disabled'}`}
              onClick={() => confirmContinueToPaperGenerateWallet()}
            >
              I understand. Continue.
            </a>
          </span>
        </div>
      </div>
    );
  }
}
