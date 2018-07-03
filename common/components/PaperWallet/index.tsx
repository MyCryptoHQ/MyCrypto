import React from 'react';
import html2canvas from 'html2canvas';
import { addHexPrefix, toChecksumAddress } from 'ethereumjs-util';

import notesBg from 'assets/images/notes-bg.png';
import sidebarImg from 'assets/images/print-sidebar.png';
import { Identicon, QRCode } from 'components/ui';
import './index.scss';

interface Props {
  address: string;
  privateKey: string;
}

export default class PaperWallet extends React.Component<Props, {}> {
  private container: HTMLElement | null;

  public render() {
    const { privateKey } = this.props;
    const address = toChecksumAddress(addHexPrefix(this.props.address));

    return (
      <div className="PaperWallet" ref={el => (this.container = el)}>
        <img src={sidebarImg} className="PaperWallet-sidebar" alt="MyCrypto Logo" />

        <div className="PaperWallet-block">
          <div className="PaperWallet-block-box">
            <QRCode data={address} />
          </div>
          <p className="PaperWallet-block-text">YOUR ADDRESS</p>
        </div>

        <div className="PaperWallet-block">
          <img src={notesBg} className="PaperWallet-block-box is-shaded" aria-hidden={true} />
          <p className="PaperWallet-block-text">AMOUNT / NOTES</p>
        </div>

        <div className="PaperWallet-block">
          <div className="PaperWallet-block-box">
            <QRCode data={privateKey} />
          </div>
          <p className="PaperWallet-block-text">YOUR PRIVATE KEY</p>
        </div>

        <div className="PaperWallet-info">
          <p className="PaperWallet-info-text">
            <strong className="PaperWallet-info-text-label">Your Address:</strong>
            <br />
            {address}
          </p>
          <p className="PaperWallet-info-text">
            <strong className="PaperWallet-info-text-label">Your Private Key:</strong>
            <br />
            {privateKey}
          </p>
        </div>

        <div className="PaperWallet-identicon">
          <div className="PaperWallet-identicon-left">
            <Identicon address={address} size={'42px'} />
          </div>
          <p className="PaperWallet-identicon-text">
            Always look for this icon when sending to this wallet
          </p>
        </div>
      </div>
    );
  }

  public toPNG = async () => {
    if (!this.container) {
      return '';
    }
    const canvas = await html2canvas(this.container);
    return canvas.toDataURL('image/png');
  };
}
