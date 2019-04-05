import React from 'react';
import classnames from 'classnames';

import { WalletName } from 'config';
import { Tooltip } from 'components/ui';
import './WalletButton.scss';
import { Typography } from '@mycrypto/ui';

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
    const { name, description, example, icon, isSecure, isDisabled, disableReason } = this.props;

    return (
      <div
        className={classnames({
          WalletButton: true,
          'WalletButton--small': !isSecure,
          'is-disabled': isDisabled
        })}
        onClick={this.handleClick}
        tabIndex={isDisabled ? -1 : 0}
        aria-disabled={isDisabled}
      >
        <div className="WalletButton-inner">
          {icon && <img className="WalletButton-title-icon" src={icon} alt={name + ' logo'} />}
          <div className="WalletButton-title">
            <Typography>{name}</Typography>
          </div>

          {description && (
            <div className="WalletButton-description" aria-label="description">
              {description}
            </div>
          )}
          {example && (
            <div className="WalletButton-example" aria-label="example" aria-hidden={true}>
              {example}
            </div>
          )}

          {isDisabled && disableReason && <Tooltip>{disableReason}</Tooltip>}
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
