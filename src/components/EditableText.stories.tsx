import { ComponentProps } from 'react';

import EditableTextComponent from './EditableText';

export default { title: 'Molecules/EditableText', component: EditableTextComponent };

const Template = (args: ComponentProps<typeof EditableTextComponent>) => (
  <EditableTextComponent {...args} />
);

export const Value = Template.bind({});
Value.args = {
  value: 'Hello'
};

export const Placeholder = Template.bind({});
Placeholder.args = {
  placeholder: '(empty)'
};

export const Truncate = Template.bind({});
Truncate.args = {
  value:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  truncate: true,
  maxCharLen: 34
};
