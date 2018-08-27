import React from 'react';
import { connect } from 'react-redux';
import makeBlockie from 'ethereum-blockies-base64';

import { AppState } from 'features/reducers';
import { configSelectors } from 'features/config';
import './Identicon.scss';

interface OwnProps {
  address: string;
  className?: string;
  size?: string;
}

interface StateProps {
  isValidAddress: ReturnType<typeof configSelectors.getIsValidAddressFn>;
}

type Props = OwnProps & StateProps;

const Identicon: React.SFC<Props> = props => {
  const size = props.size || '4rem';
  const { address, isValidAddress, className = '' } = props;
  const identiconDataUrl = isValidAddress(address) ? makeBlockie(address) : '';

  return (
    // Use inline styles for printable wallets
    <div
      className={`Identicon ${className}`}
      title="Address Identicon"
      style={{ width: size, height: size }}
      aria-hidden={!identiconDataUrl}
    >
      {identiconDataUrl && (
        <img className="Identicon-img" src={identiconDataUrl} alt="Unique Address Image" />
      )}
      <div className="Identicon-shadow" />
    </div>
  );
};

export default connect((state: AppState): StateProps => ({
  isValidAddress: configSelectors.getIsValidAddressFn(state)
}))(Identicon);
