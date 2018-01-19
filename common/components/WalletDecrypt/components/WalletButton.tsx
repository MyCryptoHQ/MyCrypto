import React from 'react';
import classnames from 'classnames';
import { translateRaw, TranslateType } from 'translations';
import { NewTabLink, Tooltip } from 'components/ui';
import './WalletButton.scss';
import { connect } from 'react-redux';
import { getNetworkConfig } from 'selectors/config';
import { WalletName } from 'config';
import { AppState } from 'reducers';
import { isSupportedWalletFormat } from 'utils/network';

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
  onClick(walletType: string): void;
}

interface StateProps {
  isFormatDisabled?: boolean;
}

type Props = OwnProps & StateProps;

class WalletButtonClass extends React.PureComponent<Props> {
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
      isFormatDisabled
    } = this.props;

    const disabled = isDisabled || isFormatDisabled;

    return (
      <div
        className={classnames({
          WalletButton: true,
          'WalletButton--small': !isSecure,
          'is-disabled': disabled
        })}
        onClick={this.handleClick}
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled}
      >
        <div className="WalletButton-title">
          {icon && <img className="WalletButton-title-icon" src={icon} />}
          <span>{name}</span>
        </div>

        {description && <div className="WalletButton-description">{description}</div>}
        {example && <div className="WalletButton-example">{example}</div>}

        <div className="WalletButton-icons">
          {isSecure ? (
            <span className="WalletButton-icons-icon" onClick={this.stopPropogation}>
              <i className="fa fa-shield" />
              <Tooltip>{translateRaw('This wallet type is secure')}</Tooltip>
            </span>
          ) : (
            <span className="WalletButton-icons-icon" onClick={this.stopPropogation}>
              <i className="fa fa-exclamation-triangle" />
              <Tooltip>{translateRaw('This wallet type is insecure')}</Tooltip>
            </span>
          )}
          {isReadOnly && (
            <span className="WalletButton-icons-icon" onClick={this.stopPropogation}>
              <i className="fa fa-eye" />
              <Tooltip>{translateRaw('You cannot send using address only')}</Tooltip>
            </span>
          )}

          {helpLink && (
            <span className="WalletButton-icons-icon">
              <NewTabLink href={helpLink} onClick={this.stopPropogation}>
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
    if (this.props.isDisabled || this.props.isFormatDisabled) {
      return;
    }

    this.props.onClick(this.props.walletType);
  };

  private stopPropogation = (ev: React.FormEvent<HTMLAnchorElement | HTMLSpanElement>) => {
    ev.stopPropagation();
  };
}

function mapStateToProps(state: AppState, ownProps: OwnProps): StateProps {
  const { walletType } = ownProps;
  const network = getNetworkConfig(state);
  return {
    isFormatDisabled: !isSupportedWalletFormat(walletType, network)
  };
}

export const WalletButton = connect(mapStateToProps)(WalletButtonClass);
