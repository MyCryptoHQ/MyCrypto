import React, {Component} from 'react';
import {nodeList} from 'reducers/config'
import PropTypes from 'prop-types';


export default class NodeDropdownComponent extends Component {
    constructor(props) {
        super(props);
    }

    static propTypes = {
        changeNode: PropTypes.func,
        toggleNodeDropdown: PropTypes.func,
        nodeSelection: PropTypes.number,
        nodeToggle: PropTypes.bool
    };

    customNodeModalOpen() {

    }

    render() {
        let {
            changeNode,
            toggleNodeDropdown,
            nodeSelection,
            nodeToggle
        } = this.props;

        return (
            <span className="dropdown">
              <a tabIndex="0"
                 aria-haspopup="true"
                 aria-label="change node. current node ETH node by MyEtherWallet"
                 className="dropdown-toggle"
                 onClick={() => toggleNodeDropdown()}>
                  {nodeList[nodeSelection].name}
                  <small>{' '} ({nodeList[nodeSelection].service})</small>
                  <i className="caret"/>
              </a>
                {
                    nodeToggle &&
                    <ul className="dropdown-menu">
                        {nodeList.map((object, i) => {
                            return (
                                <li key={i} onClick={() => changeNode(i)}>
                                    <a>
                                        {object.name}
                                        <small className={i === nodeSelection ? 'active' : ''}>
                                            {' '}({object.service})
                                        </small>
                                    </a>
                                </li>
                            )
                        })}
                        <li>
                            <a onClick={() => this.customNodeModalOpen()}>
                                Add Custom Node
                            </a>
                        </li>
                    </ul>
                }
            </span>
        )
    }
}
