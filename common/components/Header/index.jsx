// @flow
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TabsOptions from './components/TabsOptions';
import { Link } from 'react-router';
import Dropdown from '../ui/Dropdown';
import { languages, nodeList } from '../../config/data';

export default class Header extends Component {
    static propTypes = {
        location: PropTypes.object,

        // Language DropDown
        changeLanguage: PropTypes.func,
        languageSelection: PropTypes.object,

        // Node Dropdown
        changeNode: PropTypes.func,
        nodeSelection: PropTypes.object
    };

    render() {
        const { languageSelection, changeLanguage, changeNode, nodeSelection } = this.props;

        return (
            <div>
                <section className="bg-gradient header-branding">
                    <section className="container">
                        <Link to={'/'} className="brand" aria-label="Go to homepage">
                            {/* TODO - don't hardcode image path*/}
                            <img
                                src={'https://www.myetherwallet.com/images/logo-myetherwallet.svg'}
                                height="64px"
                                width="245px"
                                alt="MyEtherWallet"
                            />
                        </Link>
                        <div className="tagline">
                            <span style={{ maxWidth: '395px' }}>
                                Open-Source & Client-Side Ether Wallet · v3.6.0
                            </span>
                            &nbsp;&nbsp;&nbsp;
                            <Dropdown
                                ariaLabel={`change language. current language ${languageSelection.name}`}
                                options={languages}
                                formatTitle={o => o.name}
                                value={languageSelection}
                                extra={[
                                    <li key={'separator'} role="separator" className="divider" />,
                                    <li key={'disclaimer'}>
                                        <a data-toggle="modal" data-target="#disclaimerModal">
                                            Disclaimer
                                        </a>
                                    </li>
                                ]}
                                onChange={changeLanguage}
                            />
                            &nbsp;&nbsp;&nbsp;
                            <Dropdown
                                ariaLabel={`change node. current node ${nodeSelection.name} node by ${nodeSelection.service}`}
                                options={nodeList}
                                formatTitle={o => [
                                    o.name,
                                    ' ',
                                    <small key="service">({o.service})</small>
                                ]}
                                value={nodeSelection}
                                extra={
                                    <li>
                                        <a onClick={() => {}}>
                                            Add Custom Node
                                        </a>
                                    </li>
                                }
                                onChange={changeNode}
                            />
                        </div>
                    </section>
                </section>

                <TabsOptions {...this.props} />

            </div>
        );
    }
}
