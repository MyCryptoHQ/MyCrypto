import React, { HTMLProps } from 'react';
import classnames from 'classnames';

import './Input.scss';

interface State {
  hasBlurred: boolean;
}

interface OwnProps extends HTMLProps<HTMLTextAreaElement> {
  isValid: boolean;
  showValidAsPlain?: boolean;
}

class TextArea extends React.Component<OwnProps, State> {
  public state: State = {
    hasBlurred: false
  };

  public render() {
    const classname = classnames(
      this.props.className,
      'input-group-input',
      'form-control',
      this.props.isValid
        ? this.props.showValidAsPlain ? '' : `is-valid valid`
        : `is-invalid invalid`,
      this.state.hasBlurred && 'has-blurred'
    );

    return (
      <textarea
        {...this.props}
        onBlur={e => {
          this.setState({ hasBlurred: true });
          if (this.props && this.props.onBlur) {
            this.props.onBlur(e);
          }
        }}
        className={classname}
      />
    );
  }
}

export default TextArea;
