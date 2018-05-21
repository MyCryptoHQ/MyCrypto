import React from 'react';
import './index.scss';
import { Input } from 'components/ui';
import { fromPrivateKey } from 'ethereumjs-wallet';
import { toBuffer } from 'ethereumjs-util';

const sorryPhrase = 'Sorry not found :(';

interface State {
  pk: string;
  address: string;
  actualPK: string;
}

export default class RecoverPK extends React.Component<State> {
  public state = {
    pk: '',
    address: '',
    actualPK: ''
  };

  public render() {
    const { pk, address, actualPK } = this.state;

    return (
      <div className="Tab-content">
        <section className="Tab-content-pane">
          <div className="Helpers">
            <h1>Mistyped Private Key</h1>
            <label className="input-group">
              <div className="input-group-header">
                Private Key that isn't unlocking correct address
              </div>
              <Input value={pk} type="text" onChange={this.onChange} isValid={true} name="pk" />
            </label>

            <label className="input-group">
              <div className="input-group-header">Address You Sent To</div>
              <Input
                value={address}
                type="text"
                onChange={this.onChange}
                isValid={true}
                name="address"
              />
            </label>

            <button className="btn btn-primary" onClick={this.searchPK}>
              Start the Search!
            </button>

            {actualPK ? (
              <label className="input-group">
                <div className="input-group-header">Actual Private Key</div>
                <Input
                  value={actualPK}
                  type="text"
                  isValid={true}
                  name="actualPK"
                  readOnly={true}
                />
              </label>
            ) : (
              ''
            )}

            {actualPK && actualPK !== sorryPhrase ? (
              <ul className="recover-pk-list">
                <li style={{ color: 'red' }}>Consider yourself very very lucky.</li>
                <li>Now you need to create a new secure wallet and move all funds to it.</li>
                <li>
                  In order to prevent the same thing from happening, please make sure your address
                  you are sending to matches the address on your paper wallet.
                </li>
                <li>
                  <a href="https://support.mycrypto.com/getting-started/creating-a-new-wallet-on-mycrypto.html">
                    Read this guide for more information.
                  </a>
                </li>
                <li>
                  <a href="https://support.mycrypto.com/getting-started/protecting-yourself-and-your-funds.html">
                    Learn how to protect yourself and your funds.
                  </a>
                </li>
              </ul>
            ) : (
              ''
            )}
          </div>
        </section>
      </div>
    );
  }

  private onChange = (event: React.FormEvent<HTMLInputElement>) => {
    const currentState: any = { ...this.state };

    currentState[event.currentTarget.name] = event.currentTarget.value;
    currentState.actualPK = '';

    this.setState(currentState);
  };

  private searchPK = () => {
    const targetPublicAddress = this.state.address;
    const characters = [
      'a',
      'b',
      'c',
      'd',
      'e',
      'f',
      '0',
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9'
    ];

    let basePrivateKey = this.state.pk;
    basePrivateKey =
      basePrivateKey.substring(0, 2) == '0x' ? basePrivateKey.substring(2) : basePrivateKey;

    let wallet;
    let actualPK;
    for (let keyPosition = 0; keyPosition <= basePrivateKey.length; keyPosition++) {
      for (let character = 0; character < characters.length; character++) {
        let pkArray = basePrivateKey.split('');
        pkArray.splice(keyPosition, 0, characters[character]);
        let privateKeyGuess = pkArray.join('');

        try {
          wallet = fromPrivateKey(toBuffer('0x' + privateKeyGuess));
        } catch (error) {
          wallet = null;
        }

        if (wallet) {
          let publicAddress = wallet.getAddressString();

          if (publicAddress.toLowerCase() == targetPublicAddress.toLowerCase()) {
            actualPK = privateKeyGuess;
          }
        }
      }
    }

    if (!actualPK) actualPK = sorryPhrase;

    this.setState({
      ...this.state,
      actualPK
    });
  };
}
