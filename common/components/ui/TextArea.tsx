import React, { HTMLProps } from 'react';
import './Input.scss';

interface State {
  hasBlurred: boolean;
}

class TextArea extends React.Component<HTMLProps<HTMLTextAreaElement>, State> {
  public state: State = {
    hasBlurred: false
  };
  public render() {
    return (
      <textarea
        {...this.props}
        onBlur={e => {
          this.setState({ hasBlurred: true });
          if (this.props && this.props.onBlur) {
            this.props.onBlur(e);
          }
        }}
        className={`input-group-input form-control ${this.props.className} ${
          this.state.hasBlurred ? 'has-blurred' : ''
        }`}
      />
    );
  }
}

export default TextArea;
