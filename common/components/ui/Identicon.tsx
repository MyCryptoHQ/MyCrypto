import { toDataUrl } from 'ethereum-blockies';
import { isValidETHAddress } from 'libs/validators';
import React from 'react';
import './Identicon.scss';

interface Props {
  address: string;
  size?: string;
}

export default function Identicon(props: Props) {
  const size = props.size || '4rem';
  // FIXME breaks on failed checksums
  const identiconDataUrl = isValidETHAddress(props.address) ? toDataUrl(props.address) : '';
  return (
    <div className="Identicon" title="Address Identicon" style={{ width: size, height: size }}>
      {identiconDataUrl && (
        <React.Fragment>
          <img src={identiconDataUrl} />
          <div className="border" />
        </React.Fragment>
      )}
    </div>
  );
}
