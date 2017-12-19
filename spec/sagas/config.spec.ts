import { configuredStore } from 'store';
import { delay } from 'redux-saga';
import { call, cancel, fork, put, take, select } from 'redux-saga/effects';
import { cloneableGenerator, createMockTask } from 'redux-saga/utils';
import { toggleOfflineConfig, changeNode, changeNodeIntent, setLatestBlock } from 'actions/config';
import {
  pollOfflineStatus,
  handlePollOfflineStatus,
  handleNodeChangeIntent,
  handleTogglePollOfflineStatus,
  reload,
  unsetWeb3Node,
  unsetWeb3NodeOnWalletEvent,
  equivalentNodeOrDefault
} from 'sagas/config';
import { NODES } from 'config/data';
import {
  getNode,
  getNodeConfig,
  getOffline,
  getForceOffline,
  getCustomNodeConfigs
} from 'selectors/config';
import { INITIAL_STATE as configInitialState } from 'reducers/config';
import { getWalletInst } from 'selectors/wallet';
import { Web3Wallet } from 'libs/wallet';
import { RPCNode } from 'libs/nodes';
import { showNotification } from 'actions/notifications';
import translate from 'translations';

// init module
configuredStore.getState();

describe('pollOfflineStatus*', () => {
  const nav = navigator as any;
  const doc = document as any;
  const data = {} as any;
  data.gen = cloneableGenerator(pollOfflineStatus)();
  const node = {
    lib: {
      ping: jest.fn()
    }
  };
  const isOffline = true;
  const isForcedOffline = true;
  const raceSuccess = {
    pingSucceeded: true
  };
  const raceFailure = {
    pingSucceeded: false
  };

  let originalHidden;
  let originalOnLine;
  let originalRandom;

  beforeAll(() => {
    // backup global config
    originalHidden = document.hidden;
    originalOnLine = navigator.onLine;
    originalRandom = Math.random;

    // mock config
    Object.defineProperty(document, 'hidden', { value: false, writable: true });
    Object.defineProperty(navigator, 'onLine', { value: true, writable: true });
    Math.random = () => 0.001;
  });

  afterAll(() => {
    // restore global config
    Object.defineProperty(document, 'hidden', {
      value: originalHidden,
      writable: false
    });
    Object.defineProperty(navigator, 'onLine', {
      value: originalOnLine,
      writable: false
    });
    Math.random = originalRandom;
  });

  it('should select getNodeConfig', () => {
    expect(data.gen.next().value).toEqual(select(getNodeConfig));
  });

  it('should select getOffline', () => {
    expect(data.gen.next(node).value).toEqual(select(getOffline));
  });

  it('should select getForceOffline', () => {
    data.isOfflineClone = data.gen.clone();
    expect(data.gen.next(isOffline).value).toEqual(select(getForceOffline));
  });

  it('should be done if isForcedOffline', () => {
    data.clone1 = data.gen.clone();
    expect(data.clone1.next(isForcedOffline).done).toEqual(true);
  });

  it('should call delay if document is hidden', () => {
    data.clone2 = data.gen.clone();
    doc.hidden = true;

    expect(data.clone2.next(!isForcedOffline).value).toEqual(call(delay, 1000));
  });

  it('should race pingSucceeded and timeout', () => {
    doc.hidden = false;
    expect(data.gen.next(!isForcedOffline).value).toMatchSnapshot();
  });

  it('should put showNotification and put toggleOfflineConfig if pingSucceeded && isOffline', () => {
    expect(data.gen.next(raceSuccess).value).toEqual(
      put(showNotification('success', 'Your connection to the network has been restored!', 3000))
    );
    expect(data.gen.next().value).toEqual(put(toggleOfflineConfig()));
  });

  it('should put showNotification and put toggleOfflineConfig if !pingSucceeded && !isOffline', () => {
    nav.onLine = !isOffline;

    data.isOfflineClone.next(!isOffline);
    data.isOfflineClone.next(!isForcedOffline);

    data.clone3 = data.isOfflineClone.clone();

    expect(data.isOfflineClone.next(raceFailure).value).toMatchSnapshot();
    expect(data.isOfflineClone.next().value).toEqual(put(toggleOfflineConfig()));
  });

  it('should call delay when neither case is true', () => {
    expect(data.clone3.next(raceSuccess).value).toEqual(call(delay, 5000));
  });
});

describe('handlePollOfflineStatus*', () => {
  const gen = handlePollOfflineStatus();
  const mockTask = createMockTask();

  it('should fork pollOffineStatus', () => {
    const expectedForkYield = fork(pollOfflineStatus);
    expect(gen.next().value).toEqual(expectedForkYield);
  });

  it('should take CONFIG_STOP_POLL_OFFLINE_STATE', () => {
    expect(gen.next(mockTask).value).toEqual(take('CONFIG_STOP_POLL_OFFLINE_STATE'));
  });

  it('should cancel pollOfflineStatus', () => {
    expect(gen.next().value).toEqual(cancel(mockTask));
  });
});

describe('handleTogglePollOfflineStatus*', () => {
  const data = {} as any;
  data.gen = cloneableGenerator(handleTogglePollOfflineStatus)();
  const isForcedOffline = true;

  it('should select getForceOffline', () => {
    expect(data.gen.next().value).toEqual(select(getForceOffline));
  });

  it('should fork handlePollOfflineStatus when isForcedOffline', () => {
    data.clone = data.gen.clone();
    expect(data.gen.next(isForcedOffline).value).toEqual(fork(handlePollOfflineStatus));
  });

  it('should call handlePollOfflineStatus when !isForcedOffline', () => {
    expect(data.clone.next(!isForcedOffline).value).toEqual(call(handlePollOfflineStatus));
  });

  it('should be done', () => {
    expect(data.gen.next().done).toEqual(true);
    expect(data.clone.next().done).toEqual(true);
  });
});

describe('handleNodeChangeIntent*', () => {
  let originalRandom;

  // normal operation variables
  const defaultNode = configInitialState.nodeSelection;
  const defaultNodeConfig = NODES[defaultNode];
  const newNode = Object.keys(NODES).reduce(
    (acc, cur) => (NODES[acc].network === defaultNodeConfig.network ? cur : acc)
  );
  const newNodeConfig = NODES[newNode];
  const changeNodeIntentAction = changeNodeIntent(newNode);
  const truthyWallet = true;
  const latestBlock = '0xa';
  const raceSuccess = {
    lb: latestBlock
  };
  const raceFailure = {
    to: true
  };

  const data = {} as any;
  data.gen = cloneableGenerator(handleNodeChangeIntent)(changeNodeIntentAction);

  beforeAll(() => {
    originalRandom = Math.random;
    Math.random = () => 0.001;
  });

  afterAll(() => {
    Math.random = originalRandom;
  });

  it('should select getNode', () => {
    expect(data.gen.next().value).toEqual(select(getNode));
  });

  it('should select nodeConfig', () => {
    expect(data.gen.next(defaultNode).value).toEqual(select(getNodeConfig));
  });

  it('should race getCurrentBlock and delay', () => {
    expect(data.gen.next(defaultNodeConfig).value).toMatchSnapshot();
  });

  it('should put showNotification and put changeNode if timeout', () => {
    data.clone1 = data.gen.clone();
    expect(data.clone1.next(raceFailure).value).toEqual(
      put(showNotification('danger', translate('ERROR_32'), 5000))
    );
    expect(data.clone1.next().value).toEqual(put(changeNode(defaultNode, defaultNodeConfig)));
    expect(data.clone1.next().done).toEqual(true);
  });

  it('should put setLatestBlock', () => {
    expect(data.gen.next(raceSuccess).value).toEqual(put(setLatestBlock(latestBlock)));
  });

  it('should put changeNode', () => {
    expect(data.gen.next().value).toEqual(
      put(changeNode(changeNodeIntentAction.payload, newNodeConfig))
    );
  });

  it('should select getWalletInst', () => {
    expect(data.gen.next().value).toEqual(select(getWalletInst));
  });

  it('should call reload if wallet exists and network is new', () => {
    data.clone2 = data.gen.clone();
    expect(data.clone2.next(truthyWallet).value).toEqual(call(reload));
    expect(data.clone2.next().done).toEqual(true);
  });

  it('should be done', () => {
    expect(data.gen.next().done).toEqual(true);
  });

  // custom node variables
  const customNodeConfigs = [
    {
      name: 'name',
      url: 'url',
      port: 443,
      network: 'network'
    }
  ];
  const customNodeIdFound = 'url:443';
  const customNodeIdNotFound = 'notFound';
  const customNodeAction = changeNodeIntent(customNodeIdFound);
  const customNodeNotFoundAction = changeNodeIntent(customNodeIdNotFound);
  data.customNode = handleNodeChangeIntent(customNodeAction);
  data.customNodeNotFound = handleNodeChangeIntent(customNodeNotFoundAction);

  // test custom node
  it('should select getCustomNodeConfig and match race snapshot', () => {
    data.customNode.next();
    data.customNode.next(defaultNode);
    expect(data.customNode.next(defaultNodeConfig).value).toEqual(select(getCustomNodeConfigs));
    expect(data.customNode.next(customNodeConfigs).value).toMatchSnapshot();
  });

  // test custom node not found
  it('should select getCustomNodeConfig, put showNotification, put changeNode', () => {
    data.customNodeNotFound.next();
    data.customNodeNotFound.next(defaultNode);
    expect(data.customNodeNotFound.next(defaultNodeConfig).value).toEqual(
      select(getCustomNodeConfigs)
    );
    expect(data.customNodeNotFound.next(customNodeConfigs).value).toEqual(
      put(
        showNotification(
          'danger',
          `Attempted to switch to unknown node '${customNodeNotFoundAction.payload}'`,
          5000
        )
      )
    );
    expect(data.customNodeNotFound.next().value).toEqual(
      put(changeNode(defaultNode, defaultNodeConfig))
    );
    expect(data.customNodeNotFound.next().done).toEqual(true);
  });
});

describe('unsetWeb3Node*', () => {
  const node = 'web3';
  const mockNodeConfig = { network: 'ETH' };
  const newNode = equivalentNodeOrDefault(mockNodeConfig);
  const gen = unsetWeb3Node();

  it('should select getNode', () => {
    expect(gen.next().value).toEqual(select(getNode));
  });

  it('should select getNodeConfig', () => {
    expect(gen.next(node).value).toEqual(select(getNodeConfig));
  });

  it('should put changeNodeIntent', () => {
    expect(gen.next(mockNodeConfig).value).toEqual(put(changeNodeIntent(newNode)));
  });

  it('should be done', () => {
    expect(gen.next().done).toEqual(true);
  });

  it('should return early if node type is not web3', () => {
    const gen1 = unsetWeb3Node();
    gen1.next();
    gen1.next('notWeb3');
    expect(gen1.next().done).toEqual(true);
  });
});

describe('unsetWeb3NodeOnWalletEvent*', () => {
  const fakeAction = {};
  const mockNode = 'web3';
  const mockNodeConfig = { network: 'ETH' };
  const gen = unsetWeb3NodeOnWalletEvent(fakeAction);

  it('should select getNode', () => {
    expect(gen.next().value).toEqual(select(getNode));
  });

  it('should select getNodeConfig', () => {
    expect(gen.next(mockNode).value).toEqual(select(getNodeConfig));
  });

  it('should put changeNodeIntent', () => {
    expect(gen.next(mockNodeConfig).value).toEqual(
      put(changeNodeIntent(equivalentNodeOrDefault(mockNodeConfig)))
    );
  });

  it('should be done', () => {
    expect(gen.next().done).toEqual(true);
  });

  it('should return early if node type is not web3', () => {
    const gen1 = unsetWeb3NodeOnWalletEvent({ payload: false });
    gen1.next(); //getNode
    gen1.next('notWeb3'); //getNodeConfig
    expect(gen1.next().done).toEqual(true);
  });

  it('should return early if wallet type is web3', () => {
    const mockAddress = '0x0';
    const mockNetwork = 'ETH';
    const mockWeb3Wallet = new Web3Wallet(mockAddress, mockNetwork);
    const gen2 = unsetWeb3NodeOnWalletEvent({ payload: mockWeb3Wallet });
    gen2.next(); //getNode
    gen2.next('web3'); //getNodeConfig
    expect(gen2.next().done).toEqual(true);
  });
});

describe('equivalentNodeOrDefault', () => {
  const originalNodeList = Object.keys(NODES);
  const appDefaultNode = configInitialState.nodeSelection;
  const mockNodeConfig = {
    network: 'ETH',
    service: 'fakeService',
    lib: new RPCNode('fakeEndpoint'),
    estimateGas: false
  };

  afterEach(() => {
    Object.keys(NODES).forEach(node => {
      if (originalNodeList.indexOf(node) === -1) {
        delete NODES[node];
      }
    });
  });

  it('should return node with equivalent network', () => {
    const node = equivalentNodeOrDefault({
      ...mockNodeConfig,
      network: 'Kovan'
    });
    expect(NODES[node].network).toEqual('Kovan');
  });

  it('should return app default if no eqivalent is found', () => {
    const node = equivalentNodeOrDefault({
      ...mockNodeConfig,
      network: 'noEqivalentExists'
    });
    expect(node).toEqual(appDefaultNode);
  });

  it('should ignore web3 from node list', () => {
    NODES.web3 = {
      ...mockNodeConfig,
      network: 'uniqueToWeb3'
    };

    const node = equivalentNodeOrDefault({
      ...mockNodeConfig,
      network: 'uniqueToWeb3'
    });
    expect(node).toEqual(appDefaultNode);
  });
});
