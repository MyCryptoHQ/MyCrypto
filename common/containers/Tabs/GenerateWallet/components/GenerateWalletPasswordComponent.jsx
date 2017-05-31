import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Field, reduxForm} from 'redux-form';
import GenerateWalletPasswordInputComponent from './GenerateWalletPasswordInputComponent';
import LedgerTrezorWarning from './LedgerTrezorWarning';
import translate from 'translations';


// VALIDATORS
const minLength = min => value => {
    return value && value.length < min ? `Must be ${min} characters or more` : undefined
};
const minLength9 = minLength(9);
const required = value => value ? undefined : 'Required';


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
        generateWalletHasDownloadedFileAction: PropTypes.func,
        generateWalletFile: PropTypes.bool,
        hasDownloadedWalletFile: PropTypes.bool,
        generateWalletContinueToPaperAction: PropTypes.func,
        canProceedToPaper: PropTypes.bool
    };


    continueToPaper() {
    }

    downloaded() {
        let nextState = this.state;
        nextState.hasDownloadedWalletFile = true;
        this.setState(nextState)
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
            generateWalletFile,
            hasDownloadedWalletFile,
            generateWalletHasDownloadedFileAction,
            generateWalletContinueToPaperAction
            // canProceedToPaper

        } = this.props;

        return (
            <section className="container" style={{minHeight: '50%'}}>
                <div className="tab-content">
                    <main className="tab-pane active text-center" role="main">
                        <br/>
                        {
                            !generateWalletFile && (
                                <div>
                                    <section className="row">
                                        <h1 aria-live="polite">{translate('NAV_GenerateWallet')}</h1>
                                        <div className="col-sm-8 col-sm-offset-2">
                                            <h4>{translate('HELP_1_Desc_3')}</h4>
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
                                                {translate('NAV_GenerateWallet')}
                                            </button>
                                        </div>
                                    </section>
                                    <LedgerTrezorWarning/>
                                </div>
                            )
                        }
                        {
                            generateWalletFile && (
                                <section role="main" className="row">
                                    <h1>{translate('GEN_Label_2')}</h1>
                                    <br/>
                                    <div className="col-sm-8 col-sm-offset-2">
                                        <div aria-hidden="true" className="account-help-icon"><img
                                            src="https://myetherwallet.com/images/icon-help.svg" className="help-icon"/>
                                            <p className="account-help-text">{translate('x_KeystoreDesc')}</p>
                                            <h4>{translate('x_Keystore2')}</h4>
                                        </div>
                                        <a role="button" className="btn btn-primary btn-block"
                                           href="blob:https://myetherwallet.com/2455ae32-916f-4224-a806-414bbe680168"
                                           download="UTC--2017-04-26T23-07-03.538Z--c5b7fff4e1669e38e8d6bc8fffe7e562b2b70f43"
                                           aria-label="Download Keystore File (UTC / JSON · Recommended · Encrypted)"
                                           aria-describedby="x_KeystoreDesc"
                                           onClick={() => generateWalletHasDownloadedFileAction()}>{translate('x_Download')}</a>
                                        <p className="sr-only" id="x_KeystoreDesc">{translate('x_KeystoreDesc')}</p>
                                        <br/><br/><br/><br/>
                                    </div>
                                    <div className="col-xs-12 alert alert-danger">
                                      <span>
                                      MyEtherWallet.com is not a web wallet &amp; does not store or transmit this secret information at any time. <br/>
                                      <strong>If you do not save your wallet file and password, we cannot recover them.</strong><br/>
                                      Save your wallet file now &amp; back it up in a second location (not on your computer).
                                      <br/><br/>
                                      <a role="button"
                                         className={`btn btn-info ${hasDownloadedWalletFile ? '' : 'disabled'}`}
                                         onClick={() => generateWalletContinueToPaperAction()}> I understand. Continue. </a>
                                    </span>
                                    </div>
                                </section>
                            )
                        }
                    </main>
                </div>
            </section>
        )
    }
}

export default reduxForm({
    form: 'generateWalletPassword' // a unique name for this form
})(GenerateWalletPasswordComponent);
