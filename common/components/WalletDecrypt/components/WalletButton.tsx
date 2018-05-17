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
  isSecure?: boolean;
  isReadOnly?: boolean;
  isDisabled?: boolean;
  disableReason?: string;
  onClick(walletType: string): void;
}

interface StateProps {
  isFormatDisabled?: boolean;
}

interface Icon {
  icon: string;
  tooltip: string;
  href?: string;
  arialabel: string;
}

type Props = OwnProps & StateProps;

export class WalletButton extends React.PureComponent<Props> {
  public render() {
    const {
      name,
      description,
      example,
      icon,
      helpLink,
      isSecure,
      isReadOnly,
      isDisabled,
      disableReason
    } = this.props;

    const icons: Icon[] = [];
    if (isReadOnly) {
      icons.push({
        icon: 'eye',
        tooltip: translateRaw('TOOLTIP_READ_ONLY_WALLET'),
        arialabel: 'Read Only'
      });
    } else {
      if (isSecure) {
        icons.push({
          icon: 'shield',
          tooltip: translateRaw('TOOLTIP_SECURE_WALLET_TYPE'),
          arialabel: 'Secure wallet type'
        });
      } else {
        icons.push({
          icon: 'exclamation-triangle',
          tooltip: translateRaw('TOOLTIP_INSECURE_WALLET_TYPE'),
          arialabel: 'Insecure wallet type'
        });
      }
    }
    if (helpLink) {
      icons.push({
        icon: 'question-circle',
        tooltip: translateRaw('TOOLTIP_MORE_INFO'),
        href: helpLink,
        arialabel: 'More info'
      });
    }

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

          <div className="WalletButton-icons">
            {icons.map(i => (
              <span className="WalletButton-icons-icon" key={i.icon} onClick={this.stopPropogation}>
                {i.href ? (
                  <NewTabLink href={i.href} onClick={this.stopPropogation} aria-label={i.arialabel}>
                    <i className={`fa fa-${i.icon}`} />
                  </NewTabLink>
                ) : (
                  <i className={`fa fa-${i.icon}`} aria-label={i.arialabel} />
                )}
                {!isDisabled && <Tooltip size="sm">{i.tooltip}</Tooltip>}
              </span>
            ))}
          </div>
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

  private stopPropogation = (ev: React.FormEvent<HTMLAnchorElement | HTMLSpanElement>) => {
    ev.stopPropagation();
  };
}
