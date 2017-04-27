import React, {Component} from "react";
import {Link} from "react-router";


const tabs = [
    {"name": "Generate Wallet", "link": "/"},
    {"name": "Send Ether & Tokens"},
    {"name": "Swap"},
    {"name": "Send Offline"},
    {"name": "Contracts"},
    {"name": "View Wallet", "link": "view-wallet"},
    {"name": "Help"}

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
                <nav role="navigation" aria-label="main navigation" className="container nav-container overflowing">
                    {this.state.showLeftArrow && <a aria-hidden="true" className="nav-arrow-left"
                                                    onClick={() => this.scrollLeft(100)}>&#171;</a> }
                    <div className="nav-scroll">
                        <ul className="nav-inner">
                            {tabs.map((object, i) => {
                                    return (
                                        <Link to={object.link}>
                                            <li className="nav-item"
                                                key={i}
                                                onClick={this.tabClick(i)}>
                                                <a tabIndex="0" aria-label="nav item: {{tab.name | translate}}">
                                                    {object.name}
                                                </a>
                                            </li>
                                        </Link>

                                    )
                                }
                            )}
                        </ul>
                    </div>
                    {this.state.showRightArrow &&
                    <a aria-hidden="true" className="nav-arrow-right"
                       onClick={() => this.scrollRight(100)}
                       ng-mouseover="scrollHoverIn(false,2);" ng-mouseleave="scrollHoverOut()">&#187;</a
                    >}
                </nav>
            </div>

        )
    }
}
