import { isValidETHAddress } from 'libs/validators';
import React from 'react';
import makeBlockie from 'ethereum-blockies-base64';

interface Props {
  address: string;
  className?: string;
  size?: string;
}

export default function Identicon(props: Props) {
  const size = props.size || '4rem';
  const { address, className = '' } = props;
  const identiconDataUrl = isValidETHAddress(address) ? makeBlockie(address) : '';
  return (
    // Use inline styles for printable wallets
    <div
      className={`Identicon ${className}`}
      title="Address Identicon"
      style={{ width: size, height: size, position: 'relative' }}
      aria-hidden={!identiconDataUrl}
    >
      {identiconDataUrl && (
        <img
          src={identiconDataUrl}
          alt="Unique Address Image"
          style={{
            height: '100%',
            width: '100%',
            padding: '0px',
            borderRadius: '50%'
          }}
        />
      )}
      <div
        className="border"
        style={{
          position: 'absolute',
          height: '100%',
          width: '100%',
          top: 0,
          boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.15), inset 0 0 3px 0 rgba(0, 0, 0, 0.15)',
          borderRadius: '50%',
          pointerEvents: 'none'
        }}
      />
    </div>
  );
}
