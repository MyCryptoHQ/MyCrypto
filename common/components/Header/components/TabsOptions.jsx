import React, {Component} from "react";

const tabs = [
    {"name": "Generate Wallet"},
    {"name": "Send Ether & Tokens"},
    {"name": "Swap"},
    {"name": "Send Offline"},
    {"name": "Contracts"},
    {"name": "View Wallet"},
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
                                        <li className="nav-item"
                                            key={i}
                                            onClick={this.tabClick(i)}>
                                            <a tabIndex="0" aria-label="nav item: {{tab.name | translate}}">
                                                {object.name}
                                            </a>
                                        </li>
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
