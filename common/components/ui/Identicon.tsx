import { toDataUrl } from 'ethereum-blockies';
import { isValidETHAddress } from 'libs/validators';
import React from 'react';

interface Props {
  address: string;
  size?: string;
}

export default function Identicon(props: Props) {
  const size = props.size || '4rem';
  // FIXME breaks on failed checksums
  const identiconDataUrl = isValidETHAddress(props.address) ? toDataUrl(props.address) : '';
  return (
    <div style={{ position: 'relative', width: size, height: size }} title="Address Identicon">
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          borderRadius: '50%',

          boxShadow: `
                    inset rgba(255, 255, 255, 0.5) 0 2px 2px,
                    inset rgba(0, 0, 0, 0.6) 0 -1px 8px
                  `
        }}
      />
      {identiconDataUrl && (
        <img
          src={identiconDataUrl}
          style={{
            borderRadius: '50%',
            width: '100%',
            height: '100%'
          }}
        />
      )}
    </div>
  );
}
