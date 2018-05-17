import React from 'react';
import './index.scss';
import { Input } from 'components/ui';
import ethUtil from 'ethereumjs-util';

interface State {
  input: string;
  output: string;
}

export default class ConvertSHA3 extends React.Component<State> {
  public state = {
    input: 'welcome to MyCrypto',
    output: ''
  };

  public componentDidMount() {
    this.calcOutput(this.state.input);
  }

  public render() {
    const { input, output } = this.state;

    return (
      <div className="Tab-content">
        <section className="Tab-content-pane">
          <div className="Helpers">
            <h1>"SHA3" (Keccak-256) It!</h1>
            <h2>
              <a href="https://ethereum.stackexchange.com/questions/550/which-cryptographic-hash-function-does-ethereum-use">
                yooo... sha3 !== Keccak-256?!
              </a>
            </h2>

            <label className="input-group">
              <div className="input-group-header">Input</div>
              <Input value={input} type="text" onChange={this.onChange} isValid={true} />
            </label>

            <label className="input-group">
              <div className="input-group-header">Output</div>
              <Input value={output} type="text" isValid={true} readOnly={true} />
            </label>
          </div>
        </section>
      </div>
    );
  }

  private onChange = (event: React.FormEvent<HTMLInputElement>) => {
    this.calcOutput(event.currentTarget.value);
  };

  private calcOutput(value: string) {
    const currentState = { ...this.state };

    currentState.input = value;
    currentState.output = ethUtil.sha3(value).toString('hex');

    this.setState(currentState);
  }
}
