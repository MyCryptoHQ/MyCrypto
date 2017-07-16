// @flow
import React, { Component } from "react";
import PropTypes from "prop-types";
import translate from "translations";
import printElement from "utils/printElement";
import { QRCode, Identicon } from "components/ui";

import ethLogo from "assets/images/logo-ethereum-1.png";
import sidebarImg from "assets/images/print-sidebar.png";
import notesBg from "assets/images/notes-bg.png";

const walletWidth = 680;
const walletHeight = 280;

type Props = {
  privateKey: string,
  address: string
};

export default class PrintableWallet extends Component {
  props: Props;
  static propTypes = {
    privateKey: PropTypes.string,
    address: PropTypes.string
  };

  print = () => {
    printElement(this._renderPaperWallet(), {
      popupFeatures: {
        width: walletWidth + 60,
        height: walletHeight + 60,
        scrollbars: "no"
      },
      styles: `
        * {
          box-sizing: border-box;
        }

        body {
          font-family: Lato, sans-serif;
          font-size: 1rem;
          line-height: 1.4;
          margin: 0;
        }
      `
    });
  };

  _renderPaperWallet() {
    const { privateKey, address } = this.props;
    const styles = {
      container: {
        position: "relative",
        margin: "0 auto",
        width: `${walletWidth}px`,
        height: `${walletHeight}px`,
        border: "1px solid #163151",
        userSelect: "none",
        cursor: "default"
      },

      // Images
      sidebar: {
        float: "left",
        height: "100%",
        width: "auto"
      },
      ethLogo: {
        position: "absolute",
        left: "86px",
        height: "100%",
        width: "auto",
        zIndex: "-1"
      },

      // Blocks / QR Codes
      block: {
        position: "relative",
        float: "left",
        width: "27.5%",
        padding: "20px"
      },
      blockText: {
        position: "absolute",
        top: "50%",
        left: "100%",
        width: "100%",
        margin: 0,
        transform: "translate(-50%, -50%) rotate(-90deg)",
        fontSize: "13px",
        fontWeight: "600",
        color: "#0b7290",
        textAlign: "center",
        textTransform: "uppercase",
        letterSpacing: "1px"
      },
      // Address / private key info
      infoContainer: {
        float: "left",
        width: "85%",
        padding: "0 20px"
      },
      infoText: {
        margin: "0 0 8px",
        textAlign: "left",
        fontSize: "14px",
        fontFamily: 'Menlo, Monaco, Consolas, "Courier New", monospace',
        fontWeight: 300
      },
      infoLabel: {
        fontWeight: 600
      },

      identiconContainer: {
        position: "absolute",
        right: "15px",
        bottom: "45px"
      },
      identiconWrapper: {
        float: "left",
        width: "42px",
        height: "42px",
        overflow: "hidden",
        backgroundSize: "100%",
        borderRadius: "50%",
        boxShadow: `
          inset rgba(255, 255, 255, 0.5) 0 2px 2px,
          inset rgba(0, 0, 0, 0.6) 0 -1px 8px
        `
      },
      identiconText: {
        float: "left",
        width: "130px",
        padding: "0 5px",
        margin: "12px 0 0",
        fontSize: "9px",
        textAlign: "center"
      },
      box: {
        width: 150,
        height: 150
      }
    };

    return (
      <div style={styles.container}>
        <img src={sidebarImg} style={styles.sidebar} />
        <img src={ethLogo} style={styles.ethLogo} />

        <div style={styles.block}>
          <div style={styles.box}>
            <QRCode data={this.props.address} />
          </div>
          <p style={styles.blockText}>YOUR ADDRESS</p>
        </div>

        <div style={styles.block}>
          <img src={notesBg} style={styles.box} />
          <p style={styles.blockText}>AMOUNT / NOTES</p>
        </div>

        <div style={styles.block}>
          <div style={styles.box}>
            <QRCode data={this.props.privateKey} />
          </div>
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
          <div style={styles.identiconWrapper}>
            <Identicon address={this.props.address} forPrinting />
          </div>
          <p style={styles.identiconText}>
            Always look for this icon when sending to this wallet
          </p>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div>
        {this._renderPaperWallet()}
        <a
          role="button"
          aria-label={translate("x_Print")}
          aria-describedby="x_PrintDesc"
          className={"btn btn-lg btn-primary"}
          onClick={this.print}
        >
          {translate("x_Print")}
        </a>
      </div>
    );
  }
}
