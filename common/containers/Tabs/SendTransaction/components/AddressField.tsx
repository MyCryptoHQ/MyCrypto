import { resolveEnsName } from 'actions/ens';
import { Identicon } from 'components/ui';
import { isValidENSAddress, isValidENSorEtherAddress } from 'libs/validators';
import React from 'react';
import { connect } from 'react-redux';
import { AppState } from 'reducers';
import { getEnsAddress } from 'selectors/ens';
import translate from 'translations';

interface PublicProps {
  placeholder: string;
  value: string;
  onChange: ((value: string) => void) | null;
}

interface Props extends PublicProps {
  ensAddress: string | null;
  resolveEnsName: typeof resolveEnsName;
}
export class AddressField extends React.Component<Props> {
  public render() {
    const { placeholder, value, ensAddress } = this.props;
    const isReadonly = !this.props.onChange;
    return (
      <div className="row form-group">
        <div className="col-xs-11">
          <label>{translate('SEND_addr')}:</label>
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
          {!!ensAddress && (
            <p className="ens-response">
              ↳
              <span className="mono">{ensAddress}</span>
            </p>
          )}
        </div>
        <div className="col-xs-1" style={{ padding: 0 }}>
          <Identicon address={ensAddress || value} />
        </div>
      </div>
    );
  }

  public onChange = (e: React.SyntheticEvent<HTMLInputElement>) => {
    const newValue = (e.target as HTMLInputElement).value;
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

function mapStateToProps(state: AppState, props: PublicProps) {
  return {
    ensAddress: getEnsAddress(state, props.value)
  };
}

export default connect(mapStateToProps, { resolveEnsName })(AddressField);
