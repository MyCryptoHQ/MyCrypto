import * as React from 'react';

type Callback = (value) => void;

interface Props {
  // Actions
  onChange: Callback;
  // Props
  hasUnitDropdown?: boolean;
}

interface State {
  value: string;
}

export class Phrase extends React.Component<Props, State> {
  public state = {
    value: ''
  };

  public onChange = e => {
    this.setState({
      value: e.target.value
    });
    if (this.props.onChange) {
      this.props.onChange(e.target.value);
    }
  };

  public render() {
    return (
      <section className="form-group">
        <label>Secret Phrase</label>
        <em className="col-xs-12">
          <small>You must remember this to claim your name later.</small>
        </em>
        <section className="input-group col-xs-12">
          <input
            type="text"
            className="form-control"
            value={this.state.value}
            onChange={this.onChange}
            placeholder="tide kitten pool"
          />
        </section>
      </section>
    );
  }
}
