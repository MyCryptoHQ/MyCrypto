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
        onBlur={e => {
          this.setState({ hasBlurred: true });
          if (this.props && this.props.onBlur) {
            this.props.onBlur(e);
          }
        }}
        className={`input-group-input  ${this.props.className} ${
          this.state.hasBlurred ? 'has-blurred' : ''
        } ${!!this.props.value && this.props.value.toString().length > 0 ? 'has-value' : ''}`}
      />
    );
  }
}

export default Input;
