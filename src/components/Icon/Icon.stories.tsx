import { ComponentProps } from 'react';

import IconComponent from '.';

export default { title: 'Atoms/Icon', component: IconComponent };

const Template = (args: ComponentProps<typeof IconComponent>) => <IconComponent {...args} />;

export const ExpandableClosed = Template.bind({});
ExpandableClosed.args = {
  title: 'Expandable - closed',
  type: 'expandable',
  isExpanded: false,
  height: '1em'
};

export const ExpandableOpen = Template.bind({});
ExpandableOpen.args = {
  title: 'Expandable - open',
  type: 'expandable',
  isExpanded: true,
  height: '1em'
};

export const Filter = Template.bind({});
Filter.args = {
  type: 'sort',
  height: '1em',
  color: 'linkAction'
};

export const Edit = Template.bind({});
Edit.args = {
  type: 'edit',
  height: '1em',
  color: 'linkAction'
};
