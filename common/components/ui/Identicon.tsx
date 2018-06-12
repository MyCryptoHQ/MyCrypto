import React from 'react';
import makeBlockie from 'ethereum-blockies-base64';
import { connect } from 'react-redux';
import { getIsValidAddressFn } from 'selectors/config';
import { AppState } from 'reducers';

interface OwnProps {
  address: string;
  className?: string;
  size?: string;
}

interface StateProps {
  isValidAddress: ReturnType<typeof getIsValidAddressFn>;
}

type Props = OwnProps & StateProps;

class Identicon extends React.Component<Props> {
  public render() {
    const size = this.props.size || '4rem';
    const { address, isValidAddress, className = '' } = this.props;
    const identiconDataUrl = isValidAddress(address) ? makeBlockie(address) : '';
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
}

export default connect((state: AppState): StateProps => ({
  isValidAddress: getIsValidAddressFn(state)
}))(Identicon);
