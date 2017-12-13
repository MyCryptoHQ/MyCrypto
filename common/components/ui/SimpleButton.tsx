import React, { Component } from 'react';
import Spinner from './Spinner';

const DEFAULT_BUTTON_TYPE = 'primary';
const DEFAULT_BUTTON_SIZE = 'lg';

type ButtonType = 'default' | 'primary' | 'success' | 'info' | 'warning' | 'danger';
type ButtonSize = 'lg' | 'sm' | 'xs';

interface Props {
  text: React.ReactElement<any> | string;
  loading?: boolean;
  disabled?: boolean;
  loadingText?: string;
  size?: ButtonSize;
  type?: ButtonType;
  onClick(): any;
}

export default class SimpleButton extends Component<Props, {}> {
  public computedClass = () => {
    return `btn btn-${this.props.size || DEFAULT_BUTTON_TYPE} btn-${this.props.type ||
      DEFAULT_BUTTON_SIZE}`;
  };

  public render() {
    const { loading, disabled, loadingText, text, onClick } = this.props;
    return (
      <div>
        <button onClick={onClick} disabled={loading || disabled} className={this.computedClass()}>
          {loading ? (
            <div>
              <Spinner /> {loadingText || text}
            </div>
          ) : (
            <div>{text}</div>
          )}
        </button>
      </div>
    );
  }
}
