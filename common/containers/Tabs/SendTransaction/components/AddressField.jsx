// @flow
import React from 'react';
import { Identicon } from 'components/ui';
import { getEnsAddress } from 'selectors/ens';
import { connect } from 'react-redux';
import type { State } from 'reducers';
import { isValidENSorEtherAddress, isValidENSAddress } from 'libs/validators';
import { resolveEnsName } from 'actions/ens';
import translate from 'translations';

type StoreProps = {
  placeholder: string,
  value: string,
  onChange?: (value: string) => void
};

type Props = StoreProps & {
  ensAddress: ?string,
  resolveEnsName: typeof resolveEnsName
};

const mapStateToProps = (state: State, props: StoreProps) => ({
  ensAddress: getEnsAddress(state, props.value)
});

const mapDispatchToProps = {
  resolveEnsName
};

export class AddressField extends React.Component<Props> {
  render() {
    const { placeholder, value, ensAddress } = this.props;
    const isReadonly = !this.props.onChange;
    return (
      <div className="row form-group">
        <div className="col-xs-11">
          <label>
            {translate('SEND_addr')}:
          </label>
          <input
            className={`form-control ${isValidENSorEtherAddress(value)
              ? 'is-valid'
              : 'is-invalid'}`}
            type="text"
            value={value}
            placeholder={placeholder}
            onChange={this.onChange}
            disabled={isReadonly}
          />
          {!!ensAddress &&
            <p className="ens-response">
              ↳
              <span className="mono">{ensAddress}</span>
            </p>}
        </div>
        <div className="col-xs-1" style={{ padding: 0 }}>
          <Identicon address={ensAddress || value} />
        </div>
      </div>
    );
  }

  onChange = (e: SyntheticInputEvent<*>) => {
    const newValue = e.target.value;
    const { onChange } = this.props;
    if (!onChange) {
      return;
    }
    // FIXME debounce?
    if (isValidENSAddress(newValue)) {
      this.props.resolveEnsName(newValue);
    }
    onChange(newValue);
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AddressField);
