import React from 'react';
import wifiOn from 'assets/images/wifi_white_24px.svg';
import wifiOff from 'assets/images/wifi_off_white_24px.svg';

const styles = {
  margin: '0px 8px 0px 0px'
};

interface Props {
  offline: boolean;
}

const OfflineSymbol = ({ offline }: Props) => (
  <img src={offline ? wifiOff : wifiOn} style={styles} />
);

export default OfflineSymbol;
