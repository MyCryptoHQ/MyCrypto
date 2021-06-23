import { ComponentProps } from 'react';

import { DEFAULT_NETWORK } from '@config';
import { customNodeConfig } from '@fixtures';
import { noOp } from '@utils';

import AddOrEditNetworkNode from './AddOrEditNetworkNode';

const networkId = DEFAULT_NETWORK;

export default { title: 'Features/AddorEditNetworkNode', component: AddOrEditNetworkNode };

const Template = (args: ComponentProps<typeof AddOrEditNetworkNode>) => (
  <div className="sb-container" style={{ maxWidth: '800px' }}>
    <AddOrEditNetworkNode {...args} />
  </div>
);

const defaultProps = {
  networkId,
  editNode: undefined,
  onComplete: noOp,
  isAddingCustomNetwork: false
};

export const AddNetworkNode = Template.bind({});
AddNetworkNode.storyName = 'AddNetworkNode';
AddNetworkNode.args = {
  ...defaultProps
};

export const EditNetworkNode = Template.bind({});
EditNetworkNode.storyName = 'EditNetworkNode';
EditNetworkNode.args = {
  ...defaultProps,
  editNode: customNodeConfig
};

// storiesOf('Features/NetworkNodeForm', module)
//   .add('Add node', () => addNetworkNode, {
//     design: {
//       type: 'figma',
//       url:
//         'https://www.figma.com/file/BY0SWc75teEUZzws8JdgLMpy/%5BMyCrypto%5D-GAU-Master?node-id=1522%3A93762'
//     }
//   })
//   .add('Edit node', () => editNetworkNode, {
//     design: {
//       type: 'figma',
//       url:
//         'https://www.figma.com/file/BY0SWc75teEUZzws8JdgLMpy/%5BMyCrypto%5D-GAU-Master?node-id=1522%3A93762'
//     }
//   });
