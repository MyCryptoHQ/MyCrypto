import React, { Component } from 'react';
import { Button } from '@mycrypto/ui';
import styled from 'styled-components';
import { addHexPrefix, toChecksumAddress } from 'ethereumjs-util';

import PaperWallet from './PaperWallet';
import Spinner from 'components/ui/Spinner';

// Legacy
import printerIcon from 'common/assets/images/icn-printer.svg';

const PrinterImage = styled.img`
  width: 24px;
  height: 24px;
  margin-right: 10px;
  pointer-events: none;
  display: inline;
`;

const StyledButton = styled(Button)`
  font-size: 18px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 16px;

  &:focus,
  &:hover {
    img {
      filter: brightness(0) invert(1);
    }
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 66px;
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
  loading: boolean;
}

export default class PrintPaperWalletButton extends Component<Props, State> {
  public state: State = {
    paperWalletPdf: '',
    loading: false
  };

  private paperWallet: PaperWallet | null;

  public render() {
    const { address, path, printText, mnemonic, privateKey } = this.props;
    const prefixedAddress = toChecksumAddress(addHexPrefix(address));

    return (
      <>
        <ButtonWrapper>
          {this.state.loading ? (
            <Spinner size={'x2'} />
          ) : (
            <StyledButton secondary={true} onClick={this.handlePrintClick}>
              <PrinterImage src={printerIcon} />
              {printText}
            </StyledButton>
          )}
        </ButtonWrapper>
        <PaperWallet
          address={prefixedAddress}
          mnemonic={mnemonic}
          privateKey={privateKey}
          path={path}
          ref={c => (this.paperWallet = c)}
          isHidden={true}
        />
      </>
    );
  }

  private handlePrintClick = async () => {
    const { onPrintWalletClick } = this.props;
    if (!this.paperWallet) {
      return;
    }

    this.setState({ loading: true });
    await this.paperWallet.toPDF();
    this.setState({ loading: false });

    if (onPrintWalletClick) {
      onPrintWalletClick();
    }
  };
}
