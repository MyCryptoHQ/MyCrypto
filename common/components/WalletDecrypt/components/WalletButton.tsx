import React from 'react';
import classnames from 'classnames';
import { translateRaw } from 'translations';
import { NewTabLink, Tooltip } from 'components/ui';
import './WalletButton.scss';

interface Props {
  name: React.ReactElement<string> | string;
  description?: React.ReactElement<string> | string;
  example?: React.ReactElement<string> | string;
  icon?: string | null;
  helpLink?: string;
  walletType: string;
  isSecure?: boolean;
  isReadOnly?: boolean;
  onClick(walletType: string): void;
}

export class WalletButton extends React.Component<Props, {}> {
  public render() {
    const { name, description, example, icon, helpLink, isSecure, isReadOnly } = this.props;

    return (
      <div
        className={classnames({
          WalletButton: true,
          'WalletButton--small': !isSecure
        })}
        onClick={this.handleClick}
      >
        <div className="WalletButton-title">
          {icon && <img className="WalletButton-title-icon" src={icon} />}
          <span>{name}</span>
        </div>
        {description && <div className="WalletButton-description">{description}</div>}
        {example && <div className="WalletButton-example">{example}</div>}
        <div className="WalletButton-icons">
          {isSecure === true && (
            <span className="WalletButton-icons-icon">
              <i className="fa fa-shield" />
              <Tooltip>{translateRaw('This wallet type is secure')}</Tooltip>
            </span>
          )}
          {isSecure === false && (
            <span className="WalletButton-icons-icon">
              <i className="fa fa-exclamation-triangle" />
              <Tooltip>{translateRaw('This wallet type is insecure')}</Tooltip>
            </span>
          )}
          {isReadOnly === true && (
            <span className="WalletButton-icons-icon">
              <i className="fa fa-eye" />
              <Tooltip>{translateRaw('You cannot send using address only')}</Tooltip>
            </span>
          )}
          {helpLink && (
            <span className="WalletButton-icons-icon">
              <NewTabLink href={helpLink}>
                <i className="fa fa-question-circle" />
              </NewTabLink>
              <Tooltip>{translateRaw('NAV_Help')}</Tooltip>
            </span>
          )}
        </div>
      </div>
    );
  }

  private handleClick = () => {
    this.props.onClick(this.props.walletType);
  };
}
