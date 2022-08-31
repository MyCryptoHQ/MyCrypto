import { ComponentProps } from 'react';

import TextComponent from './Text';

export default { title: 'Atoms/Text', component: TextComponent };

const Template = (args: ComponentProps<typeof TextComponent>) => <TextComponent {...args} />;

export const Default = Template.bind({});
Default.args = {
  children: 'Hello World'
};

export const Truncate = Template.bind({});
Truncate.args = {
  children:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  truncate: true
};
