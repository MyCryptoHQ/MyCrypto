// @flow

import React from 'react';
import translate from 'translations';

export default class GasField extends React.Component {
    props: {
        value: string,
        onChange?: (value: string) => void | null
    };
    render() {
        const { value, onChange } = this.props;
        const isReadonly = !onChange;

        return (
            <div className="row form-group">
                <div className="col-sm-11 clearfix">
                    <label>{translate('TRANS_gas')} </label>
                    <input
                        className={`form-control ${isFinite(parseFloat(value)) &&
                            parseFloat(value) > 0
                            ? 'is-valid'
                            : 'is-invalid'}`}
                        type="text"
                        placeholder="21000"
                        disabled={isReadonly}
                        value={value}
                        onChange={this.onChange}
                    />
                </div>
            </div>
        );
    }

    onChange = (e: SyntheticInputEvent) => {
        if (this.props.onChange) {
            this.props.onChange(e.target.value);
        }
    };
}
