import React, { Component } from 'react';
import { Identicon, Spinner } from 'components/ui';
import { Query } from 'components/renderCbs';
import { translateRaw } from 'translations';
import {
  ICurrentTo,
  getCurrentTo,
  isValidCurrentTo,
  isCurrentToLabelEntry
} from 'selectors/transaction';
import { getCurrentToLabel } from 'selectors/addressBook';
import { connect } from 'react-redux';
import { AppState } from 'reducers';
import { CallbackProps } from 'components/AddressFieldFactory';
import { addHexPrefix } from 'ethereumjs-util';
import { getWalletInst } from 'selectors/wallet';
import { getResolvingDomain } from 'selectors/ens';
import { isValidENSAddress } from 'libs/validators';
import { Address } from 'libs/units';
import AddressFieldDropdown from './AddressFieldDropdown';
import './AddressInputFactory.scss';

interface StateProps {
  currentTo: ICurrentTo;
  label: string | null;
  isValid: boolean;
  isLabelEntry: boolean;
  isResolving: boolean;
}

interface OwnProps {
  isSelfAddress?: boolean;
  showLabelMatch?: boolean;
  isFocused?: boolean;
  onChange(ev: React.FormEvent<HTMLInputElement>): void;
  onFocus(ev: React.FormEvent<HTMLInputElement>): void;
  onBlur(ev: React.FormEvent<HTMLInputElement>): void;
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
    const {
      label,
      currentTo,
      onChange,
      onFocus,
      onBlur,
      isValid,
      isLabelEntry,
      withProps,
      showLabelMatch,
      isSelfAddress,
      isResolving,
      isFocused
    } = this.props;
    const { value } = currentTo;
    const addr = addHexPrefix(value ? value.toString('hex') : '0');
    const inputClassName = `AddressInput-input ${label ? 'AddressInput-input-with-label' : ''}`;
    const sendingTo = `${translateRaw('SENDING_TO')} ${label}`;
    const isENSAddress = currentTo.raw.includes('.eth');

    return (
      <div className="AddressInput form-group">
        <div className={inputClassName}>
          <Query
            params={['readOnly']}
            withQuery={({ readOnly }) =>
              withProps({
                currentTo,
                isValid,
                isLabelEntry,
                onChange,
                onFocus,
                onBlur,
                readOnly: !!(readOnly || this.props.isResolving || isSelfAddress)
              })
            }
          />
          <ENSStatus ensAddress={currentTo.raw} isLoading={isResolving} rawAddress={addr} />
          {isFocused && !isENSAddress && <AddressFieldDropdown />}
          {showLabelMatch &&
            label && (
              <div title={sendingTo} className="AddressInput-input-label">
                <i className="fa fa-check" /> {sendingTo}
              </div>
            )}
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
    label: getCurrentToLabel(state),
    isResolving: getResolvingDomain(state),
    isValid: isValidCurrentTo(state),
    isLabelEntry: isCurrentToLabelEntry(state)
  };
})(AddressInputFactoryClass);
