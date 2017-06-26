import React, {Component} from 'react';
import {Link} from 'react-router';
import translate from 'translations';
import PropTypes from 'prop-types';

const tabs = [
    {
        name: 'NAV_GenerateWallet',
        link: '/'
    },
    {
        name: 'NAV_SendEther',
        link: 'send-transaction'
    },
    {
        name: 'NAV_Swap',
        link: 'swap'
    },
    {
        name: 'NAV_Offline'
    },
    {
        name: 'NAV_Contracts'
    },
    {
        name: 'NAV_ViewWallet',
        link: 'view-wallet'
    },
    {
        name: 'NAV_Help',
        link: 'help'
    }
];


export default class TabsOptions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showLeftArrow: false,
            showRightArrow: false
        }
    }

    static propTypes = {
        location: PropTypes.object
    };

    tabClick() {
    }

    scrollLeft() {
    }

    scrollRight() {
    }

    render() {
        const {location} = this.props;
        return (
            <div>
                <nav role='navigation' aria-label='main navigation' className='container nav-container overflowing'>
                    {
                        this.state.showLeftArrow && <a aria-hidden='true'
                                                       className='nav-arrow-left'
                                                       onClick={() => this.scrollLeft(100)}>&#171;</a>
                    }
                    <div className='nav-scroll'>
                        <ul className='nav-inner'>
                            {
                                tabs.map((object, i) => {
                                        // if the window pathname is the same or similar to the tab objects name, set the active toggle
                                        const activeOrNot = (location.pathname === object.link || location.pathname.substring(1) === object.link) ? 'active' : '';
                                        return (
                                            <li className={`nav-item ${activeOrNot}`}
                                                key={i} onClick={this.tabClick(i)}>
                                                <Link to={object.link}
                                                      aria-label={`nav item: ${translate(object.name)}`}>
                                                    {translate(object.name)}
                                                </Link>
                                            </li>
                                        )
                                    }
                                )
                            }
                        </ul>
                    </div>
                    {
                        this.state.showRightArrow &&
                        <a aria-hidden='true'
                           className='nav-arrow-right'
                           onClick={() => this.scrollRight(100)}>&#187;</a>
                    }
                </nav>
            </div>

        )
    }
}
