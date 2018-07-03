import React from 'react';
import './index.scss';
import { Input, Spinner } from 'components/ui';
import { searchPK } from 'libs/web-workers';
import { isValidPrivKey, isValidETHAddress } from 'libs/validators';

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
      content = (
        <div>
          <Spinner size="x3" />
        </div>
      );
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
              <Input
                value={pk}
                type="text"
                onChange={this.onChange}
                isValid={isValidPrivKey(pk)}
                name="pk"
              />
            </label>

            <label className="input-group">
              <div className="input-group-header">Address You Sent To</div>
              <Input
                value={address}
                type="text"
                onChange={this.onChange}
                isValid={isValidETHAddress(address)}
                name="address"
              />
            </label>

            <button
              className="btn btn-primary"
              onClick={this.searchPK}
              disabled={!isValidPrivKey(pk) || !isValidETHAddress(address)}
            >
              Start the Search!
            </button>

            <div className="pk-resolve">{content}</div>
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

    const basePrivateKey = pk.replace('0x', '');

    result.status = 'loading';

    this.setState({
      ...this.state,
      result
    });

    searchPK(basePrivateKey, address)
      .then(foundPK => {
        result.status = 'ok';
        result.pk = foundPK;

        this.setState({
          ...this.state,
          result
        });
      })
      .catch(() => {
        result.status = 'error';

        this.setState({
          ...this.state,
          result
        });
      });
  };
}
