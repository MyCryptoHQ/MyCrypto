// @flow
import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class DropdownComponent extends Component {
    static propTypes = {
        value: PropTypes.object.isRequired,
        options: PropTypes.arrayOf(PropTypes.object).isRequired,
        ariaLabel: PropTypes.string.isRequired,
        formatTitle: PropTypes.func.isRequired,
        extra: PropTypes.node,
        onChange: PropTypes.func.isRequired
    };

    // FIXME
    props: {
        value: any,
        options: any[],
        ariaLabel: string,
        formatTitle: (option: any) => any,
        extra?: any,
        onChange: (value: any) => void
    };

    state = {
        expanded: false
    };

    render() {
        const { options, value, ariaLabel, extra } = this.props;

        return (
            <span className="dropdown">
                <a
                    tabIndex="0"
                    aria-haspopup="true"
                    aria-expanded="false"
                    aria-label={ariaLabel}
                    className="dropdown-toggle"
                    onClick={this.toggleExpanded}
                >
                    {this.formatTitle(value)}
                    <i className="caret" />
                </a>
                {this.state.expanded &&
                    <ul className="dropdown-menu">
                        {options.map((option, i) => {
                            return (
                                <li key={i}>
                                    <a
                                        className={option === value ? 'active' : ''}
                                        onClick={this.onChange.bind(null, option)}
                                    >
                                        {this.formatTitle(option)}
                                    </a>
                                </li>
                            );
                        })}
                        {extra}
                    </ul>}
            </span>
        );
    }

    formatTitle(option: any) {
        return this.props.formatTitle(option);
    }

    toggleExpanded = () => {
        this.setState(state => {
            return {
                expanded: !state.expanded
            };
        });
    };

    onChange = (value: any) => {
        this.props.onChange(value);
        this.setState({ expanded: false });
    };
}
