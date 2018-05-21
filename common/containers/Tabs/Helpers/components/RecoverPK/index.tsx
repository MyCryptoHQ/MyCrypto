import React from 'react';
import './index.scss';
import { Input, Spinner } from 'components/ui';
import { fromPrivateKey } from 'ethereumjs-wallet';
import { toBuffer } from 'ethereumjs-util';

interface Result {
  pk: string;
  status: string;
}

interface State {
  pk: string;
  address: string;
  result: Result;
}

export default class RecoverPK extends React.Component<State> {
  public state = {
    pk: '',
    address: '',
    result: {
      pk: '',
      status: ''
    }
  };

  public render() {
    const { pk, address, result } = this.state;
    let content = null;

    if (result.status === 'ok') {
      content = (
        <div>
          <label className="input-group">
            <div className="input-group-header">Actual Private Key</div>
            <Input value={result.pk} type="text" isValid={true} name="actualPK" readOnly={true} />
          </label>
          <ul className="recover-pk-list">
            <li style={{ color: 'red' }}>Consider yourself very very lucky.</li>
            <li>Now you need to create a new secure wallet and move all funds to it.</li>
            <li>
              In order to prevent the same thing from happening, please make sure your address you
              are sending to matches the address on your paper wallet.
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
        </div>
      );
    }

    if (result.status === 'error') {
      content = <p className="error-text">Sorry, Private Key not found :(</p>;
    }

    if (result.status === 'loading') {
      content = <Spinner size="x3" />;
    }

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

            {content}
          </div>
        </section>
      </div>
    );
  }

  private onChange = (event: React.FormEvent<HTMLInputElement>) => {
    const currentState: any = { ...this.state };

    currentState[event.currentTarget.name] = event.currentTarget.value;
    currentState.result = {
      pk: '',
      status: ''
    };

    this.setState(currentState);
  };

  private searchPK = () => {
    const { address, pk, result } = this.state;
    const targetPublicAddress = address;
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

    let basePrivateKey = pk;
    basePrivateKey =
      basePrivateKey.substring(0, 2) === '0x' ? basePrivateKey.substring(2) : basePrivateKey;

    let wallet;

    function* guessPK() {
      for (const idx of Object.keys(basePrivateKey.split(''))) {
        for (const character of characters) {
          const pkArray = basePrivateKey.split('');
          pkArray.splice(Number(idx), 0, character);
          const privateKeyGuess = pkArray.join('');

          try {
            wallet = fromPrivateKey(toBuffer('0x' + privateKeyGuess));
          } catch (error) {
            wallet = null;
          }

          if (wallet) {
            const publicAddress = wallet.getAddressString();

            if (publicAddress.toLowerCase() === targetPublicAddress.toLowerCase()) {
              result.status = 'ok';
              result.pk = privateKeyGuess;
            }
          }

          yield result;
        }
      }

      if (!result.pk) {
        result.status = 'error';
      }

      yield result;
    }

    if (basePrivateKey.length === 63) {
      result.status = 'loading';

      this.setState({
        ...this.state,
        result
      });

      let newResult = { ...result };
      const gen = guessPK();

      while (newResult.status === 'loading') {
        newResult = gen.next().value;
      }
    }

    this.setState({
      ...this.state,
      result
    });
  };
}
