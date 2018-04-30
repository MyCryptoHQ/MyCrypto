import React from 'react';
import { connect, MapStateToProps } from 'react-redux';
import { toChecksumAddress } from 'ethereumjs-util';
import onClickOutside from 'react-onclickoutside';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import translate from 'translations';
import { AppState } from 'reducers';
import { Address, Identicon, Input } from 'components/ui';
import { getLabels } from 'selectors/addressBook';

interface StateProps {
  labels: ReturnType<typeof getLabels>;
}

interface OwnProps {
  address: string;
}

type Props = StateProps & OwnProps;

interface State {
  copied: boolean;
  editingLabel: boolean;
}

class AccountAddress extends React.Component<Props, State> {
  public state = {
    copied: false,
    editingLabel: false
  };

  private goingToClearCopied: number | null = null;

  private labelInput: HTMLInputElement | null = null;

  public handleCopy = () =>
    this.setState(
      (prevState: State) => ({
        copied: !prevState.copied
      }),
      this.clearCopied
    );

  public handleClickOutside = () => this.state.editingLabel && this.stopEditingLabel();

  public componentWillUnmount() {
    if (this.goingToClearCopied) {
      window.clearTimeout(this.goingToClearCopied);
    }
  }

  public render() {
    const { address, labels } = this.props;
    const { copied, editingLabel } = this.state;
    const label = labels[address.toLowerCase()];

    let labelButton;

    if (editingLabel) {
      labelButton = (
        <React.Fragment>
          <i className="fa fa-save" />
          <span onClick={this.stopEditingLabel}>{translate('SAVE_LABEL')}</span>
        </React.Fragment>
      );
    } else if (!editingLabel) {
      labelButton = (
        <React.Fragment>
          <i className="fa fa-pencil" />
          <span onClick={this.startEditingLabel}>{translate('EDIT_LABEL')}</span>
        </React.Fragment>
      );
    }

    let labelContent = null;

    if (editingLabel) {
      labelContent = <Input setInnerRef={this.setLabelInputRef} />;
    } else if (label && !editingLabel) {
      labelContent = <label className="AccountInfo-address-label">{label}</label>;
    }

    return (
      <div className="AccountInfo">
        <h5 className="AccountInfo-section-header">{translate('SIDEBAR_ACCOUNTADDR')}</h5>
        <div className="AccountInfo-section AccountInfo-address-section">
          <div className="AccountInfo-address-icon">
            <Identicon address={address} size="100%" />
          </div>
          <div className="AccountInfo-address-wrapper">
            {labelContent}
            <div className="AccountInfo-address-addr">
              <Address address={address} />
            </div>
            <CopyToClipboard onCopy={this.handleCopy} text={toChecksumAddress(address)}>
              <div
                className={`AccountInfo-copy ${copied ? 'is-copied' : ''}`}
                title="Copy To clipboard"
              >
                <i className="fa fa-copy" />
                <span>{copied ? 'copied!' : 'copy address'}</span>
              </div>
            </CopyToClipboard>
            <div className="AccountInfo-label" title="Edit label">
              {labelButton}
            </div>
          </div>
        </div>
      </div>
    );
  }

  private clearCopied = () =>
    (this.goingToClearCopied = window.setTimeout(() => this.setState({ copied: false }), 2000));

  private startEditingLabel = () =>
    this.setState({ editingLabel: true }, () => {
      if (this.labelInput) {
        this.labelInput.focus();
        this.labelInput.select();
      }
    });

  private stopEditingLabel = () => this.setState({ editingLabel: false });

  private setLabelInputRef = (node: HTMLInputElement) => (this.labelInput = node);
}

const mapStateToProps: MapStateToProps<StateProps, {}, AppState> = state => ({
  labels: getLabels(state)
});

export default connect(mapStateToProps)(onClickOutside(AccountAddress));
