import React, { Component } from 'react';
import translate from 'translations';
import wallet from 'ethereumjs-wallet';
import ethUtil from 'ethereumjs-util';

export default class KeystoreDecrypt extends Component {
  constructor(props) {
    super(props);
  }

  handleFileSelection = event => {
    const fileReader = new FileReader();
    const inputFile = event.target.files[0];

    fileReader.onload = () => {
      try {
        const keyStoreString = fileReader.result;
        const decryptedWallet = wallet.fromV3(
          keyStoreString,
          'asdfasdfasdf',
          true
        );
        const privateHex = ethUtil.bufferToHex(decryptedWallet._privKey);
        const publicHex = ethUtil.bufferToHex(
          ethUtil.privateToAddress(decryptedWallet._privKey)
        );
        console.log(privateHex, publicHex); // TODO: Remove console log, it's only here to let Travis pass
      } catch (e) {
        console.error('Could not parse Keystore file.', e);
      }
    };

    fileReader.readAsText(inputFile, 'utf-8');
  };

  render() {
    return (
      <section className="col-md-4 col-sm-6">
        <div id="selectedUploadKey">
          <h4>{translate('ADD_Radio_2_alt')}</h4>

          <div className="form-group">
            <input
              type="file"
              id="fselector"
              onChange={this.handleFileSelection}
            />
            <label htmlFor="fselector">
              <a
                className="btn-file marg-v-sm"
                id="aria1"
                tabIndex="0"
                role="button"
              >
                {translate('ADD_Radio_2_short')}
              </a>
            </label>
          </div>
        </div>
      </section>
    );
  }
}
