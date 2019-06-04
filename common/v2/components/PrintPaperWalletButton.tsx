import React, { Component } from 'react';
import { Button } from '@mycrypto/ui';
import styled from 'styled-components';

import PaperWallet from './PaperWallet';

// Legacy
import printerIcon from 'common/assets/images/icn-printer.svg';

const PrinterImage = styled.embed`
  width: 24px;
  height: 24px;
  margin-right: 10px;
  pointer-events: none;
  display: inline;
`;

const DownloadLink = styled.a`
  margin-bottom: 16px;
`;

const StyledButton = styled(Button)`
  font-size: 18px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  &:focus,
  &:hover {
    embed {
      filter: brightness(0) invert(1);
    }
  }
`;

interface Props {
  address: string;
  printText: React.ReactElement<any>;
  privateKey?: string;
  mnemonic?: string;
  path?: string;
  onPrintWalletClick?(): void;
}

interface State {
  paperWalletPdf: string;
}

export default class PrintPaperWalletButton extends Component<Props, State> {
  public state: State = {
    paperWalletPdf: ''
  };

  private paperWallet: PaperWallet | null;

  public componentDidMount() {
    setTimeout(() => {
      if (!this.paperWallet) {
        return this.componentDidMount();
      }
      this.paperWallet.toPDF().then(pdf => this.setState({ paperWalletPdf: pdf }));
    }, 500);
  }

  public render() {
    const { paperWalletPdf } = this.state;
    const { address, path, printText, mnemonic, privateKey } = this.props;

    return (
      <DownloadLink href={paperWalletPdf} download={`paper-wallet-0x${address.substr(0, 6)}`}>
        <StyledButton secondary={true} onClick={this.handlePrintClick} disabled={!paperWalletPdf}>
          <PrinterImage src={printerIcon} />
          {printText}
        </StyledButton>
        <PaperWallet
          address={address}
          mnemonic={mnemonic}
          privateKey={privateKey}
          path={path}
          ref={c => (this.paperWallet = c)}
          isHidden={true}
        />
      </DownloadLink>
    );
  }

  private handlePrintClick = () => {
    const { onPrintWalletClick } = this.props;
    if (!this.paperWallet) {
      return;
    }

    if (onPrintWalletClick) {
      onPrintWalletClick();
    }
  };
}
