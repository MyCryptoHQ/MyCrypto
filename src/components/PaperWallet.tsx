import React from 'react';

import { Identicon } from '@mycrypto/ui';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import styled from 'styled-components';

import walletIcon from '@assets/images/icn-hardware-wallet.svg';
import myCryptoIcon from '@assets/images/logo-mycrypto-transparent.png';
import { QRCode } from '@components';
import { getKBHelpArticle, KB_HELP_ARTICLE } from '@config';
import { Trans, translateRaw } from '@translations';

interface PaperWalletWrapperProps {
  isHidden?: boolean;
}

// size of paper wallet is 2 times of design size
const paperWalletWidth = 1458;
const paperWalletHeight = 612;

const PaperWalletWrapper = styled.div<PaperWalletWrapperProps>`
  ${(props) => props.isHidden && `position: fixed; top: -${paperWalletHeight}px;`}
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
const Part = styled.div<PartProps>`
  width: 486px;
  height: 304px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  ${(props) => props.hasRightBorder && `border-right: ${borderStyle}`}
  ${(props) => props.hasLeftBorder && `border-left: ${borderStyle}`}
  ${(props) => props.hasTopBorder && `border-top: ${borderStyle}`}
`;

interface PartWrapperProps {
  rotateChildren?: boolean;
}
const PartWrapper = styled.div<PartWrapperProps>`
  display: flex;
  ${Part} {
    ${(props) => props.rotateChildren && 'transform: rotate(180deg);'}
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
const TextSubHeader = styled.p<TextSubHeaderProps>`
  font-size: 14px;
  font-weight: normal;
  margin: ${(props) => (props.noTopMargin ? '0' : '14px')} 0 0 0;
`;

interface QRAddressWrapperProps {
  isInversed: boolean;
}
const QRAddressWrapper = styled.div<QRAddressWrapperProps>`
  width: 244px;
  height: 426px;
  border: 6px solid ${(props) => (props.isInversed ? '#ef4747' : '#a7e07b')};
  display: flex;
  flex-direction: column;
  align-items: center;
  transform: rotate(${(props) => props.isInversed && '-'}90deg) translate
    ${(props) => (props.isInversed ? 'X' : 'Y')} (-100%);
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
  margin: 0 32px 20px 32px;
  line-height: 24px;
  word-break: break-all;
`;

interface MnemonicProps {
  breakWords?: boolean;
}
const Mnemonic = styled.div<MnemonicProps>`
  font-size: 14px;
  text-align: center;
  font-weight: normal;
  margin: 0 16px 10px 16px;
  line-height: 17px;
  ${(props) => props.breakWords && 'word-break: break-all;'}
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
                  {translateRaw('PAPER_WALLET_YOUR_IDENTICON')}
                  <TextSubHeader noTopMargin={true}>
                    {translateRaw('PAPER_WALLET_LOOK_FOR_THIS_ICON')}
                  </TextSubHeader>
                </TextHeader>
              </IdenticonHeader>
              <TextSubHeader>{translateRaw('PAPER_WALLET_DEPOSIT_FUNDS_TO_WALLET')}</TextSubHeader>
              <TextSubHeader>{translateRaw('PAPER_WALLET_CHECK_BALANCE_OF_WALLET')}</TextSubHeader>
              <TextSubHeader>
                {translateRaw('PAPER_WALLET_NOT_SHARE_YOUR_PRIVATE_KEY')}
              </TextSubHeader>
            </InnerPartWrapper>
          </Part>
          <Part hasLeftBorder={true}>
            <InnerPartWrapper>
              <Notes>Notes:</Notes>
              {[...Array(7)].map((x: any, index: any) => (
                <HorizontalLine key={`${index}${x}`} />
              ))}
            </InnerPartWrapper>
          </Part>
          <Part>{this.getQRAddressWrapper(true)}</Part>
        </PartWrapper>
        <PartWrapper>
          <Part hasRightBorder={true} hasTopBorder={true}>
            <div>
              <MyCryptoImage src={myCryptoIcon} />
              <LogoText>{translateRaw('PAPER_WALLET')}</LogoText>
            </div>
          </Part>
          <Part hasRightBorder={true} hasTopBorder={true}>
            <WalletImage src={walletIcon} />
            <Resources>
              <Trans
                id="PAPER_WALLET_RESOURCES_AND_HELP"
                variables={{
                  $visitLink: () => getKBHelpArticle(KB_HELP_ARTICLE.HOME)
                }}
              />
            </Resources>
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
    let dataText = '';
    let data = '';
    if (isPrivate) {
      if (mnemonic) {
        data = mnemonic;
        dataText = translateRaw('YOUR_MNEMONIC_PHRASE');
      }
      if (privateKey) {
        data = privateKey;
        dataText = translateRaw('YOUR_PRIVATE_KEY');
      }
    } else {
      data = address;
    }
    const subTitle = isPrivate
      ? translateRaw('PAPER_WALLET_KEEP_THIS_SAFE')
      : translateRaw('PAPER_WALLET_SHARE_THIS_WITH_YOUR_FRIENDS');

    return (
      <InnerPartWrapper>
        <QRAddressWrapper isInversed={isPrivate}>
          <QRCodeTitle>{isPrivate ? translateRaw('PRIVATE') : translateRaw('PUBLIC')}</QRCodeTitle>
          <QRCodeSubTitle>{subTitle}</QRCodeSubTitle>
          <QRCodeWrapper>
            <QRCode data={data} />
          </QRCodeWrapper>
          <Path>
            {isPrivate && path && translateRaw('PAPER_WALLET_DERIVED_PATH', { $path: path })}
          </Path>
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
