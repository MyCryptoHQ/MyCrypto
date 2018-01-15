import React, { Component } from 'react';
import { Identicon, Spinner } from 'components/ui';
import translate from 'translations';
import { Query } from 'components/renderCbs';
import { ICurrentTo, getCurrentTo, isValidCurrentTo } from 'selectors/transaction';
import { connect } from 'react-redux';
import { AppState } from 'reducers';
import { CallbackProps } from 'components/AddressFieldFactory';
import { addHexPrefix } from 'ethereumjs-util';
import { getResolvingDomain } from 'selectors/ens';
import { isValidENSAddress } from 'libs/validators';

interface StateProps {
  currentTo: ICurrentTo;
  isValid: boolean;
  isResolving: boolean;
}

interface OwnProps {
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
      <>
        <Spinner /> {text}
      </>
    );
  } else {
    return isENS ? <>{`Resolved Address: ${rawAddress}`}</> : null;
  }
};

type Props = OwnProps & StateProps;

class AddressInputFactoryClass extends Component<Props> {
  public render() {
    const { currentTo, onChange, isValid, withProps, isResolving } = this.props;
    const { value } = currentTo;
    const addr = addHexPrefix(value ? value.toString('hex') : '0');
    return (
      <div className="row form-group">
        <div className="col-xs-11">
          <label>{translate('SEND_addr')}:</label>
          <Query
            params={['readOnly']}
            withQuery={({ readOnly }) =>
              withProps({
                currentTo,
                isValid,
                onChange,
                readOnly: !!readOnly || this.props.isResolving
              })
            }
          />
          <ENSStatus ensAddress={currentTo.raw} isLoading={isResolving} rawAddress={addr} />
        </div>
        <div className="col-xs-1" style={{ padding: 0 }}>
          <Identicon address={addr} />
        </div>
      </div>
    );
  }
}

export const AddressInputFactory = connect((state: AppState) => ({
  currentTo: getCurrentTo(state),
  isResolving: getResolvingDomain(state),
  isValid: isValidCurrentTo(state)
}))(AddressInputFactoryClass);
