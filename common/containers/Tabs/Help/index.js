import React from "react";

const Help = () => (
    <section className="container" style={{minHeight: '50%'}}>
        <div className="tab-content">
            <article className="tab-pane help active">
                <h1 translate="NAV_Help">Help</h1>
                <article className="collapse-container">
                    <div>
                        <ul>
                            <li><h3><a
                                href="https://www.reddit.com/r/ethereum/comments/47nkoi/psa_check_your_ethaddressorg_wallets_and_any/d0eo45o"
                                target="_blank"><span className="text-danger" translate="HELP_Warning">If you created a wallet -or- downloaded the repo before <strong>Dec. 31st, 2015</strong>, please check your wallets &amp;
                                download a new version of the repo. Click for details.</span></a></h3></li>
                            <li><h3>This
                                page is deprecated. Please check out our more up-to-date and
                                searchable <a href="https://myetherwallet.groovehq.com/help_center" target="_blank">Knowledge
                                    Base. </a></h3></li>
                        </ul>
                    </div>
                </article>
            </article>
        </div>
    </section>
);

export default Help
