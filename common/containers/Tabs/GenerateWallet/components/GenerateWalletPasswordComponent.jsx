import React, {Component} from "react";
import PropTypes from "prop-types";

import {Field, reduxForm} from "redux-form"; // ES6
import GenerateWalletPasswordInputComponent from "./GenerateWalletPasswordInputComponent";
const minLength = min => value =>
    value && value.length < min ? `Must be ${min} characters or more` : undefined
const minLength9 = minLength(9)


const required = value => value ? undefined : 'Required'


class GenerateWalletPasswordComponent extends Component {
    constructor(props) {
        super(props)
    }

    static propTypes = {
        title: PropTypes.string,
        body: PropTypes.string,
        userId: PropTypes.number,
        id: PropTypes.number,
        generateWalletPassword: PropTypes.object,
        showPassword: PropTypes.bool,
        showGenerateWalletPasswordAction: PropTypes.func,
        generateWalletFileAction: PropTypes.func,
        generateWalletFile: PropTypes.bool
    };

    generateWallet() {
        console.log("got here")
    }

    showPassword() {

    }

    render() {
        const {
            // handleSubmit,
            // pristine,
            // reset,
            // submitting,
            generateWalletPassword,
            showPassword,
            showGenerateWalletPasswordAction,
            generateWalletFileAction,
            generateWalletFile

        } = this.props;

        return (
            <section className="container" style={{minHeight: '50%'}}>
                <div className="tab-content">
                    <main className="tab-pane active text-center" role="main">
                        <section className="row">
                            <h1 aria-live="polite">Generate Wallet</h1>
                            <div className="col-sm-8 col-sm-offset-2">
                                <h4>Enter a strong password (at least 9 characters)</h4>
                                <Field
                                    validate={[required, minLength9]}
                                    component={GenerateWalletPasswordInputComponent}
                                    showPassword={showPassword}
                                    showGenerateWalletPasswordAction={showGenerateWalletPasswordAction}
                                    name="password"
                                    type="text"/>
                                <br/>
                                <button onClick={() => generateWalletFileAction()}
                                        disabled={generateWalletPassword ? generateWalletPassword.syncErrors : true}
                                        className="btn btn-primary btn-block">
                                    Generate Wallet
                                </button>

                                {
                                    generateWalletFile && (
                                        <div>
                                            <br/>
                                            <p style={{color: 'red'}}> Now you need to confirm that you copied your seed!</p>
                                        </div>)

                                    }
                            </div>
                        </section>
                    </main>
                </div>
            </section>
        )
    }
}

export default reduxForm({
    form: 'generateWalletPassword' // a unique name for this form
})(GenerateWalletPasswordComponent);