import React from 'react';
import wifiOn from 'assets/images/wifi-on.svg';
import wifiOff from 'assets/images/wifi-off.svg';

type sizeType = 'small' | 'medium' | 'large';

interface OfflineSymbolProps {
  offline: boolean;
  size?: sizeType;
}

const OfflineSymbol = ({ offline, size }: OfflineSymbolProps) => {
  let width = 30;
  let height = 12;

  switch (size) {
    case 'medium':
      width = width * 3;
      height = height * 3;
      break;
    case 'large':
      width = width * 4;
      height = height * 4;
      break;
    default:
      break;
  }

  return <img src={offline ? wifiOff : wifiOn} width={width} height={height} />;
};

export default OfflineSymbol;
