import React from 'react';
import { toDataUrl } from 'ethereum-blockies';
import { isValidAddress } from 'eth/validators';

type Props = {
    address: string
};

export default function Identicon(props: Props) {
    // FIXME breaks on failed checksums
    const style = !isValidAddress(props.address)
        ? {}
        : { backgroundImage: `url(${toDataUrl(props.address.toLowerCase())})` };
    return <div className="addressIdenticon" style={style} title="Address Indenticon" />;
}
