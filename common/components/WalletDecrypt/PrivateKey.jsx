// @flow
import React, { Component } from 'react';
import translate from 'translations';
import { isValidPrivKey } from 'libs/validators';
import type { PrivateKeyUnlockParams } from 'libs/wallet/privkey';

export type PrivateKeyValue = PrivateKeyUnlockParams & {
    valid: boolean
};

function fixPkey(key) {
    if (key.indexOf('0x') === 0) {
        return key.slice(2);
    }
    return key;
}

export default class PrivateKeyDecrypt extends Component {
    props: {
        value: PrivateKeyUnlockParams,
        onChange: (value: PrivateKeyUnlockParams) => void,
        onUnlock: () => void
    };

    render() {
        const { key, password } = this.props.value;
        const fixedPkey = fixPkey(key);
        const isValid = isValidPrivKey(fixedPkey.length);
        const isPassRequired = fixedPkey.length > 64;

        return (
            <section className="col-md-4 col-sm-6">
                <div id="selectedTypeKey">
                    <h4>
                        {translate('ADD_Radio_3')}
                    </h4>
                    <div className="form-group">
                        <textarea
                            id="aria-private-key"
                            className={`form-control ${isValid ? 'is-valid' : 'is-invalid'}`}
                            value={key}
                            onChange={this.onPkeyChange}
                            onKeyDown={this.onKeyDown}
                            placeholder={translate('x_PrivKey2')}
                            rows="4"
                        />
                    </div>
                    {isValid &&
                        isPassRequired &&
                        <div className="form-group">
                            <p>
                                {translate('ADD_Label_3')}
                            </p>
                            <input
                                className={`form-control ${password.length > 0
                                    ? 'is-valid'
                                    : 'is-invalid'}`}
                                value={password}
                                onChange={this.onPasswordChange}
                                onKeyDown={this.onKeyDown}
                                placeholder={translate('x_Password')}
                                type="password"
                            />
                        </div>}
                </div>
            </section>
        );
    }

    onPkeyChange = (e: SyntheticInputEvent) => {
        const fixedPkey = fixPkey(e.target.value);
        const isValid = isValidPrivKey(fixedPkey.length);
        const isPassRequired = fixedPkey.length > 64;
        const valid = isValid && (isPassRequired ? this.props.value.password.length > 0 : true);

        this.props.onChange({ ...this.props.value, key: e.target.value, valid });
    };

    onPasswordChange = (e: SyntheticInputEvent) => {
        const fixedPkey = fixPkey(this.props.value.key);
        const isValid = isValidPrivKey(fixedPkey.length);
        const isPassRequired = fixedPkey.length > 64;
        const valid = isValid && (isPassRequired ? e.target.value.length > 0 : true);

        this.props.onChange({ ...this.props.value, password: e.target.value, valid });
    };

    onKeyDown = (e: SyntheticKeyboardEvent) => {
        if (e.keyCode === 13) {
            e.preventDefault();
            e.stopPropagation();
            this.props.onUnlock();
        }
    };
}
