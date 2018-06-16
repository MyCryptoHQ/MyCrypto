import React from 'react';
import { PaperWallet } from 'components';
import { stripHexPrefix } from 'libs/values';
import translate from 'translations';

interface Props {
  address: string;
  privateKey: string;
}

interface State {
  paperWalletImage: string;
}

export default class PrintableWallet extends React.Component<Props, State> {
  public state: State = {
    paperWalletImage: ''
  };

  private paperWallet: PaperWallet | null;

  public componentDidMount() {
    setTimeout(() => {
      if (!this.paperWallet) {
        return this.componentDidMount();
      }

      this.paperWallet.toPNG().then(png => this.setState({ paperWalletImage: png }));
    }, 500);
  }

  public render() {
    const { address, privateKey } = this.props;
    const { paperWalletImage } = this.state;
    const pkey = stripHexPrefix(privateKey);
    const disabled = paperWalletImage ? '' : 'disabled';

    return (
      <div>
        <PaperWallet address={address} privateKey={pkey} ref={c => (this.paperWallet = c)} />
        <a
          role="button"
          href={paperWalletImage}
          className={`btn btn-lg btn-primary btn-block ${disabled}`}
          style={{ margin: '10px auto 0', maxWidth: '260px' }}
          download={`paper-wallet-0x${address.substr(0, 6)}`}
        >
          {translate('X_SAVE_PAPER')}
        </a>
      </div>
    );
  }
}
