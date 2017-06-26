// @flow
import React from 'react';
import { Identicon } from 'components/ui';
import { getEnsAddress } from 'selectors/ens';
import { connect } from 'react-redux';
import type { State } from 'reducers';
import { isValidENSorEtherAddress, isValidENSAddress } from 'libs/validators';
import { resolveEnsName } from 'actions/ens';

type PublicProps = {
    placeholder: string,
    value: string,
    onChange?: (value: string) => void
};

export class AddressField extends React.Component {
    props: PublicProps & {
        ensAddress: ?string,
        resolveEnsName: typeof resolveEnsName
    };

    render() {
        const { placeholder, value, ensAddress } = this.props;
        const isReadonly = !this.props.onChange;
        return (
            <div className="row form-group">
                <div className="col-xs-11">
                    <label translate="SEND_addr"> To Address: </label>
                    <input
                        className={`form-control ${isValidENSorEtherAddress(value)
                            ? 'is-valid'
                            : 'is-invalid'}`}
                        type="text"
                        placeholder={placeholder}
                        onChange={this.onChange}
                        disabled={isReadonly}
                    />
                    {!!ensAddress &&
                        <p className="ens-response">
                            ↳
                            <span className="mono">
                                {ensAddress}
                            </span>
                        </p>}
                </div>
                <div className="col-xs-1 address-identicon-container">
                    <Identicon address={ensAddress || value} />
                </div>
            </div>
        );
    }

    onChange = (e: SyntheticInputEvent) => {
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

function mapStateToProps(state: State, props: PublicProps) {
    return {
        ensAddress: getEnsAddress(state, props.value)
    };
}

export default connect(mapStateToProps, { resolveEnsName })(AddressField);
