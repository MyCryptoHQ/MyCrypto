// @flow
import React from 'react';

export default class UnitDropdown extends React.Component {
    props: {
        value: string,
        options: string[],
        onChange?: (value: string) => void
    };
    state: {
        expanded: boolean
    } = {
        expanded: false
    };

    render() {
        const { value, options, onChange } = this.props;
        const isReadonly = !onChange;

        return (
            <div className="input-group-btn">
                <a
                    style={{ minWidth: 170 }}
                    className="btn btn-default dropdown-toggle"
                    onClick={this.onToggleExpand}
                >
                    <strong>
                        {value}<i className="caret" />
                    </strong>
                </a>
                {this.state.expanded &&
                    !isReadonly &&
                    <ul className="dropdown-menu dropdown-menu-right">
                        {options.map(o =>
                            <li>
                                <a
                                    className={value === o ? 'active' : ''}
                                    onClick={this.props.onChange}
                                >
                                    {o}
                                </a>
                            </li>
                        )}
                    </ul>}
            </div>
        );
    }

    onToggleExpand = () => {
        this.setState(state => {
            return {
                expanded: !state.expanded
            };
        });
    };
}
