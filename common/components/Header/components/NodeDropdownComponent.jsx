import React, {Component} from 'react';

const nodeList = [
    {
        'name': 'ETH',
        'blockExplorerTX': 'https://etherscan.io/tx/[[txHash]]',
        'blockExplorerAddr': 'https://etherscan.io/address/[[address]]',
        // 'type': nodes.nodeTypes.ETH,
        'eip155': true,
        'chainId': 1,
        // 'tokenList': require('./tokens/ethTokens.json'),
        // 'abiList': require('./abiDefinitions/ethAbi.json'),
        'estimateGas': true,
        'service': 'MyEtherWallet',
        // 'lib': new nodes.customNode('https://api.myetherapi.com/eth', '')
    },
    {
        'name': 'ETH',
        'blockExplorerTX': 'https://etherscan.io/tx/[[txHash]]',
        'blockExplorerAddr': 'https://etherscan.io/address/[[address]]',
        // 'type': nodes.nodeTypes.ETH,
        'eip155': true,
        'chainId': 1,
        // 'tokenList': require('./tokens/ethTokens.json'),
        // 'abiList': require('./abiDefinitions/ethAbi.json'),
        'estimateGas': false,
        'service': 'Etherscan.io',
        // 'lib': require('./nodeHelpers/etherscan')
    },
    {
        'name': 'Ropsten',
        // 'type': nodes.nodeTypes.Ropsten,
        'blockExplorerTX': 'https://ropsten.etherscan.io/tx/[[txHash]]',
        'blockExplorerAddr': 'https://ropsten.etherscan.io/address/[[address]]',
        'eip155': true,
        'chainId': 3,
        // 'tokenList': require('./tokens/ropstenTokens.json'),
        // 'abiList': require('./abiDefinitions/ropstenAbi.json'),
        'estimateGas': false,
        'service': 'MyEtherWallet',
        // 'lib': new nodes.customNode('https://api.myetherapi.com/rop', '')
    },
    {
        'name': 'Kovan',
        // 'type': nodes.nodeTypes.Kovan,
        'blockExplorerTX': 'https://kovan.etherscan.io/tx/[[txHash]]',
        'blockExplorerAddr': 'https://kovan.etherscan.io/address/[[address]]',
        'eip155': true,
        'chainId': 42,
        // 'tokenList': require('./tokens/kovanTokens.json'),
        // 'abiList': require('./abiDefinitions/kovanAbi.json'),
        'estimateGas': false,
        'service': 'Etherscan.io',
        // 'lib': require('./nodeHelpers/etherscanKov')
    },
    {
        'name': 'ETC',
        'blockExplorerTX': 'https://gastracker.io/tx/[[txHash]]',
        'blockExplorerAddr': 'https://gastracker.io/addr/[[address]]',
        // 'type': nodes.nodeTypes.ETC,
        'eip155': true,
        'chainId': 61,
        // 'tokenList': require('./tokens/etcTokens.json'),
        // 'abiList': require('./abiDefinitions/etcAbi.json'),
        'estimateGas': false,
        'service': 'Epool.io',
        // 'lib': new nodes.customNode('https://mewapi.epool.io', '')
    }
]

export default class NodeDropdownComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            nodeToggle: false,
            nodeSelection: 0
        }
    }

    customNodeModalOpen() {

    }

    changeNode(i) {
        let nextState = this.state;
        nextState["nodeSelection"] = i;
        nextState['nodeToggle'] = false;
        this.setState(nextState);
    }

    nodeToggle() {
        let nextState = this.state;
        nextState['nodeToggle'] = !nextState['nodeToggle'];
        this.setState(nextState)
    }

    render() {
        return (
            <span className="dropdown">
              <a tabIndex="0"
                 aria-haspopup="true"
                 aria-label="change node. current node ETH node by MyEtherWallet"
                 className="dropdown-toggle" onClick={() => this.nodeToggle()}>
                  {nodeList[this.state.nodeSelection].name}
                  <small>{' '} ({nodeList[this.state.nodeSelection].service})</small>
                  <i className="caret"/>
              </a>
                {
                    this.state.nodeToggle &&
                    <ul className="dropdown-menu">
                        {nodeList.map((object, i) => {
                            return (
                                <li key={i} onClick={() => this.changeNode(i)}>
                                    <a>
                                        {object.name}
                                        <small className={i === this.state.nodeSelection ? 'active' : ''}>
                                            ({object.service})
                                        </small>
                                    </a>
                                </li>
                            )
                        })}
                        <li>
                            <a onClick={this.customNodeModalOpen()}>
                                Add Custom Node
                            </a>
                        </li>
                    </ul>
                }
            </span>
        )
    }
}
