import React from 'react';
import { generateMnemonic } from 'bip39';
import AcceptOrRedirectModal from 'components/AcceptOrRedirectModal';

export default class Mnemonic extends React.Component<any, any> {
  public render() {
    return (
      <div>
        <AcceptOrRedirectModal
          revertPath={'http://localhost:3000/generate/keystore'}
          title={'Advanced Wallet Generation'}
          description={<h1>Mnemonic Wallet Generation is for advanced users only!</h1>}
          onConfirm={this.props.onConfirm}
        >
          <h1>{generateMnemonic()}</h1>
        </AcceptOrRedirectModal>
      </div>
    );
  }
}
