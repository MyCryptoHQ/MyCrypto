// @flow
import React from 'react';
import PropTypes from 'prop-types';
import translate from 'translations';
import WalletDecrypt from 'components/WalletDecrypt';
import type { IWallet } from 'libs/wallet/IWallet';
import { connect } from 'react-redux';
import type { State } from 'reducers';

type Props = {
  title: string,
  wallet: IWallet
};

export class UnlockHeader extends React.Component {
  props: Props;
  static propTypes = {
    title: PropTypes.string.isRequired
  };

  state: {
    expanded: boolean
  } = {
    expanded: !this.props.wallet
  };

  componentDidUpdate(prevProps: Props) {
    if (this.props.wallet && this.props.wallet !== prevProps.wallet) {
      this.setState({ expanded: false });
    }

    // not sure if could happen
    if (!this.props.wallet && this.props.wallet !== prevProps.wallet) {
      this.setState({ expanded: true });
    }
  }

  render() {
    return (
      <article className="collapse-container">
        <div onClick={this.toggleExpanded}>
          <a className="collapse-button">
            <span>
              {this.state.expanded ? '-' : '+'}
            </span>
          </a>
          <h1>
            {translate(this.props.title)}
          </h1>
        </div>
        {this.state.expanded && <WalletDecrypt />}
        {this.state.expanded && <hr />}
      </article>
    );
  }

  toggleExpanded = () => {
    this.setState(state => {
      return { expanded: !state.expanded };
    });
  };
}

function mapStateToProps(state: State) {
  return {
    wallet: state.wallet.inst
  };
}

export default connect(mapStateToProps)(UnlockHeader);
