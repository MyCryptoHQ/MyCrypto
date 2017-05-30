import React, {Component} from 'react';
import PropTypes from 'prop-types';


export default class GenerateWalletPasswordInputComponent extends Component {
    constructor(props) {
        super(props)
    }

    static propTypes = {
        showGenerateWalletPasswordAction: PropTypes.func,
        showPassword: PropTypes.bool,
        input: PropTypes.object,
        meta: PropTypes.object
    };


    render() {
        return (
            <div>
                <div>
                    <div className="input-group" style={{width: '100%'}}>
                        <input {...this.props.input}
                               name="password"
                               className={this.props.meta.error ? 'form-control is-invalid' : 'form-control'}
                               type={this.props.showPassword ? 'text' : 'password'}
                               placeholder="Do NOT forget to save this!"
                               aria-label="Enter a strong password (at least 9 characters)"/>
                        <span
                            onClick={() => this.props.showGenerateWalletPasswordAction()}
                            aria-label="make password visible"
                            role="button"
                            className="input-group-addon eye"/>
                    </div>
                </div>

                {/*TODO - if we want descriptive errors we could re-enable this*/}
                {/*{this.props.meta.touched && this.props.meta.error &&*/}
                {/*<div>*/}
                    {/*<p className="error">{this.props.meta.error}</p>*/}
                {/*</div>*/}
                {/*}*/}

            </div>
        )
    }

}
