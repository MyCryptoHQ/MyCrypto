import WalletDecrypt from 'components/WalletDecrypt';
import { IWallet } from 'libs/wallet/IWallet';
import React from 'react';
import { connect } from 'react-redux';
import { AppState } from 'reducers';

interface Props {
  title: React.ReactElement<any>;
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
    const { title } = this.props;
    return (
      <article className="collapse-container">
        <div>
          <a className="collapse-button" onClick={this.toggleExpanded}>
            <span>{this.state.expanded ? '-' : '+'}</span>
          </a>
          <h1>{title}</h1>
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
