import React from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import styled from 'styled-components';
import { Identicon } from '@mycrypto/ui';

import { QRCode } from 'components/ui';
import { KNOWLEDGE_BASE_URL } from 'v2/config';

import walletIcon from 'common/assets/images/icn-hardware-wallet.svg';
import myCryptoIcon from 'common/assets/images/logo-mycrypto-transparent.png';

interface PaperWalletWrapperProps {
  isHidden?: boolean;
}

// size of paper wallet is 2 times of design size
const paperWalletWidth: number = 1458;
const paperWalletHeight: number = 612;

const PaperWalletWrapper =
  styled.div <
  PaperWalletWrapperProps >
  `
  ${props => props.isHidden && `position: fixed; top: -${paperWalletHeight}px;`}
  width: ${paperWalletWidth}px;
  height: ${paperWalletHeight}px;
  color: black;
`;

interface PartProps {
  hasRightBorder?: boolean;
  hasLeftBorder?: boolean;
  hasTopBorder?: boolean;
}

const borderStyle = '6px dashed rgba(227, 237, 255, 0.3);';
const Part =
  styled.div <
  PartProps >
  `
  width: 486px;
  height: 304px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  ${props => props.hasRightBorder && `border-right: ${borderStyle}`}
  ${props => props.hasLeftBorder && `border-left: ${borderStyle}`}
  ${props => props.hasTopBorder && `border-top: ${borderStyle}`}
`;

interface PartWrapperProps {
  rotateChildren?: boolean;
}
const PartWrapper =
  styled.div <
  PartWrapperProps >
  `
  display: flex;
  ${Part} {
    ${props => props.rotateChildren && 'transform: rotate(180deg);'}
  }
`;

const WalletImage = styled.img`
  width: 120px;
  height: 120px;
`;

const Resources = styled.p`
  text-align: center;
  font-size: 28px;
  font-weight: normal;
`;

const MyCryptoImage = styled.img`
  width: 360px;
  height: auto;
`;

const LogoText = styled.p`
  text-align: right;
  font-size: 30px;
  font-weight: normal;
  margin-top: -14px;
`;

const Notes = styled.p`
  text-align: left;
  font-size: 26px;
  font-weight: normal;
  margin: 0;
`;

const InnerPartWrapper = styled.div`
  width: 100%;
  height: 100%;
  padding: 30px;
`;

const HorizontalLine = styled.hr`
  border: 1px solid #b5bfc7;
  width: 100%;
  margin: 0 0 30px 0;
`;

const IdenticonHeader = styled.div`
  display: flex;
  align-items: flex-start;
`;

const IdenticonIcon = styled(Identicon)`
  margin-right: 20px;

  img {
    width: 68px;
    height: 68px;
    max-width: none;
  }
`;

const TextHeader = styled.div`
  font-size: 26px;
  font-weight: normal;
  line-height: 26px;
`;

interface TextSubHeaderProps {
  noTopMargin?: boolean;
}
const TextSubHeader =
  styled.p <
  TextSubHeaderProps >
  `
  font-size: 14px;
  font-weight: normal;
  margin: ${props => (props.noTopMargin ? '0' : '14px')} 0 0 0;
`;

interface QRAddressWrapperProps {
  isInversed: boolean;
}
const QRAddressWrapper =
  styled.div <
  QRAddressWrapperProps >
  `
  width: 244px;
  height: 426px;
  border: 6px solid ${props => (props.isInversed ? '#ef4747' : '#a7e07b')};
  display: flex;
  flex-direction: column;
  align-items: center;
  transform: rotate(${props => props.isInversed && '-'}90deg) translate${props =>
    props.isInversed ? 'X' : 'Y'}(-100%);
  transform-origin: 0 0;
`;

const QRCodeWrapper = styled.div`
  width: 200px;
  height: 200px;
`;

const QRCodeTitle = styled.div`
  font-size: 36px;
  text-align: center;
  font-weight: bold;
`;

const QRCodeSubTitle = styled.div`
  min-height: 50px;
  font-size: 14px;
  text-align: center;
  font-weight: normal;
`;

const Path = styled.div`
  min-height: 30px;
  font-size: 14px;
  text-align: center;
  font-weight: normal;
  margin-top: 6px;
`;

const Address = styled.div`
  font-size: 18px;
  text-align: center;
  font-weight: normal;
  margin: 0px 32px 20px 32px;
  line-height: 24px;
  word-break: break-all;
`;

interface MnemonicProps {
  breakWords?: boolean;
}
const Mnemonic =
  styled.div <
  MnemonicProps >
  `
  font-size: 14px;
  text-align: center;
  font-weight: normal;
  margin: 0px 16px 10px 16px;
  line-height: 17px;
  ${props => props.breakWords && 'word-break: break-all;'}
`;

interface Props {
  address: string;
  privateKey?: string;
  mnemonic?: string;
  path?: string;
  isHidden?: boolean;
}

export default class PaperWallet extends React.Component<Props, {}> {
  private container: HTMLElement | null;

  public render() {
    const { isHidden, address } = this.props;

    return (
      <PaperWalletWrapper isHidden={isHidden} ref={(el: any) => (this.container = el)}>
        <PartWrapper rotateChildren={true}>
          <Part hasLeftBorder={true}>
            <InnerPartWrapper>
              <IdenticonHeader>
                <IdenticonIcon address={address} />
                <TextHeader>
                  Your Identicon
                  <TextSubHeader noTopMargin={true}>
                    Look for this icon when sending funds to this wallet.
                  </TextSubHeader>
                </TextHeader>
              </IdenticonHeader>
              <TextSubHeader>
                To deposit funds to this wallet, send ETH or tokens to the public address.
              </TextSubHeader>
              <TextSubHeader>
                To check the balance of this wallet, go to www.mycrypto.com or the MyCrypto Desktop
                app and unlock your wallet.
              </TextSubHeader>
              <TextSubHeader>
                DO NOT SHARE YOUR PRIVATE KEY with anyone. You are responsible for keeping your
                funds safe. MyCrypto cannot recover your funds for you.
              </TextSubHeader>
            </InnerPartWrapper>
          </Part>
          <Part hasLeftBorder={true}>
            <InnerPartWrapper>
              <Notes>Notes:</Notes>
              {[...Array(7)].map((x: any, index: any) => <HorizontalLine key={`${index}${x}`} />)}
            </InnerPartWrapper>
          </Part>
          <Part>{this.getQRAddressWrapper(true)}</Part>
        </PartWrapper>
        <PartWrapper>
          <Part hasRightBorder={true} hasTopBorder={true}>
            <div>
              <MyCryptoImage src={myCryptoIcon} />
              <LogoText>Paper Wallet</LogoText>
            </div>
          </Part>
          <Part hasRightBorder={true} hasTopBorder={true}>
            <WalletImage src={walletIcon} />
            <Resources>For Resources and Help, Visit: {KNOWLEDGE_BASE_URL}</Resources>
          </Part>
          <Part hasTopBorder={true}>{this.getQRAddressWrapper(false)}</Part>
        </PartWrapper>
      </PaperWalletWrapper>
    );
  }

  public toPNG = async (scale: number = 1) => {
    if (!this.container) {
      return '';
    }
    const canvas = await html2canvas(this.container, { scale });
    return canvas.toDataURL('image/png');
  };

  public toPDF = async () => {
    const { address } = this.props;
    const png = await this.toPNG(3);
    const pdf = new jsPDF('l', 'px');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    // ratio setting size of paper wallet in PDF
    const pdfImageSizeRation = 2.6;
    const printedWidth = paperWalletWidth / pdfImageSizeRation;
    const printedHeight = paperWalletHeight / pdfImageSizeRation;

    pdf.addImage(
      png,
      'PNG',
      (pdfWidth - printedWidth) / 2,
      (pdfHeight - printedHeight) / 2,
      printedWidth,
      printedHeight,
      undefined,
      'FAST'
    );

    pdf.save(`paper-wallet-${address.substr(0, 8)}`);

    //return pdf.output('datauristring');
  };

  private getQRAddressWrapper = (isPrivate: boolean) => {
    const { mnemonic, privateKey, path, address } = this.props;
    let dataText: string = '';
    let data: string = '';
    if (isPrivate) {
      if (mnemonic) {
        data = mnemonic;
        dataText = 'Your Mnemonic Phrase';
      }
      if (privateKey) {
        data = privateKey;
        dataText = 'Your Private Key';
      }
    } else {
      data = address;
    }
    const subTitle = isPrivate
      ? 'Keep this safe. Do not share.'
      : 'Share this with your friends when they need to send you crypto!';

    return (
      <InnerPartWrapper>
        <QRAddressWrapper isInversed={isPrivate}>
          <QRCodeTitle>{isPrivate ? 'PRIVATE' : 'PUBLIC'}</QRCodeTitle>
          <QRCodeSubTitle>{subTitle}</QRCodeSubTitle>
          <QRCodeWrapper>
            <QRCode data={data} />
          </QRCodeWrapper>
          <Path>{isPrivate && path && `Derived Path: ${path}`}</Path>
          {isPrivate ? (
            <Mnemonic breakWords={!!privateKey}>
              <b>{dataText}:</b>
              <br />
              {data}
            </Mnemonic>
          ) : (
            <Address>{data}</Address>
          )}
        </QRAddressWrapper>
      </InnerPartWrapper>
    );
  };
}
