import Web3Wallet from 'libs/wallet/web3';
import React, { Component } from 'react';
import translate, { translateRaw } from 'translations';
import './Web3.scss';

interface Props {
  onUnlock(): void;
}
interface State {
  // publicKey: string;
  // chainCode: string;
  error: string | null;
  // isLoading: boolean;
}

export default class Web3Decrypt extends Component<Props, State> {
  public state: State = {
    // publicKey: '',
    // chainCode: '',
    error: null
    // isLoading: false
  };

  public render() {
    const { error } = this.state;
    const showErr = error ? 'is-showing' : '';

    return (
      <section className="Web3Decrypt col-md-4 col-sm-6">
        <button
          className="Web3Decrypt btn btn-primary btn-lg"
          onClick={this.props.onUnlock}
        >
          {/* {isLoading ? 'Unlocking...' : translate('ADD_MetaMask')} */}
          {translate('ADD_MetaMask')}
        </button>

        {/* <div className="Web3Decrypt-help">
          Guide:{' '}
          <a
            href="https://blog.trezor.io/trezor-integration-with-myetherwallet-3e217a652e08"
            target="_blank"
            rel="noopener"
          >
            How to use TREZOR with MyEtherWallet
          </a>
        </div> */}

        <div className={`Web3Decrypt-error alert alert-danger ${showErr}`}>
          {error || '-'}
        </div>

        <a
          className="Web3Decrypt-install btn btn-sm btn-default"
          href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en"
          target="_blank"
          rel="noopener"
        >
          {translate('Download MetaMask')}
        </a>
      </section>
    );
  }

  // private handlePathChange = (dPath: string) => {
  //   this.setState({ dPath });
  //   this.handleConnect(dPath);
  // };

  // adapted from:
  // https://github.com/kvhnuke/etherwallet/blob/417115b0ab4dd2033d9108a1a5c00652d38db68d/app/scripts/controllers/decryptWalletCtrl.js#L311
  private handleConnect = (): void => {
    log('calling on unlock!');
    this.props.onUnlock();

    // const { web3 } = (window as any)

    // if (!web3 || !web3.eth || !web3.eth.getAccounts) {
    //   return this.setState({
    //     error: 'Web3 not detected. Is MetaMask installed?'
    //   })
    // }

    // web3.eth.getAccounts((err, accounts: string[]) => {
    //   if (err) {
    //     return this.setState({
    //       error: `${err}. Are you sure you're on a secure (SSL / HTTPS) connection?`
    //     })
    //   }

    //   const address = accounts[0]

    //   this.props.onUnlock(
    //     new Web3Wallet(web3, address)
    //   );
    // })

    // this.setState({
    // isLoading: true,
    // error: null
    // });

    // TODO: type vendor file
    // (TrezorConnect as any).getXPubKey(
    //   dPath,
    //   res => {
    //     if (res.success) {
    //       this.setState({
    //         dPath,
    //         publicKey: res.publicKey,
    //         chainCode: res.chainCode,
    //         isLoading: false
    //       });
    //     } else {
    //       this.setState({
    //         error: res.error,
    //         isLoading: false
    //       });
    //     }
    //   },
    //   '1.5.2'
    // );
    // console.log((window as any).web3);
    log('handleConnect');
  };

  // private handleUnlock = (address: string, index: number) => {
  //   // this.props.onUnlock(new TrezorWallet(address, this.state.dPath, index));
  //   log('handleUnlock')
  // };

  // private handleNullConnect(): void {
  //   return this.handleConnect();
  // }
}

const log = s => console.log('Web3Decrypt - ' + s);
