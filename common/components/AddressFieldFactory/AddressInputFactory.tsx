import React, { Component } from 'react';
import { Identicon, Spinner } from 'components/ui';
import { Query } from 'components/renderCbs';
import { ICurrentTo, getCurrentTo, isValidCurrentTo } from 'selectors/transaction';
import { connect } from 'react-redux';
import { AppState } from 'reducers';
import { CallbackProps } from 'components/AddressFieldFactory';
import { addHexPrefix } from 'ethereumjs-util';
import { getWalletInst } from 'selectors/wallet';
import { getResolvingDomain } from 'selectors/ens';
import { isValidENSAddress } from 'libs/validators';
import { Address } from 'libs/units';
import './AddressInputFactory.scss';

interface StateProps {
  currentTo: ICurrentTo;
  isValid: boolean;
  isResolving: boolean;
}

interface OwnProps {
  isSelfAddress?: boolean;
  onChange(ev: React.FormEvent<HTMLInputElement>): void;
  withProps(props: CallbackProps): React.ReactElement<any> | null;
}

const ENSStatus: React.SFC<{ isLoading: boolean; ensAddress: string; rawAddress: string }> = ({
  isLoading,
  ensAddress,
  rawAddress
}) => {
  const isENS = isValidENSAddress(ensAddress);
  const text = 'Loading ENS address...';
  if (isLoading) {
    return (
      <React.Fragment>
        <Spinner /> {text}
      </React.Fragment>
    );
  } else {
    return isENS ? <React.Fragment>{`Resolved Address: ${rawAddress}`}</React.Fragment> : null;
  }
};

type Props = OwnProps & StateProps;

class AddressInputFactoryClass extends Component<Props> {
  public render() {
    const { currentTo, onChange, isValid, withProps, isSelfAddress, isResolving } = this.props;
    const { value } = currentTo;
    const addr = addHexPrefix(value ? value.toString('hex') : '0');
    return (
      <div className="AddressInput form-group">
        <div className="AddressInput-input">
          <Query
            params={['readOnly']}
            withQuery={({ readOnly }) =>
              withProps({
                currentTo,
                isValid,
                onChange,
                readOnly: !!(readOnly || this.props.isResolving || isSelfAddress)
              })
            }
          />
          <ENSStatus ensAddress={currentTo.raw} isLoading={isResolving} rawAddress={addr} />
        </div>
        <div className="AddressInput-identicon">
          <Identicon address={addr} />
        </div>
      </div>
    );
  }
}

export const AddressInputFactory = connect((state: AppState, ownProps: OwnProps) => {
  let currentTo: ICurrentTo;
  if (ownProps.isSelfAddress) {
    const wallet = getWalletInst(state);
    const addr = wallet ? wallet.getAddressString() : '';
    currentTo = {
      raw: addr,
      value: Address(addr)
    };
  } else {
    currentTo = getCurrentTo(state);
  }

  return {
    currentTo,
    isResolving: getResolvingDomain(state),
    isValid: isValidCurrentTo(state)
  };
})(AddressInputFactoryClass);
