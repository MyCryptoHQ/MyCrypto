import WalletDecrypt from 'components/WalletDecrypt';
import { IWallet } from 'libs/wallet/IWallet';
import React from 'react';
import { connect } from 'react-redux';
import { AppState } from 'reducers';
import translate from 'translations';

interface Props {
  title: string;
  wallet: IWallet;
}
interface State {
  expanded: boolean;
}
export class UnlockHeader extends React.Component<Props, State> {
  public state = {
    expanded: !this.props.wallet
  };

  public componentDidUpdate(prevProps: Props) {
    if (this.props.wallet && this.props.wallet !== prevProps.wallet) {
      this.setState({ expanded: false });
    }

    // not sure if could happen
    if (!this.props.wallet && this.props.wallet !== prevProps.wallet) {
      this.setState({ expanded: true });
    }
  }

  public render() {
    return (
      <article className="collapse-container">
        <div onClick={this.toggleExpanded}>
          <a className="collapse-button">
            <span>{this.state.expanded ? '-' : '+'}</span>
          </a>
          <h1>{translate(this.props.title)}</h1>
        </div>
        {this.state.expanded && <WalletDecrypt />}
        {this.state.expanded && <hr />}
      </article>
    );
  }

  public toggleExpanded = () => {
    this.setState(state => {
      return { expanded: !state.expanded };
    });
  };
}

function mapStateToProps(state: AppState) {
  return {
    wallet: state.wallet.inst
  };
}

export default connect(mapStateToProps)(UnlockHeader);
