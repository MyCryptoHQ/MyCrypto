import { toDataUrl } from 'ethereum-blockies';
import { isValidETHAddress } from 'libs/validators';
import React from 'react';

interface Props {
  address: string;
  className?: string;
  size?: string;
}

export default function Identicon(props: Props) {
  const size = props.size || '4rem';
  const { address, className } = props;
  // FIXME breaks on failed checksums
  const identiconDataUrl = isValidETHAddress(address) ? toDataUrl(address) : '';
  return (
    // Use inline styles for printable wallets
    <div
      className={`Identicon ${className}`}
      title="Address Identicon"
      style={{ width: size, height: size, position: 'relative' }}
    >
      {identiconDataUrl && (
        <React.Fragment>
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
          <div
            className="border"
            style={{
              position: 'absolute',
              height: 'inherit',
              width: 'inherit',
              top: 0,
              boxShadow: '0 3px 8px 0 rgba(0, 0, 0, 0.1), inset 0 0 3px 0 rgba(0, 0, 0, 0.1)',
              borderRadius: '50%'
            }}
          />
        </React.Fragment>
      )}
    </div>
  );
}
