import React, {Component} from 'react';

export default class GenerateWalletPasswordComponent extends Component {
    constructor(props) {
        super(props)
    }

    static propTypes = {
        title: React.PropTypes.string,
        body: React.PropTypes.string,
        userId: React.PropTypes.number,
        id: React.PropTypes.number
    };

    render() {
        return (
            <section className="container" style={{minHeight: '50%'}}>
                <div className="tab-content">
                    <main className="tab-pane active text-center" role="main">
                        <section className="row">
                            <h1 aria-live="polite">Generate Wallet</h1>
                            <div className="col-sm-8 col-sm-offset-2">
                                <h4>Enter a strong password (at least 9 characters)</h4>
                                <div className="input-group">
                                    <input name="password"
                                           className="form-control"
                                           type="password" placeholder="Do NOT forget to save this!"
                                           aria-label="Enter a strong password (at least 9 characters)"/>
                                    <span tabIndex="0" aria-label="make password visible" role="button"
                                          className="input-group-addon eye"/>
                                </div>
                                <br/>
                                <a tabIndex="0" role="button" className="btn btn-primary btn-block">
                                    Generate Wallet
                                </a>
                            </div>
                        </section>
                    </main>
                </div>
            </section>
        )
    }
}
