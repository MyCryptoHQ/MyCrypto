import { Component, FormEvent, HTMLProps, WheelEvent } from 'react';

import classnames from 'classnames';
import './Input.scss';

interface OwnProps extends HTMLProps<HTMLInputElement> {
  isValid?: boolean;
  showInvalidBeforeBlur?: boolean;
  showInvalidWithoutValue?: boolean;
  showValidAsPlain?: boolean;
  setInnerRef?(ref: HTMLInputElement | null): void;
}

interface State {
  hasBlurred: boolean;
  /**
   * @description when the input has not had any values inputted yet
   * e.g. "Pristine" condition
   */
  isStateless: boolean;
}

type Props = OwnProps & HTMLProps<HTMLInputElement>;

class Input extends Component<Props, State> {
  public state: State = {
    hasBlurred: false,
    isStateless: true
  };

  public render() {
    const {
      setInnerRef,
      showInvalidBeforeBlur,
      showInvalidWithoutValue,
      showValidAsPlain,
      isValid,
      ...htmlProps
    } = this.props;
    const { hasBlurred, isStateless } = this.state;
    const hasValue = !!this.props.value && this.props.value.toString().length > 0;

    // Currently we don't ever highlight valid, so go empty string instead
    let validClass = isValid ? '' : 'invalid';
    if (isStateless) {
      validClass = '';
    }
    if (!hasValue && !showInvalidWithoutValue) {
      validClass = '';
    } else if (!hasBlurred && !showInvalidBeforeBlur) {
      validClass = '';
    }
    if ((!isStateless || showInvalidBeforeBlur) && !hasValue && showInvalidWithoutValue) {
      validClass = 'invalid';
    }

    const classname = classnames('input-group-input', this.props.className, validClass);

    return (
      <input
        {...htmlProps}
        ref={(node) => setInnerRef && setInnerRef(node)}
        onBlur={(e) => {
          this.setState({ hasBlurred: true });
          if (this.props && this.props.onBlur) {
            this.props.onBlur(e);
          }
        }}
        onChange={this.handleOnChange}
        onWheel={this.props.type === 'number' ? this.preventNumberScroll : undefined}
        className={classname}
      />
    );
  }

  private handleOnChange = (args: FormEvent<HTMLInputElement>) => {
    if (this.state.isStateless) {
      this.setState({ isStateless: false });
    }
    if (this.props.onChange) {
      this.props.onChange(args);
    }
  };
  // When number inputs are scrolled on while in focus, the number changes. So we blur
  // it if it's focused to prevent that behavior, without preventing the scroll.
  private preventNumberScroll(ev: WheelEvent<HTMLInputElement>) {
    if (document.activeElement === ev.currentTarget) {
      ev.currentTarget.blur();
    }
  }
}

export default Input;
