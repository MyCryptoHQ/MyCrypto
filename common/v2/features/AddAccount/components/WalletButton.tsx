import React from 'react';
import classnames from 'classnames';

import { WalletName } from 'config';
import { translateRaw } from 'translations';
import { NewTabLink, Tooltip } from 'components/ui';
import './WalletButton.scss';

interface OwnProps {
  name: string;
  description?: string;
  example?: string;
  icon?: string;
  helpLink: string;
  walletType: WalletName;
  isDisabled?: boolean;
  disableReason?: string;
  onClick(walletType: string): void;
}

interface StateProps {
  isFormatDisabled?: boolean;
}

interface Icon {
  icon: string;
  href?: string;
  arialabel: string;
}

type Props = OwnProps & StateProps;

export class WalletButton extends React.PureComponent<Props> {
  public render() {
    const { name, description, example, icon, isDisabled, disableReason } = this.props;

    return (
      <div
        className={classnames({
          WalletButton: true,
          'is-disabled': isDisabled
        })}
        onClick={this.handleClick}
        tabIndex={isDisabled ? -1 : 0}
        aria-disabled={isDisabled}
      >
        <div className="WalletButton-inner">
          <div className="WalletButton-title">
            {icon && <img className="WalletButton-title-icon" src={icon} alt={name + ' logo'} />}
            <span>{name}</span>
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
        </div>

        {isDisabled && disableReason && <Tooltip>{disableReason}</Tooltip>}
      </div>
    );
  }

  private handleClick = () => {
    if (this.props.isDisabled || this.props.isFormatDisabled) {
      return;
    }

    this.props.onClick(this.props.walletType);
  };

  private stopPropagation = (ev: React.FormEvent<HTMLAnchorElement | HTMLSpanElement>) => {
    ev.stopPropagation();
  };
}
