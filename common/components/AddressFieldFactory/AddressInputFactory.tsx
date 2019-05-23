import React, { Component } from 'react';
import { connect } from 'react-redux';
import { addHexPrefix } from 'ethereumjs-util';

import translate, { translateRaw } from 'translations';
import { Address } from 'libs/units';
import { ICurrentTo } from 'features/types';
import { AppState } from 'features/reducers';
import * as selectors from 'features/selectors';
import { walletSelectors } from 'features/wallet';
import { ensSelectors } from 'features/ens';
import { Identicon, Spinner } from 'components/ui';
import { Query } from 'components/renderCbs';
import { CallbackProps } from 'components/AddressFieldFactory';
import AddressFieldDropdown from './AddressFieldDropdown';
import './AddressInputFactory.scss';
import { configSelectors } from 'features/config';
import { getIsValidENSAddressFunction } from 'libs/validators';
import { getENSTLDForChain } from 'libs/ens/networkConfigs';

interface StateProps {
  currentTo: ICurrentTo;
  label: string | null;
  isValid: boolean;
  isLabelEntry: boolean;
  isResolving: boolean;
  chainId: number;
}

interface OwnProps {
  isSelfAddress?: boolean;
  showLabelMatch?: boolean;
  showIdenticon?: boolean;
  showEnsResolution?: boolean;
  isFocused?: boolean;
  className?: string;
  value?: string;
  dropdownThreshold?: number;
  onChange(ev: React.FormEvent<HTMLInputElement>): void;
  onChangeOverride?(ev: React.FormEvent<HTMLInputElement>): void;
  onFocus(ev: React.FormEvent<HTMLInputElement>): void;
  onBlur(ev: React.FormEvent<HTMLInputElement>): void;
  withProps(props: CallbackProps): React.ReactElement<any> | null;
}

const ENSStatus: React.SFC<{
  isLoading: boolean;
  ensAddress: string;
  rawAddress: string;
  chainId: number;
}> = ({ isLoading, ensAddress, rawAddress, chainId }) => {
  const isValidENS = getIsValidENSAddressFunction(chainId);
  const isENS = isValidENS(ensAddress);

  const text = translate('LOADING_ENS_ADDRESS');

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
      isFocused,
      showIdenticon = true,
      onChangeOverride,
      value,
      dropdownThreshold,
      showEnsResolution,
      chainId
    } = this.props;
    const inputClassName = `AddressInput-input ${label ? 'AddressInput-input-with-label' : ''}`;
    const sendingTo = label
      ? translateRaw('SENDING_TO', {
          $label: label
        })
      : '';
    const ensTLD = getENSTLDForChain(chainId);
    const isENSAddress = currentTo.raw.endsWith(`.${ensTLD}`);

    /**
     * @desc Initially set the address to the passed value.
     *  If there wasn't a value passed, use the value from the redux store.
     */
    let addr = value;

    if (addr == null) {
      addr = addHexPrefix(currentTo.value ? currentTo.value.toString('hex') : '0');
    }

    /**
     * @desc If passed a value and an onChangeOverride function,
     *  infer that the dropdown should be uncontrolled.
     */
    const controlled = value == null && !onChangeOverride;

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
          {showEnsResolution && (
            <ENSStatus
              ensAddress={currentTo.raw}
              isLoading={isResolving}
              rawAddress={addr}
              chainId={chainId}
            />
          )}
          {isFocused &&
            !isENSAddress && (
              <AddressFieldDropdown
                controlled={controlled}
                value={value}
                onChangeOverride={onChangeOverride}
                dropdownThreshold={dropdownThreshold}
              />
            )}
          {showLabelMatch &&
            label && (
              <div title={sendingTo} className="AddressInput-input-label">
                <i className="fa fa-check" /> {sendingTo}
              </div>
            )}
        </div>
        {showIdenticon && (
          <div className="AddressInput-identicon">
            <Identicon address={addr} />
          </div>
        )}
      </div>
    );
  }
}

export const AddressInputFactory = connect((state: AppState, ownProps: OwnProps) => {
  let currentTo: ICurrentTo;
  if (ownProps.isSelfAddress) {
    const wallet = walletSelectors.getWalletInst(state);
    const addr = wallet ? wallet.getAddressString() : '';
    currentTo = {
      raw: addr,
      value: Address(addr)
    };
  } else {
    currentTo = selectors.getCurrentTo(state);
  }

  return {
    currentTo,
    label: selectors.getCurrentToLabel(state),
    isResolving: ensSelectors.getResolvingDomain(state),
    isValid: selectors.isValidCurrentTo(state),
    isLabelEntry: selectors.isCurrentToLabelEntry(state),
    chainId: configSelectors.getNetworkChainId(state)
  };
})(AddressInputFactoryClass);
