import React, {PureComponent} from 'react';

export default class DashboardCardComponent extends PureComponent {
    constructor(props) {
        super(props)
    }

    static propTypes = {
        title: React.PropTypes.string,
        body: React.PropTypes.string,
        userId: React.PropTypes.number,
        id: React.PropTypes.number
    }

    render() {
        return (
            <section className="container ng-scope" style={{minHeight: '50%'}}>

                <div className="tab-content">

                    {/*<!-- ngIf: globalService.currentTab==globalService.tabs.generateWallet.id -->*/}
                    <main className="tab-pane active text-center ng-scope"
                          role="main">

                        <section className="row">
                            <h1 aria-live="polite" className="ng-scope">Generate
                                Wallet</h1>
                            <div className="col-sm-8 col-sm-offset-2">
                                <h4 className="ng-scope">Enter a strong password (at least 9
                                    characters)</h4>
                                <div className="input-group">
                                    <input name="password"
                                           className="form-control ng-pristine ng-untouched ng-valid ng-empty is-invalid"
                                           type="password" placeholder="Do NOT forget to save this!
                                    " aria-label="Enter a strong password (at least 9 characters)
                                    "/>
                                    <span tabIndex="0" aria-label="make password visible" role="button"
                                          className="input-group-addon eye"></span>
                                </div>
                                <br/>
                                <a tabIndex="0" role="button" className="btn btn-primary btn-block ng-scope"
                                >Generate Wallet</a>
                            </div>
                        </section>
                    </main>

                </div>

                {/*<!--*/}
                {/*<section className="loading-wrap" ng-hide="1==1">*/}
                {/*<div className="loading">*/}
                {/*<img src="images/loading.gif" />*/}
                {/*<h1> Loading... </h1>*/}
                {/*</section>*/}
                {/*-->*/}

            </section>
        )
    }

}
