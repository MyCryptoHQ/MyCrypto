import React, { Component } from 'react';
import { render } from 'react-dom';
import PropTypes from 'prop-types';
import translate from 'translations';
import QRCode from 'qrcode';
import { toDataUrl as makeIdenticon } from 'ethereum-blockies';

import ethLogo from 'assets/images/logo-ethereum-1.png';
import sidebarImg from 'assets/images/print-sidebar.png';
import notesBg from 'assets/images/notes-bg.png';

export default class PrintableWallet extends Component {
  static propTypes = {
    privateKey: PropTypes.string,
    address: PropTypes.string
  };

  state = {
    qrCodePkey: null,
    qrCodeAddress: null
  };

  componentDidMount() {
    // Start generating QR Codes as soon as component is ready
    const opts = {
      color: {
        dark: '#000',
        light: '#fff'
      },
      margin: 0,
      errorCorrectionLevel: 'H'
    };

    QRCode.toDataURL(this.props.privateKey, opts, (err, url) => {
      this.setState({ qrCodePkey: url });
    });

    QRCode.toDataURL(this.props.address, opts, (err, url) => {
      this.setState({ qrCodeAddress: url });
    });
  }

  print = () => {
    const popup = window.open(
      'about:blank',
      'printWalletWindow',
      'width=740,height=340,scrollbars=no'
    );

    // We'll save ourselves from re-rendering by just using a ref for the html
    focus();
    popup.document.open();
    popup.document.write(`
			<html>
				<head>
					<style>
						* {
							box-sizing: border-box;
						}

						body {
							font-family: Lato, sans-serif;
							font-size: 1rem;
							line-height: 1.4;
							margin: 0;
						}
					</style>
					<script>
						setTimeout(function() {
							window.print();
						}, 500);
					</script>
				</head>
				<body>
					${this._wallet.outerHTML}
				</body>
			</html>
		`);
  };

  _renderPaperWallet() {
    const { privateKey, address } = this.props;
    const { qrCodePkey, qrCodeAddress } = this.state;
    const styles = {
      container: {
        position: 'relative',
        margin: '0 auto',
        width: '680px',
        height: '280px',
        border: '1px solid #163151',
        userSelect: 'none',
        cursor: 'default'
      },

      // Images
      sidebar: {
        float: 'left',
        height: '100%',
        width: 'auto'
      },
      ethLogo: {
        position: 'absolute',
        left: '86px',
        height: '100%',
        width: 'auto',
        zIndex: '-1'
      },

      // Blocks / QR Codes
      block: {
        position: 'relative',
        float: 'left',
        width: '27.5%',
        padding: '20px'
      },
      blockText: {
        position: 'absolute',
        top: '50%',
        left: '100%',
        width: '100%',
        margin: 0,
        transform: 'translate(-50%, -50%) rotate(-90deg)',
        fontSize: '13px',
        fontWeight: '600',
        color: '#0b7290',
        textAlign: 'center',
        textTransform: 'uppercase',
        letterSpacing: '1px'
      },
      qrCode: {
        width: '150px',
        height: '150px',
        backgroundSize: '100%'
      },

      // Address / private key info
      infoContainer: {
        float: 'left',
        width: '85%',
        padding: '0 20px'
      },
      infoText: {
        margin: '0 0 8px',
        textAlign: 'left',
        fontSize: '14px',
        fontFamily: 'Menlo, Monaco, Consolas, "Courier New", monospace',
        fontWeight: 300
      },
      infoLabel: {
        fontWeight: 600
      },

      identiconContainer: {
        position: 'absolute',
        right: '15px',
        bottom: '45px'
      },
      identiconImg: {
        float: 'left',
        width: '42px',
        height: '42px',
        backgroundImage: `url('${makeIdenticon(address)}')`,
        backgroundSize: '100%',
        borderRadius: '50%',
        boxShadow: `
					inset rgba(255, 255, 255, 0.5) 0 2px 2px,
					inset rgba(0, 0, 0, 0.6) 0 -1px 8px
				`
      },
      identiconText: {
        float: 'left',
        width: '130px',
        padding: '0 5px',
        margin: '12px 0 0',
        fontSize: '9px',
        textAlign: 'center'
      }
    };

    return (
      <div style={styles.container} ref={el => (this._wallet = el)}>
        <img src={sidebarImg} style={styles.sidebar} />
        <img src={ethLogo} style={styles.ethLogo} />

        <div style={styles.block}>
          <img src={qrCodeAddress} style={styles.qrCode} />
          <p style={styles.blockText}>YOUR ADDRESS</p>
        </div>

        <div style={styles.block}>
          <img src={notesBg} style={styles.qrCode} />
          <p style={styles.blockText}>AMOUNT / NOTES</p>
        </div>

        <div style={styles.block}>
          <img src={qrCodePkey} style={styles.qrCode} />
          <p style={styles.blockText}>YOUR PRIVATE KEY</p>
        </div>

        <div style={styles.infoContainer}>
          <p style={styles.infoText}>
            <strong style={styles.infoLabel}>Your Address:</strong>
            <br />
            {address}
          </p>
          <p style={styles.infoText}>
            <strong style={styles.infoLabel}>Your Private Key:</strong>
            <br />
            {privateKey}
          </p>
        </div>

        <div style={styles.identiconContainer}>
          <div style={styles.identiconImg} />
          <p style={styles.identiconText}>
            Always look for this icon when sending to this wallet
          </p>
        </div>
        <div style={styles.identicon} />
      </div>
    );
  }

  render() {
    const qrCodesReady = this.state.qrCodePkey && this.state.qrCodeAddress;
    const btnDisabled = qrCodesReady ? '' : 'btn-disabled';

    return (
      <div>
        {this._renderPaperWallet()}
        <a
          role="button"
          aria-label={translate('x_Print')}
          aria-describedby="x_PrintDesc"
          className={`btn btn-lg btn-primary ${btnDisabled}`}
          onClick={this.print}
        >
          {translate('x_Print')}
        </a>
      </div>
    );
  }
}
