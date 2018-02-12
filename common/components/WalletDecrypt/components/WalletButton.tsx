import React from 'react';
import classnames from 'classnames';
import { translateRaw, TranslateType } from 'translations';
import { NewTabLink, Tooltip } from 'components/ui';
import './WalletButton.scss';

import { WalletName } from 'config';

interface OwnProps {
  name: TranslateType;
  description?: TranslateType;
  example?: TranslateType;
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
        tooltip: translateRaw('You cannot send using address only')
      });
    } else {
      if (isSecure) {
        icons.push({
          icon: 'shield',
          tooltip: translateRaw('This wallet type is secure')
        });
      } else {
        icons.push({
          icon: 'exclamation-triangle',
          tooltip: translateRaw('This wallet type is insecure')
        });
      }
    }
    if (helpLink) {
      icons.push({
        icon: 'question-circle',
        tooltip: translateRaw('NAV_Help'),
        href: helpLink
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
            {icon && <img className="WalletButton-title-icon" src={icon} />}
            <span>{name}</span>
          </div>

          {description && <div className="WalletButton-description">{description}</div>}
          {example && <div className="WalletButton-example">{example}</div>}

          <div className="WalletButton-icons">
            {icons.map(i => (
              <span className="WalletButton-icons-icon" key={i.icon} onClick={this.stopPropogation}>
                {i.href ? (
                  <NewTabLink href={i.href} onClick={this.stopPropogation}>
                    <i className={`fa fa-${i.icon}`} />
                  </NewTabLink>
                ) : (
                  <i className={`fa fa-${i.icon}`} />
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
