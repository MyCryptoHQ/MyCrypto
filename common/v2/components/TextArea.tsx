import React, { HTMLProps } from 'react';
import classnames from 'classnames';

import './Input.scss';

interface State {
  hasBlurred: boolean;
  /**
   * @description when the input has not had any values inputted yet
   * e.g. "Pristine" condition
   */
  isStateless: boolean;
}

interface OwnProps extends HTMLProps<HTMLTextAreaElement> {
  isValid: boolean;
  showValidAsPlain?: boolean;
}

class TextArea extends React.Component<OwnProps, State> {
  public state: State = {
    hasBlurred: false,
    isStateless: true
  };

  public render() {
    const { showValidAsPlain, isValid, ...htmlProps } = this.props;
    const classname = classnames(
      this.props.className,
      'input-group-input',
      this.state.isStateless ? '' : isValid ? (showValidAsPlain ? '' : '') : `invalid`,
      this.state.hasBlurred && 'has-blurred'
    );

    return (
      <textarea
        {...htmlProps}
        onBlur={(e) => {
          this.setState({ hasBlurred: true });
          if (this.props && this.props.onBlur) {
            this.props.onBlur(e);
          }
        }}
        onChange={this.handleOnChange}
        className={classname}
      />
    );
  }

  private handleOnChange = (args: React.FormEvent<HTMLTextAreaElement>) => {
    if (this.state.isStateless) {
      this.setState({ isStateless: false });
    }
    if (this.props.onChange) {
      this.props.onChange(args);
    }
  };
}

export default TextArea;
