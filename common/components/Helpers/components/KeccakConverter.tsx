import React from 'react';
import { toKeccak } from 'utils/formatters';
import { Input } from 'components/ui';

interface State {
  hashInput: string;
  hashOutput: string;
}

export default class KeccakConverter extends React.Component<{}, State> {
  public state: State = {
    hashInput: 'hello',
    hashOutput: toKeccak('hello')
  };

  public render() {
    return (
      <div className="Helper">
        <h1 className="Helper-title">"SHA3" (Keccak-256) It!</h1>
        <div className="form-group">
          <label>Input</label>
          <Input value={this.state.hashInput} type="text" onChange={this.onChange} />
          <label>Output</label>
          <Input value={this.state.hashOutput} type="text" readOnly={true} />
        </div>
      </div>
    );
  }

  private onChange = (event: any) => {
    const nextValue = event.currentTarget.value === undefined ? '' : event.currentTarget.value;

    this.setState({
      hashInput: nextValue,
      hashOutput: toKeccak(nextValue)
    });
  };
}
