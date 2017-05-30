import React, {Component} from "react";
import {Link} from "react-router";
import translate from "translations";

const tabs = [
    {
        name: 'NAV_GenerateWallet',
        link: '/'
    },
    {
        name: 'NAV_SendEther'
    },
    {
        name: 'NAV_Swap'
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
]

export default class TabsOptions extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showLeftArrow: false,
            showRightArrow: false
        }
    }

    tabClick() {
    }

    scrollLeft() {
    }

    scrollRight() {
    }


    render() {
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
                                        return (
                                            <li className='nav-item' key={i} onClick={this.tabClick(i)}>
                                                <Link to={object.link} key={i}
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
                           onClick={() => this.scrollRight(100)}>&#187;</a
                        >
                    }
                </nav>
            </div>

        )
    }
}
