import React from 'react';
import classnames from 'classnames';

import { WalletName } from 'config';
import './WalletButton.scss';

interface OwnProps {
  name: string;
  description?: string;
  example?: string;
  walletType: WalletName;
  isSecure?: boolean;
  isDisabled?: boolean;
  disableReason?: string;
  onClick(walletType: string): void;
}

interface StateProps {
  isFormatDisabled?: boolean;
}

interface Icon {
  icon?: string;
  tooltip?: string;
  href?: string;
  arialabel?: string;
}

type Props = OwnProps & StateProps & Icon;

export class WalletButton extends React.PureComponent<Props> {
  public render() {
    const { name, icon, isSecure, isDisabled } = this.props;

    return (
      <div
        className={classnames({
          WalletButton: true,
          'WalletButton-main': !isSecure,
          'is-disabled': isDisabled
        })}
        onClick={this.handleClick}
        tabIndex={isDisabled ? -1 : 0}
        aria-disabled={isDisabled}
      >
        <div className="WalletButton-main-inner">
          {icon && <img className="WalletButton-main-title-icon" src={icon} alt={name + ' logo'} />}
          <div className="WalletButton-title">{name}</div>
        </div>
      </div>
    );
  }

  private handleClick = () => {
    if (this.props.isDisabled || this.props.isFormatDisabled) {
      return;
    }

    this.props.onClick(this.props.walletType);
  };
}
