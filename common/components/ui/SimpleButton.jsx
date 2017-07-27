// @flow
import React, { Component } from 'react';

const DEFAULT_BUTTON_TYPE = 'primary';
const DEFAULT_BUTTON_SIZE = 'lg';

type buttonType =
  | 'default'
  | 'primary'
  | 'success'
  | 'info'
  | 'warning'
  | 'danger';
type buttonSize = 'lg' | 'sm' | 'xs';

type Props = {
  onClick: () => any,
  loading: boolean,
  disabled: boolean,
  text: string,
  loadingText: string,
  size: buttonSize,
  type: buttonType
};

const Spinner = () => {
  return <i className="fa fa-spinner fa-spin fa-fw" />;
};

export default class SimpleButton extends Component {
  props: Props;

  computedClass = () => {
    return `btn btn-${this.props.size || DEFAULT_BUTTON_TYPE} btn-${this.props
      .type || DEFAULT_BUTTON_SIZE}`;
  };

  render() {
    let { loading, disabled, loadingText, text, onClick } = this.props;

    return (
      <div>
        <button
          onClick={onClick}
          disabled={loading || disabled}
          className={this.computedClass()}
        >
          {loading
            ? <div>
                <Spinner />
                {`  ${loadingText || text}`}
              </div>
            : <div>
                {text}
              </div>}
        </button>
      </div>
    );
  }
}
