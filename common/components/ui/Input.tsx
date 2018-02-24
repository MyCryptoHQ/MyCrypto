import React, { HTMLProps } from 'react';
import './Input.scss';

interface State {
  hasBlurred: boolean;
}

class Input extends React.Component<HTMLProps<HTMLInputElement>, State> {
  public state: State = {
    hasBlurred: false
  };
  public render() {
    return (
      <input
        {...this.props}
        onBlur={() => this.setState({ hasBlurred: true })}
        className={`input-group-input  ${this.props.className} ${
          this.state.hasBlurred ? 'has-blurred' : ''
        }`}
      />
    );
  }
}

export default Input;
